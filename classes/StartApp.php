<?php

/**
 * Class login
 * handles the user's login and logout process
 */
class StartApp
{
    /**
     * @var object The database connection
     */
    private $db_connection = null;
    /**
     * @var array Collection of error messages
     */
    public $errors = array();
    /**
     * @var array Collection of success / neutral messages
     */
    public $messages = array();

    /**
     * the function "__construct()" automatically starts whenever an object of this class is created,
     * you know, when you do "$login = new Login();"
     */
    public function __construct()
    {
        $this->checkDatabaseInstance();
        if (!empty($this->errors))
            return;
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
    // $_SESSION['contest_name'] = $_POST['contest_name'];
    /**
     * log in with post data
     */
    private function checkDatabaseInstance()
    {
        // create a database connection, using the constants from config/db.php (which we loaded in index.php)
        $this->db_connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

        // change character set to utf8 and check it
        if (!$this->db_connection->set_charset("utf8")) {
            $this->errors[] = $this->db_connection->error;
        }

        // if no connection errors (= working database connection)
        if (!$this->db_connection->connect_errno) {
            // Check to see if the user has a database set up.
            $sql = "SHOW DATABASES LIKE 'hamcontest'";
            $result_of_db_check = $this->db_connection->query($sql);

            // If the database doesn't exist, throw an error.
            if ($result_of_db_check->num_rows == 0) {
                $this->errors[] = "Database does not exist. Please contact administrator.";
            }
        } else {
            $this->errors[] = "Database connection problem.";
        }
    }
    private function checkTableExistence()
    {
        // change character set to utf8 and check it
        if (!$this->db_connection->set_charset("utf8")) {
            $this->errors[] = $this->db_connection->error;
        }
        if (!$this->db_connection->connect_errno) {
            // Check for master_list
            $sql = "SHOW TABLES IN hamcontest LIKE 'master_list'";
            $result_of_master_list_check = $this->db_connection->query($sql);

            // If the table doesn't exist, throw an error.
            if ($result_of_master_list_check->num_rows == 0) {
                $this->errors[] = "Table master_list does not exist. Please contact administrator. " + $this->db_connection->sqlstate;
            }

            // Check for contact_data
            $sql = "SHOW TABLES IN hamcontest LIKE 'contact_data'";
            $result_of_contact_data_check = $this->db_connection->query($sql);

            // If the database doesn't exist, create it.
            if ($result_of_contact_data_check->num_rows == 0) {
                $this->errors[] = "Table contact_data does not exist. Please contact administrator.";
            }
        } else {
            $this->errors[] = "Database connection problem.";
        }
    }
    private function checkContestInstance()
    {
        // change character set to utf8 and check it
        if (!$this->db_connection->set_charset("utf8")) {
            $this->errors[] = $this->db_connection->error;
            return -1;
        }
        if (!$this->db_connection->connect_errno) {
            // Check for a Contest Entry
            $sql = "SELECT (contest, year, callsign) 
                    FROM hamcontest.master_list 
                    WHERE contest='" + $this->db_connection->real_escape_string($_SESSION['contest_name']) . "'
                    AND year=year(now())
                    AND callsign='" . $this->db_connection->real_escape_string($_SESSION['user_name']) . "'";
            $result_of_contest_entry_check = $this->db_connection->query($sql);

            // If it doesn't exist, go to sentData
            if ($result_of_contest_entry_check->num_rows == 0) return 0;
            // Also go to sentData if the call sign doesn't exist. This may happen
            // if the sentData process was cancelled for some reason.
            $result_row = $result_of_contest_entry_check->fetch_object();
            if ($result_row->callsign == false) return 0;
            // Otherwise, we have a good contest, and may go to entering contacts.
            return 1;
        } else {
            $this->errors[] = "Database connection problem.";
            return -1;
        }
    }

}
