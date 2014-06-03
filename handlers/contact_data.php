<?php
    if (isset($_GET['contest_id']) && !empty($_GET['contest_id']))
    {
        session_start();
        include('../../config/db.php');
        
        $db_connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        $db_connection->set_charset("utf8");
        $contest_id = $_GET['contest_id'];
        $sql = $db_connection->query("SELECT * FROM hamcontest.contact_data
                                      WHERE contest_id='". $db_connection->real_escape_string($contest_id) . "'");
        $rows = array();
        while($r = $sql->fetch_array(MYSQL_ASSOC)) {
            $rows[] = $r;
        }
        echo json_encode($rows);
    }
    if (isset($_POST['contest_id']) && !empty($_GET['contest_id']))
    {
        session_start();
        include('../../config/db.php');

        $db_connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        $db_connection->set_charset("utf8");
        $data = array();
        $data["contest_id"] = $_POST['contest_id'];
        $data["frequency"] = $_POST['frequency'];
        $data["contactmode"] = $_POST['contactmode'];
        $data["sentcall"] = $_POST['sentcall'];
        $data["sentdata1"] = $_POST['sentdata1'];
        $data["sentdata2"] = $_POST['sentdata2'];
        $data["sentdata3"] = $_POST['sentdata3'];
        $data["sentdata4"] = $_POST['sentdata4'];
        $data["sentdata5"] = $_POST['sentdata5'];
        $data["recvcall"] = $_POST['recvcall'];
        $data["recvdata1"] = $_POST['recvdata1'];
        $data["recvdata2"] = $_POST['recvdata2'];
        $data["recvdata3"] = $_POST['recvdata3'];
        $data["recvdata4"] = $_POST['recvdata4'];
        $data["recvdata5"] = $_POST['recvdata5'];
    }
