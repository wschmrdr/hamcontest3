<?php

/**
 * Class login
 * handles the user's login and logout process
 */
class Login
{
    private $sql = null;
    public $errors = array();
    public $messages = array();

    public function __construct()
    {
        // create/read session, absolutely necessary
        session_start();
        require_once($_SERVER['DOCUMENT_ROOT'] . "/shared/sqlio.php");
        $this->sql = new SQLfunction();

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
            // database query, getting all the info of the selected user (allows login via email address in the
            // username field)
            $result = $this->sql->sql(array("table" => "users", "fetchall" => false))->select(array("user_name" => $_POST['user_name']));

            if ($this->checkbrute($result['user_id']) == false) {
                        // using PHP 5.5's password_verify() function to check if the provided password fits
                        // the hash of that user's password
                        if (password_verify($_POST['user_password'], $result['user_password_hash'])) {

                            // write user data into PHP SESSION (a file on your server)
                            $_SESSION['user_name'] = $result['user_name'];
                            $_SESSION['user_email'] = $result['user_email'];
                            $_SESSION['user_login_status'] = 1;
                            setcookie('username', strtoupper($result['user_name']), time() + (86400 * 30), '/');

                        } else {
                            $now = time();
                            $this->sql->sql(array("table" => "login_attempts"))->insert(array("user_id" => $result['user_id'], "time" => $now));
                            $this->errors[] = "Wrong password. Try again.";
                        }
            } else {
                $this->errors[] = "Account locked. You must wait thirty minutes before trying again.";
            }
        }
    }

    private function checkbrute($user_id) 
    {
        // Get timestamp of current time 
        $now = time();

        // All login attempts are counted from the past 2 hours. 
        $valid_attempts = $now - (30 * 60);

        $result = $this->sql->sql(array("table" => "login_attempts", "columns" => array("time")))->select(array("user_id" => $user_id, "time" => $valid_attempts));

        // If there have been more than 5 failed logins, return positive error.
        return (count($result) >= 5);
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
        unset($_COOKIE["username"]);
        $res = setcookie("username", '', time() - 1);
        unset($_COOKIE["contestData"]);
        $res = setcookie("contestData", '', time() - 1);
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
