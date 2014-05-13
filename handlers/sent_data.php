<?php
    if (isset($_POST['contest']) && !empty($_POST['contest']))
    {
        session_start();
        $contest = $_POST['contest'];
        $_SESSION['contest_name'] = $_POST['contest'];
        require_once('../classes/ContactData.php');
        $cd = new ContactData();
        # $cd->getSentContestData();
        echo json_encode($cd);
    }
