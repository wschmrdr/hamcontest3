<?php
    if (isset($_GET['type']) && !empty($_GET['type']))
    {
        session_start();
        include('../../config/db.php');

        $db_connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        $db_connection->set_charset("utf8");
        $enum_type = $_GET['type'];
        $sql = $db_connection->query("SELECT * FROM hamcontest.enum_values 
                                      WHERE enum_type='" . $db_connection->real_escape_string($enum_type) . "'");
        $rows = array();
        if ($sql->num_rows > 0)
        {
            while($r = $sql->fetch_array(MYSQL_ASSOC)) {
                $rows[] = $r;
            }
        }
        echo json_encode($rows);
    }
