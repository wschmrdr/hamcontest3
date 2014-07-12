<?php
    if (isset($_GET['id']) && !empty($_GET['id']))
    {
        session_start();
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
       
        $sql = new SQLfunction();
        $contest_id = $_GET['id'];
        $rows = $sql->sql(array("table" => 'master_list'))->select(array("contest_name_id" => $contest_id, "callsign" => strtoupper($_COOKIE['username'])));
        echo json_encode($rows);
    }
