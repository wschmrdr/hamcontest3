<?php

/**
 * Class login
 * handles the user's login and logout process
 */
class StartApp
{
    private $sql = null;
    public $errors = array();
    public $messages = array();

    public function __construct()
    {
        include_once($_SERVER['DOCUMENT_ROOT'] . '/shared/sqlio.php');
        $this->sql = new SQLfunction();
        $this->checkTableExistence();
        if (!empty($this->errors))
            return;
        $_SESSION['status'] = 'sentData';

        // Check to see if a contest instance exists
        /*
        if ($this->checkContestInstance() == 1)
            $_SESSION['status'] = 'enter';
        else if ($this->checkContestInstance() == 0)
            $_SESSION['status'] = 'sentData';
        */
    }
    private function checkTableExistence()
    {
        $this->sql->sql(array("table" => "master_list"));
        $this->sql->sql(array("table" => "contact_data"));
    }
    private function checkContestInstance()
    {
        // Check for a Contest Entry
        $result = $this->sql->sql(array("table" => "master_list", "columns" => array("contest", "year", "callsign"))->select(array('contest' => $_SESSION['contest_name'], 'year' => 'year(now())', 'callsign' => $_SESSION['user_name']));

        // If it doesn't exist, go to sentData
        if (!$result) return 0;
        if (count($result) == 0) return 0;
        // Also go to sentData if the call sign doesn't exist. This may happen
        // if the sentData process was cancelled for some reason.
        foreach ($result as $r)
        {
            if ($r['callsign']) return 1;
        }
        return 0;
    }
}
