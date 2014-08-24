<?php
    if (isset($_POST['contest_name']) && !empty($_POST['contest_name']))
    {
        session_start();
        require_once('../classes/SentData.php');
        new SentData();
    }
