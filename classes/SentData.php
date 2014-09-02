<?php

/**
 */
class SentData
{
    private $db_connection = null;
    private $sql = null;
    public $errors = array();
    public $messages = array();

    public $good_data = array();

    public function __construct()
    {
        include_once($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
        foreach ($_POST as $k => $v)
        {
            $this->log_data($k . " : " . $v);
        }
        $this->sql = new SQLfunction();
        $this->validateData();
        if (!empty($this->errors))
            return;
        $this->writeData();
        if (!empty($this->errors))
            return;
        setCookie("contestData", json_encode($this->good_data), time() + (86400*30), '/');
    }
    private function validateData()
    {
        require_once($_SERVER['DOCUMENT_ROOT'] . "/shared/validate.php");
        $validator_checks = array('contest_name' => array('required' => true, 'numeric' => true), 'contest_instance' => array('required' => true, 'numeric' => true));
        $validate = new Validation("SentData", $_POST, $validator_checks);

        $this->errors = array_merge($validate->errors, $this->errors);
        if (array_key_exists('contest_name', $validate->good_data)) $this->good_data['contest_name_id'] = $validate->good_data['contest_name'];
        if (array_key_exists('contest_instance', $validate->good_data)) $this->good_data['contest_id'] = $validate->good_data['contest_instance'];

        $contest_temp = $this->sql->sql(array("table" => "contest_list", "fetchall" => false))->select(array('contest_name_id' => $this->good_data['contest_name_id']));
        if (!$contest_temp) {
            $this->errors[] = "Contest does not exist. Please contact administrator.";
            return;
        }

        // Now check Sent Data
        // It is only required if it exists in the contest
        $validator_checks = array('callsign' => array('required' => true, 'callsign' => true));
        for ($x = 1; $x < 6; $x++)
        {
            if ($contest_temp['type_data' . $x] <= 0) continue;
            $data_type = $this->sql->sql(array("table" => "data_type", "fetchall" => false))->select(array('data_type_id' => $contest_temp['type_data' . $x]));
            if (!$data_type) {
                $this->errors[] = "Data Type does not exist. Please contact administrator.";
                continue;
            }
            if (stripos($data_type["unique_name"], "Record Number") !== false)
            {
                if ($this->good_data["contest_id"] < 0) $this->good_data["x_data" . $x] = 1;
                else
                {
                    $query = $this->sql->sql(array("table" => "contact_data", "columns" => array("MAX" => "sentdata" . $x), "fetchall" => false))->select(array('contest_id' => $this->good_data['contest_id']));
                    if (!array_key_exists('sentdata' . $x, $query)) $this->good_data["x_data" . $x] = 1;
                    else $this->good_data["x_data" . $x] = $query['sentdata' . $x] + 1;
                }
                continue;
            }
            $validator_checks['x_data' . $x] = array('required' => ($data_type["sent_data"] != 0));
            switch ($data_type["data_type"]) 
            {
                case "number":
                    $validator_checks['x_data' . $x]['number'] = true;
                    $validator_checks['x_data' . $x]['maxlength'] = $data_type['max_length'];
                    break;
                case "string":
                    $validator_checks['x_data' . $x]['maxlength'] = $data_type['max_length'];
                    break;
                case "enum":
                    $validator_checks['x_data' . $x]['enum'] = array($data_type['enum1'], $data_type['enum2'], $data_type['enum3'], 'column' => 'shortname');
                    break;
                case "special":
                    if ($data_type["unique_name"] == "Precedent - ARRL November Sweepstakes") $validator_checks['x_data' . $x]['special'] = "NovSSPrec";
                    break;
                default:
                    $this->errors['data' . $x] = $data_type["longname"] . " is not a recognized type.";
            }
        }

        $validator_append = array('assisted_cat' => array('required' => ($contest_temp['assisted_flag'] == "Y"), 'enum' => array('assisted_cat', 'column' => 'longname')),
                                  'band_cat' => array('required' => $contest_temp['band_flag'] == "Y", 'enum' => array('band_cat', 'column' => 'longname')),
                                  'mode_cat' => array('required' => $contest_temp['mode_flag'] == "Y", 'enum' => array('mode_cat', 'column' => 'longname')),
                                  'operator_cat' => array('required' => $contest_temp['operator_flag'] == "Y", 'enum' => array('operator_cat', 'column' => 'longname')),
                                  'power_cat' => array('required' => $contest_temp['power_flag'] == "Y", 'enum' => array('power_cat', 'column' => 'longname')),
                                  'station_cat' => array('required' => $contest_temp['station_flag'] == "Y", 'enum' => array('station_cat', 'column' => 'longname')),
                                  'time_cat' => array('required' => $contest_temp['time_flag'] == "Y", 'enum' => array('time_cat', 'column' => 'longname')),
                                  'transmitter_cat' => array('required' => $contest_temp['transmitter_flag'] == "Y", 'enum' => array('transmitter_cat', 'column' => 'longname')),
                                  'overlay_cat' => array('required' => $contest_temp['overlay_flag'] == "Y", 'enum' => array('overlay_cat', 'column' => 'longname')),
                                  'operators' => array('required' => false),
                                  'club' => array('required' => false),
                                  'name' => array('required' => false),
                                  'address' => array('required' => false),
                                  'addresscity' => array('required' => false),
                                  'addressstate' => array('required' => false),
                                  'addresszip' => array('required' => false),
                                  'addresscountry' => array('required' => false));

        $validator_checks = array_merge($validator_checks, $validator_append);
        $validate = new Validation("SentData", $_POST, $validator_checks);
        $this->errors = array_merge($validate->errors, $this->errors);
        $this->good_data = array_merge($validate->good_data, $this->good_data);
    }
    private function writeData()
    {
        $contest_id = $this->good_data['contest_id'];
        $contest_name_id = $this->good_data['contest_name_id'];
        if ($this->good_data['contest_id'] < 0)
        {
            $query = $this->sql->sql(array("table" => "master_list"))->insert(array('contest_name_id' => $contest_name_id, "contest_date" => date("Y-m-d")));
            if (!$query)
                $this->errors[] = 'Cannot instantiate a new contest. Please contact Database Administrator.';
            else
                $contest_id = $query;
        }
        if ($contest_id < 0)
            return;
        unset($this->good_data['contest_id']);
        unset($this->good_data['contest_name_id']);
        $query = $this->sql->sql(array("table" => "master_list"))->update($this->good_data, array('contest_id' => $contest_id));
        if (!$query)
            $this->errors[] = 'Cannot populate the contest. Please contact Database Administrator.';

        setcookie('contest_id', $contest_id, time() + (86400 * 30), '/');
        setcookie('contest_name_id', $contest_name_id, time() + (86400 * 30), '/');
    }
    private function log_data($log_value)
    {
        include_once($_SERVER['DOCUMENT_ROOT'] . "/classes/Logging.php");
        $log = new Logging();
        touch('/tmp/hamcontest3.txt');
        $log->lfile('/tmp/hamcontest3.txt');
        $log->lwrite($log_value);
        $log->lclose();
    }
}
