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
        $validator_checks = array('contest_long_name' => array("required" => true),
                                  'contest_name'      => array("required" => true),
                                  'score_formula'     => array("required" => true),
                                  'call_loc'          => array("required" => true, "numeric" => true),
                                  'assisted_flag'     => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'band_flag'         => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'mode_flag'         => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'operator_flag'     => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'power_flag'        => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'station_flag'      => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'time_flag'         => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'transmitter_flag'  => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'overlay_flag'      => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'personal_flag'     => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'freq_dupe_flag'    => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'mode_dupe_flag'    => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'data1_dupe_flag'   => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'data2_dupe_flag'   => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'data3_dupe_flag'   => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'data4_dupe_flag'   => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'data5_dupe_flag'   => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  'sect_select_flag'  => array("required" => true, "list" => array('Y', 'N', 'S', 'B')),
                                  
                                  ); 
        $sql = new SQLfunction();
        $data_type = $sql->sql(array("table" => "data_type", "columns" => array("data_type_id")))->select();
        $validator_checks['type_data1'] = array('required' => true, 'list' => $data_type);
        for ($x = 2; $x < 6; $x++)
        {
            $validator_checks['type_data' . $x] = array('list' => $data_type);
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
    if (isset($_GET['contest_list']))
    {
        session_start();
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
        $sql = new SQLfunction();        
        $rows = $sql->sql(array("table" => "contest_list"))->select();
        echo json_encode($rows);
    }
    if (isset($_POST['contest_list']) && !empty($_POST['contest_list']))
    {
        session_start();
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/validate.php');

        $data = json_decode($_POST['contest_list'], true);
        $good_data = validateData($data, false);

        $sql = new SQLfunction();
        $query = $sql->sql(array("table" => "contest_list"))->insert($good_data);
        if (!$query) throw new Exception("Cannot edit contact in the database.");
        echo json_encode($query);
    }
