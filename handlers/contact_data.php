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
