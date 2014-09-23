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
    if (isset($_GET['all_types']) && !empty($_GET['all_types']))
    {
        session_start();
        include_once($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');

        $sql = new SQLfunction();
        $rows = $sql->sql(array("table" => "enum_values", "columns" => array("DISTINCT" => "enum_type")))->select();
        echo json_encode($rows);
    }
