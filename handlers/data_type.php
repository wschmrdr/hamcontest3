<?php
    if (isset($_GET['data_type']))
    {
        include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
        $sql = new SQLfunction();
        echo json_encode($sql->sql(array("db" => "hamcontest", "table" => "data_type"))->select(array()));
    }
