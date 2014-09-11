<?php

/**
 * Class registration
 * handles the user registration
 */
class Registration
{
    private $sql = null;
    public $errors = array();
    public $messages = array();

    public function __construct()
    {
        session_start();
        require_once($_SERVER['DOCUMENT_ROOT'] . "/shared/sqlio.php");
        $this->sql = new SQLfunction();

        if (isset($_POST["register"])) {
            $this->registerNewUser();
        }
    }

    /**
     * handles the entire registration process. checks all error possibilities
     * and creates a new user in the database if everything is fine
     */
    private function registerNewUser()
    {
        if (empty($_POST['user_name'])) {
            $this->errors[] = "Empty Username";
        } elseif (empty($_POST['user_password_new']) || empty($_POST['user_password_repeat'])) {
            $this->errors[] = "Empty Password";
        } elseif ($_POST['user_password_new'] !== $_POST['user_password_repeat']) {
            $this->errors[] = "Password and password repeat are not the same";
        } elseif (strlen($_POST['user_password_new']) < 6) {
            $this->errors[] = "Password has a minimum length of 6 characters";
        } elseif (strlen($_POST['user_name']) > 64 || strlen($_POST['user_name']) < 2) {
            $this->errors[] = "Username cannot be shorter than 2 or longer than 64 characters";
        } elseif (!preg_match('/^[a-z\d]{2,64}$/i', $_POST['user_name'])) {
            $this->errors[] = "Username does not fit the name scheme: only a-Z and numbers are allowed, 2 to 64 characters";
        } elseif (empty($_POST['user_email'])) {
            $this->errors[] = "Email cannot be empty";
        } elseif (strlen($_POST['user_email']) > 64) {
            $this->errors[] = "Email cannot be longer than 64 characters";
        } elseif (!filter_var($_POST['user_email'], FILTER_VALIDATE_EMAIL)) {
            $this->errors[] = "Your email address is not in a valid email format";
        } elseif (!empty($_POST['user_name'])
            && strlen($_POST['user_name']) <= 64
            && strlen($_POST['user_name']) >= 2
            && preg_match('/^[a-z\d]{2,64}$/i', $_POST['user_name'])
            && !empty($_POST['user_email'])
            && strlen($_POST['user_email']) <= 64
            && filter_var($_POST['user_email'], FILTER_VALIDATE_EMAIL)
            && !empty($_POST['user_password_new'])
            && !empty($_POST['user_password_repeat'])
            && ($_POST['user_password_new'] === $_POST['user_password_repeat'])
        ) {
            $user_name = strip_tags($_POST['user_name'], ENT_QUOTES);
            $user_email = strip_tags($_POST['user_email'], ENT_QUOTES);

            $user_password = $_POST['user_password_new'];

            // crypt the user's password with PHP 5.5's password_hash() function, results in a 60 character
            // hash string. the PASSWORD_DEFAULT constant is defined by the PHP 5.5, or if you are using
            // PHP 5.3/5.4, by the password hashing compatibility library
            $user_password_hash = password_hash($user_password, PASSWORD_DEFAULT);

            $query_check_user_name = $this->sql->sql(array("table" => "users"))->select(array("user_name" => $user_name));

            if (count($query_check_user_name) == 1) {
                $this->errors[] = "Sorry, that username / email address is already taken.";
            } else {
                // write new user's data into database
                $this->sql->sql(array("table" => "users"))->insert(array("user_name" => $user_name, "user_password_hash" => $user_password_hash, "user_email" => $user_email));
                $this->messages[] = "Your account has been created successfully. You can now log in.";
            }
        } else {
            $this->errors[] = "An unknown error occurred.";
        }
    }
}
