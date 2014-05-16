<?php

/**
 * A simple, clean and secure PHP Login Script / MINIMAL VERSION
 * For more versions (one-file, advanced, framework-like) visit http://www.php-login.net
 *
 * Uses PHP SESSIONS, modern password-hashing and salting and gives the basic functions a proper login system needs.
 *
 * @author Panique
 * @link https://github.com/panique/php-login-minimal/
 * @license http://opensource.org/licenses/MIT MIT License
 */

// checking for minimum PHP version
if (version_compare(PHP_VERSION, '5.3.7', '<')) {
    exit("Sorry, Simple PHP Login does not run on a PHP version smaller than 5.3.7 !");
} else if (version_compare(PHP_VERSION, '5.5.0', '<')) {
    // if you are using PHP 5.3 or PHP 5.4 you have to include the password_api_compatibility_library.php
    // (this library adds the PHP 5.5 password hashing functions to older versions of PHP)
    require_once("../libraries/password_compatibility_library.php");
}

// include the configs / constants for the database connection
require_once("../config/db.php");

// load the Message Handler
// This will be called at the top of every page.
require_once("classes/MessageHandler.php");
$messageHandler = new MessageHandler();

// load the classes
require_once("classes/Login.php");

// create a login object. when this object is created, it will do all login/logout stuff automatically
// so this single line handles the entire login process. in consequence, you can simply ...
$login = new Login();
if ($login->errors) {
    foreach ($login->errors as $error) {
        $messageHandler->errors[] = $error;
    }   
}   
if ($login->messages) {
    foreach ($login->messages as $message) {
        $messageHandler->messages[] = $message;
    }   
}

// ... ask if we are logged in here:
if ($login->isUserLoggedIn() == true) {
    // The user is logged in.
    // Make sure that Username instance exists, or else they need to log out.
    if ($_SESSION['user_name'] == false) {
        header("location:index.php?logout");
    }
    if (empty($_SESSION['status'])) {
        // With an empty status, we go to either SentData or EnterContacts.
        // This depends upon the results of StartApp, all in its constructor.
        require_once("classes/StartApp.php");
        $startApp = new StartApp();
        if ($startApp->errors) {
            foreach ($startApp->errors as $error) {
                $messageHandler->errors[] = $error;
            }   
        }   
        if ($startApp->messages) {
            foreach ($startApp->messages as $message) {
                $messageHandler->messages[] = $message;
            }   
        }
        if (empty($_SESSION['status']))
        {
            include("views/error.php");
            return;
        }
        include("views/sent_data.php");
    }
    else if ($_SESSION['status'] == "sentData")
    {
        require_once("classes/SentData.php");
        $sentData = new SentData();
        if ($sentData->errors) {
            foreach ($sentData->errors as $error) {
                $messageHandler->errors[] = $error;
            }   
        }   
        if ($sentData->messages) {
            foreach ($sentData->messages as $message) {
                $messageHandler->messages[] = $message;
            }   
        }
        if (!empty($messageHandler->errors))
        {
            include("views/error.php");
            return;
        }
        include("views/contest.php");
    }
    else
    {
        echo $_SESSION['status'];
        include("views/logged_in.php");
    }
} else {
    // the user is not logged in. you can do whatever you want here.
    // for demonstration purposes, we simply show the "you are not logged in" view.
    include("views/not_logged_in.php");
}
