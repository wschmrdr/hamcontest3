<?php
    function log_data($log_value)
    {
        $log = new Logging();
        touch('/tmp/hamcontest3.txt');
        $log->lfile('/tmp/hamcontest3.txt');
        $log->lwrite($log_value);
        $log->lclose();
    }
    function validateData($data, $isPut)
    {
        $validator_checks = array('contest_id'  => array("required" => true, "numeric" => true),
                                  'frequency'   => array("required" => true, "enum" => array('band_cat', "column" => "shortname")),
                                  'contactmode' => array("required" => true, "enum" => array('mode_cat', "column" => "shortname")),
                                  'sentcall'    => array("required" => true, "callsign" => true),
                                  'recvcall'    => array("required" => true, "callsign" => true)); 
        if ($isPut === true)
        {
            $validator_checks['entry'] = array("required" => true, "numeric" => true);
            $validator_checks['contactdate'] = array("required" => true, "date" => true);
        }
        $sql = new SQLfunction();
        $master_list = $sql->sql(array("table" => "master_list", "columns" => array("contest_name_id"), "fetchall" => false))->select(array("contest_id" => $data['contest_id']));
        $contest_temp = $sql->sql(array("table" => "contest_list", "fetchall" => false))->select(array("contest_name_id" => $master_list['contest_name_id']));
        for ($x = 1; $x < 6; $x++)
        {
            if ($contest_temp['type_data' . $x] <= 0) continue;
            $data_type = $sql->sql(array("table" => "data_type", "fetchall" => false))->select(array('data_type_id' => $contest_temp['type_data' . $x]));
            if (!$data_type) throw new Exception("Data Type does not exist. Please contact administrator.");

            $validator_checks['sentdata' . $x] = array('required' => true, 'maxlength' => ($data_type["max_length"]));
            $validator_checks['recvdata' . $x] = array('required' => true, 'maxlength' => ($data_type["max_length"]));
            switch ($data_type["data_type"])
            {
                case "number":
                    $validator_checks['sentdata' . $x]['number'] = true;
                    $validator_checks['recvdata' . $x]['number'] = true;
                    break;
                case "string":
                    break;
                case "enum":
                    $validator_checks['sentdata' . $x]['enum'] = array($data_type['enum1'], $data_type['enum2'], $data_type['enum3'], 'column' => 'shortname');
                    $validator_checks['recvdata' . $x]['enum'] = array($data_type['enum1'], $data_type['enum2'], $data_type['enum3'], 'column' => 'shortname');
                    break;
                case "special":
                    $special_name = "";
                    if ($data_type["unique_name"] == "Precedent - ARRL November Sweepstakes") $special_name = "NovSSPrecEntry";
                    $validator_checks['sentdata' . $x]['special'] = $special_name;
                    $validator_checks['recvdata' . $x]['special'] = $special_name;
                    break;
                default:
                    throw new Exception($data_type["longname"] . " is not a recognized type.");
            }
        }

        $validate = new Validation("contact_data", $data, $validator_checks);
        if (!empty($validate->errors))
        {
            header("HTTP/1.1 403 Forbidden");
            foreach ($validate->errors as $x) echo $x;
            die();
        }

        return $validate->good_data;
    }

    if (isset($_GET['contest_id']) && !empty($_GET['contest_id']))
    {
        session_start();
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
       
        $sql = new SQLfunction();
        $rows = $sql->sql(array("table" => "contact_data"))->select(array("contest_id" => $_GET['contest_id']), array("order" => "contactdate desc"));
        echo json_encode($rows);
    }
    if (isset($_POST['contactData']) && !empty($_POST['contactData']))
    {
        session_start();
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/validate.php');

        $data = json_decode($_POST['contactData'], true);
        $good_data = validateData($data, false);

        $sql = new SQLfunction();
        $good_data['contactdate'] = $sql->sysdate();
        $query = $sql->sql(array("table" => "contact_data"))->insert($good_data);
        if (!$query) throw new Exception("Cannot edit contact in the database.");

        $contest_temp = $sql->sql(array("table" => "contest_list", "fetchall" => false))->select(array("contest_name_id" => $_COOKIE['contest_name_id']));
        $number_record = 0;
        for ($x = 1; $x < 6; $x++)
        {
            if ($contest_temp['type_data' . $x] <= 0) continue;
            $data_type = $sql->sql(array("table" => "data_type", "fetchall" => false))->select(array('data_type_id' => $contest_temp['type_data' . $x]));
            if (!$data_type) throw new Exception("Data Type does not exist. Please contact administrator.");

            if ($data_type['long_name'] == 'Record Number')
            {
                $number_record = $x;
                break;
            }
        }

        log_data("NUMBER RECORD VALUE IS " . $number_record);
        if ($number_record > 0)
        {
            $master_list = $sql->sql(array("table" => "master_list", "columns" => array("contest_id", "x_data" . $x), "fetchall" => false))->select(array("contest_id" => $data['contest_id']));
            $query = $sql->sql(array("table" => "master_list"))->update(array("x_data" . $x => $master_list["x_data" . $x] + 1), array("contest_id" => $master_list["contest_id"]));
        }
    }
    if ($_SERVER['REQUEST_METHOD'] == "PUT")
    {
        $data = array();

        parse_str(file_get_contents('php://input'), $put_data);
        session_start();
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/validate.php');

        $put_data = json_decode($put_data["contactData"]);
        foreach ($put_data as $k => $v)
        {
            $data[$k] = $v;
        }
        $good_data = validateData($data, true);

        $sql = new SQLfunction();
        $query = $sql->sql(array("table" => "contact_data"))->update($good_data, array("entry" => $good_data['entry']));
        if (!$query) throw new Exception("Cannot add contact to the database.");
    }
    if ($_SERVER['REQUEST_METHOD'] == "DELETE")
    {
        $data = array();

        parse_str(file_get_contents('php://input'), $delete_data);
        session_start();
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');

        $delete_data = json_decode($delete_data["contactData"]);
        foreach ($delete_data as $k => $v)
        {
            $data[$k] = $v;
        }

        $sql = new SQLfunction();
        $query = $sql->sql(array("table" => "contact_data"))->delete(array("entry" => $data['entry']));
        if (!$query) throw new Exception("Cannot delete contact from the database.");

        $master_list = $sql->sql(array("table" => "master_list", "columns" => array("contest_name_id"), "fetchall" => false))->select(array("contest_id" => $_COOKIE['contest_id']));
        $contest_temp = $sql->sql(array("table" => "contest_list", "fetchall" => false))->select(array("contest_name_id" => $master_list['contest_name_id']));
        $number_record = 0;
        for ($x = 1; $x < 6; $x++)
        {
            if ($contest_temp['type_data' . $x] <= 0) continue;
            $data_type = $sql->sql(array("table" => "data_type", "fetchall" => false))->select(array('data_type_id' => $contest_temp['type_data' . $x]));
            if (!$data_type) throw new Exception("Data Type does not exist. Please contact administrator.");

            if ($data_type['long_name'] == 'Record Number')
            {
                $number_record = $x;
                break;
            }
        }

        if ($number_record > 0)
        {
            $master_list = $sql->sql(array("table" => "master_list", "columns" => array("contest_id", "x_data" . $x), "fetchall" => false))->select(array("contest_id" => $_COOKIE['contest_id']));
            $number_contacts = $sql->sql(array("table" => "contact_data", "columns" => array("MAX" => "sentdata" . $number_record), "fetchall" => false))->select(array('contest_id' => $_COOKIE['contest_id']));
            if (array_key_exists('sentdata' . $number_record, $number_contacts)) $query = $sql->sql(array("table" => "master_list"))->update(array("x_data" . $number_record => $number_contacts['sentdata' . $number_record] + 1), array("contest_id" => $master_list["contest_id"]));
            else $query = $sql->sql(array("table" => "master_list"))->update(array("x_data" . $number_record => 1), array("contest_id" => $master_list["contest_id"]));
        }
    }
?>
