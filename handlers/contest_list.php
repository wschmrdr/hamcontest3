<?php
    if (isset($_GET['contest_list']))
    {
        session_start();
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
        $sql = new SQLfunction();        
        $rows = $sql->sql(array("table" => "contest_list"))->select();
        echo json_encode($rows);
    }
