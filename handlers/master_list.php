<?php
    if (isset($_GET['id']) && !empty($_GET['id']))
    {
        session_start();
        include('../../config/db.php');

        $db_connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        $db_connection->set_charset("utf8");
        $contest_id = $_GET['id'];
        $sql = $db_connection->query("SELECT * 
                                      FROM hamcontest.master_list 
                                      WHERE contest_name_id='" + $db_connection->real_escape_string($contest_id) + "'
                                      AND callsign='" + $db_connection->real_escape_string($_SESSION['user_name']) + "'");
        $rows = array();
        if ($sql->num_rows > 0)
        {
            while($r = $sql->fetch_array(MYSQL_ASSOC)) {
                $rows[] = $r;
            }
        }
        echo json_encode($rows);
    }
