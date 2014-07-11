<?php
    if (isset($_GET['type']) && !empty($_GET['type']))
    {
        session_start();
        include_once($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');

        $sql = new SQLfunction();
        $enum_type = $_GET['type'];
        $rows = $sql->sql(array("table" => "enum_values"))->select(array("enum_type" => $enum_type));
        echo json_encode($rows);
    }
