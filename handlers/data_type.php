<?php
    function log_data($log_value)
    {
        include_once($_SERVER['DOCUMENT_ROOT'] . '/classes/Logging.php');
        $log = new Logging();
        touch('/tmp/hamcontest3.txt');
        $log->lfile('/tmp/hamcontest3.txt');
        $log->lwrite($log_value);
        $log->lclose();
    }
    function validateData($data, $isPut)
    {
        $validator_checks = array('unique_name'  => array("required" => true),
                                  'long_name'    => array("required" => true),
                                  'short_name'   => array("required" => true),
                                  'data_type'    => array("required" => true),
                                  'max_length'   => array("required" => true, "numeric" => true),
                                  'double_entry' => array("required" => true, "numeric" => true),
                                  'sent_data'    => array("required" => true, "numeric" => true),
                                  ); 
        if ($data['data_type'] == "enum")
        {
            $validator_checks['enum1'] = array('required' => true);
            for ($x = 2; $x < 4; $x++)
            {
                $validator_checks['enum' . $x] = array('required' => false);
            }
        }
        $validate = new Validation("contest_list", $data, $validator_checks);
        if (!empty($validate->errors))
        {
            header("HTTP/1.1 403 Forbidden");
            foreach ($validate->errors as $x) echo $x;
            die();
        }

        return $validate->good_data;
    }
    if (isset($_GET['data_type']))
    {
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
        $sql = new SQLfunction();
        echo json_encode($sql->sql(array("db" => "hamcontest", "table" => "data_type"))->select(array()));
    }
    if (isset($_POST['data_type']) && !empty($_POST['data_type']))
    {
        session_start();
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/validate.php');

        $data = json_decode($_POST['data_type'], true);
        $good_data = validateData($data, false);

        $sql = new SQLfunction();
        $query = $sql->sql(array("table" => "data_type"))->insert($good_data);
        if (!$query) throw new Exception("Cannot add data type to the database.");
        echo json_encode($query);
    }
