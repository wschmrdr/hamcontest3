<?php
    function validateData($data, $isPut)
    {
        $validator_checks = array('contest_id'  => array("required" => true, "numeric" => true),
                                  'contest_name_id' => array("required" => true, "numeric" => true),
                                  'callsign'    => array("callsign" => true),
                                  'location'    => array("required" => false),
                                  'claimed_score' => array("numeric" => true)); 

        $validate = new Validation("master_list", $data, $validator_checks);
        if (!empty($validate->errors))
        {
            header("HTTP/1.1 403 Forbidden");
            foreach ($validate->errors as $x) echo $x;
            die();
        }

        return $validate->good_data;
    }

    if (isset($_GET['id']) && !empty($_GET['id']))
    {
        session_start();
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
       
        $sql = new SQLfunction();
        $contest_id = $_GET['id'];
        $rows = $sql->sql(array("table" => 'master_list'))->select(array("contest_name_id" => $contest_id, "callsign" => strtoupper($_COOKIE['username'])));
        echo json_encode($rows);
    }
    if ($_SERVER['REQUEST_METHOD'] == "PUT" && isset($_COOKIE['contest_id']))
    {
        $data = array();

        parse_str(file_get_contents('php://input'), $put_data);
        session_start();
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/validate.php');

        $put_data = json_decode($put_data["masterList"]);
        foreach ($put_data as $k => $v)
        {
            $data[$k] = $v;
        }
        $data['contest_id'] = $_COOKIE['contest_id'];
        $data['contest_name_id'] = $_COOKIE['contest_name_id'];
        $good_data = validateData($data, true);

        $sql = new SQLfunction();
        $query = $sql->sql(array("table" => "master_list"))->update($good_data, array("contest_id" => $good_data['contest_id']));
        if (!$query) throw new Exception("Cannot update contest in the database.");
    }
