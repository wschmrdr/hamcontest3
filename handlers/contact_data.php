<?php
    if (isset($_GET['contest_id']) && !empty($_GET['contest_id']))
    {
        session_start();
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
        include('../../config/db.php');
       
        $sql = new SQLfunction();
        $rows = $sql->sql(array("db" => "hamcontest", "table" => "contact_data"))->select(array("contest_id" => $_GET['contest_id']));
        echo json_encode($rows);
    }
    if (isset($_POST['contactData']) && !empty($_POST['contactData']))
    {
        session_start();
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/validate.php');

        $data = json_decode($_POST['contactData'], true);
        $validator_checks = array('contest_id'  => array("required" => true, "numeric" => true),
                                  'frequency'   => array("required" => true, "enum" => array('band_cat', "column" => "shortname")),
                                  'contactmode' => array("required" => true, "enum" => array('mode_cat', "column" => "shortname")),
                                  'sentcall'    => array("required" => true, "callsign" => true),
                                  'recvcall'    => array("required" => true, "callsign" => true)); 
        $sql = new SQLfunction();
        $master_list = $sql->sql(array("db" => "hamcontest", "table" => "master_list", "columns" => array("contest_name_id"), "fetchall" => false))->select(array("contest_id" => $data['contest_id']));
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
        $validate->good_data['contactdate'] = $sql->sysdate();
        $query = $sql->sql(array("table" => "contact_data"))->insert($validate->good_data);
        if (!$query) throw new Exception("Cannot add contact to the database.");
    }
