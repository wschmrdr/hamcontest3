<?php
    session_start();
    include($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');

    $sql = new SQLfunction();
    $contacts = $sql->sql(array("table" => "contact_data"))->select(array("contest_id" => $_COOKIE['contest_id']), array("order" => "contactdate asc"));
    $instance = $sql->sql(array("table" => 'master_list', "fetchall" => false))->select(array("contest_id" => $_COOKIE['contest_id']));
    $contest = $sql->sql(array("table" => "contest_list", "fetchall" => false))->select(array("contest_name_id" => $_COOKIE['contest_name_id']));

    $filename = "/tmp/" . strtolower($_COOKIE["username"]) . '.log';

    $f_str = fopen($filename, 'w') or die("Cannot create file");

    fwrite($f_str, "START-OF-LOG: 3.0\n");
    fwrite($f_str, "CONTEST: " . $contest['contest_name'] . "\n");
    fwrite($f_str, "CREATED-BY: WA2AEA Contest Logger 3\n");
    fwrite($f_str, "CALLSIGN: " . $instance['callsign'] . "\n");
    fwrite($f_str, "LOCATION: " . $instance['location'] . "\n");
    fwrite($f_str, "CLAIMED-SCORE: " . $instance['claimed_score'] . "\n");
    $category_flags = array("assisted", "band", "mode", "operator", "power", "station", "time", "transmitter", "overlay");
    foreach ($category_flags as $v)
    {
        if ($contest[$v . "_flag"] !== 'N' && array_key_exists($v . '_cat', $instance))
        {
            fwrite($f_str, "CATEGORY-" . strtoupper($v) . ": " . $instance[$v . '_cat'] . "\n");
        }
    }
    if ($contest["personal_flag"] === 'Y')
    {
        fwrite($f_str, "CLUB: " . $instance['club'] . "\n");
        fwrite($f_str, "NAME: " . $instance['name'] . "\n");
        fwrite($f_str, "ADDRESS: " . $instance['address'] . "\n");
        fwrite($f_str, "ADDRESS-CITY: " . $instance['addresscity'] . "\n");
        fwrite($f_str, "ADDRESS-STATE-PROVINCE: " . $instance['addressstate'] . "\n");
        fwrite($f_str, "ADDRESS-POSTALCODE: " . $instance['addresszip'] . "\n");
        fwrite($f_str, "ADDRESS-COUNTRY: " . $instance['addresscountry'] . "\n");
        fwrite($f_str, "OPERATORS: " . $instance['operators'] . "\n");
        // Each line is a max of 75 chars; 9 of which are the start
        $soapbox = str_split($instance['soapbox'], 66);
        foreach ($soapbox as $v)
        {
            fwrite($f_str, "SOAPBOX: " . $v . "\n");
        }
    }
    foreach ($contacts as $cont)
    {
        $ss = "QSO: ";
        $ss = $ss . str_pad($cont['frequency'], 5, " ", STR_PAD_LEFT) . " ";
        $ss = $ss . str_pad($cont['contactmode'], 2, " ") . " ";
        $ss = $ss . date("Y-m-d Hi", strtotime($cont['contactdate'])) . " ";
        $ss = $ss . str_pad($cont['sentcall'], 10, " ") . " ";
        for ($x = 1; $x < 6; $x++)
        {
            if ($contest['type_data' . $x] <= 0) continue;
            $data_type = $sql->sql(array("table" => "data_type", "fetchall" => false))->select(array('data_type_id' => $contest['type_data' . $x]));
            if (!$data_type) continue;

            if ($data_type['max_length'] == 0) $max_length = 4;
            else $max_length = $data_type['max_length'];
            if ($data_type['data_type'] == "number") $pad = STR_PAD_LEFT;
            else $pad = STR_PAD_RIGHT;

            $ss = $ss . str_pad(substr($cont['sentdata' . $x], 0, $max_length), $max_length, " ", $pad) . " ";
        }

        $ss = $ss . str_pad($cont['recvcall'], 10, " ") . " ";
        for ($x = 1; $x < 6; $x++)
        {
            if ($contest['type_data' . $x] <= 0) continue;
            $data_type = $sql->sql(array("table" => "data_type", "fetchall" => false))->select(array('data_type_id' => $contest['type_data' . $x]));
            if (!$data_type) continue;

            if ($data_type['max_length'] == 0) $max_length = 4;
            else $max_length = $data_type['max_length'];
            if ($data_type['data_type'] == "number") $pad = STR_PAD_LEFT;
            else $pad = STR_PAD_RIGHT;

            $ss = $ss . str_pad(substr($cont['recvdata' . $x], 0, $max_length), $max_length, " ", $pad) . " ";
        }

        fwrite($f_str, $ss . "\n");
    }
    fwrite($f_str, "END-OF-LOG:");
    fclose($f_str);

    header('Content-Type: application/force-download'); 
    header('Content-Disposition: attachment; filename="' . basename($filename) . '"');

    header('Content-Length: ' . filesize($filename));
    readfile($filename);
    exit;
?>
