<?php

/**
 * Class login
 * handles the user's login and logout process
 */
class Login
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
        // create/read session, absolutely necessary
        session_start();

        // check the possible login actions:
        // if user tried to log out (happen when user clicks logout button)
        if (isset($_GET["logout"])) {
            $this->doLogout();
        }
        // login via post data (if user just submitted a login form)
        elseif (isset($_POST["login"])) {
            $this->dologinWithPostData();
        }
    }

    /**
     * log in with post data
     */
    private function dologinWithPostData()
    {
        // check login form contents
        if (empty($_POST['user_name'])) {
            $this->errors[] = "Username field was empty.";
        } elseif (empty($_POST['user_password'])) {
            $this->errors[] = "Password field was empty.";
        } elseif (!empty($_POST['user_name']) && !empty($_POST['user_password'])) {

            // create a database connection, using the constants from config/db.php (which we loaded in index.php)
            $this->db_connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

            // change character set to utf8 and check it
            if (!$this->db_connection->set_charset("utf8")) {
                $this->errors[] = $this->db_connection->error;
            }

            // if no connection errors (= working database connection)
            if (!$this->db_connection->connect_errno) {

                // escape the POST stuff
                $user_name = $this->db_connection->real_escape_string($_POST['user_name']);

                // database query, getting all the info of the selected user (allows login via email address in the
                // username field)
                $sql = "SELECT userid, username, email, password
                        FROM members
                        WHERE username = '" . $user_name . "' OR email = '" . $user_name . "';";
                $result_of_login_check = $this->db_connection->query($sql);

                // if this user exists
                if ($result_of_login_check->num_rows == 1) {

                    // get result row (as an object)
                    $result_row = $result_of_login_check->fetch_object();

                    if ($this->checkbrute($result_row->userid, $this->db_connection) == false) {
                        // using PHP 5.5's password_verify() function to check if the provided password fits
                        // the hash of that user's password
                        if (password_verify($_POST['user_password'], $result_row->password)) {

                            // write user data into PHP SESSION (a file on your server)
                            $_SESSION['user_name'] = $result_row->username;
                            $_SESSION['user_email'] = $result_row->email;
                            $_SESSION['user_login_status'] = 1;

                        } else {
                            $now = time();
                            $this->db_connection->query("INSERT INTO login_attempts(user_id, time)
                                                                    VALUES ('$result_row->userid', '$now')");
                            $this->errors[] = "Wrong password. Try again.";
                        }
                    } else {
                        $this->errors[] = "Account locked. You must wait thirty minutes before trying again.";
                    }
                } else {
                    $this->errors[] = "This user does not exist.";
                }
            } else {
                $this->errors[] = "Database connection problem.";
            }
        }
    }

    private function checkbrute($user_id, $mysqli) 
    {
        // Get timestamp of current time 
        $now = time();

        // All login attempts are counted from the past 2 hours. 
        $valid_attempts = $now - (30 * 60);

        $sql = "SELECT time
                FROM login_attempts
                WHERE user_id = '" . $user_id . "'
                AND time > '" . $valid_attempts . "'";
        $stmt = $this->db_connection->query($sql);

        // If there have been more than 5 failed logins, return positive error.
        return ($stmt->num_rows >= 5);
    }
    /**
     * perform the logout
     */
    public function doLogout()
    {
        // delete the session of the user
        $_SESSION = array();
        session_destroy();
        // delete the cookies the user created
        unset($_COOKIE["contestList"]);
        $res = setcookie("contestList", '', time() - 1);
        unset($_COOKIE["dataType"]);
        $res = setcookie("dataType", '', time() - 1);
        unset($_COOKIE["masterList"]);
        $res = setcookie("masterList", '', time() - 1);
        // return a little feeedback message
        $this->messages[] = "You have been logged out.";
    }

    /**
     * simply return the current state of the user's login
     * @return boolean user's login status
     */
    public function isUserLoggedIn()
    {
        if (isset($_SESSION['user_login_status']) AND $_SESSION['user_login_status'] == 1) {
            return true;
        }
        // default return
        return false;
    }
}
