<?php
    if (isset($_GET['contest_list']))
    {
        session_start();
        include('../../config/db.php');
        
        $db_connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        $db_connection->set_charset("utf8");

        $sql = $db_connection->query("SELECT * FROM hamcontest.contest_list");
        $rows = array();
        while($r = $sql->fetch_array(MYSQL_ASSOC)) {
            $rows[] = $r;
        }
        echo json_encode($rows);
    }
