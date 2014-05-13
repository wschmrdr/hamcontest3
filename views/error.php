<?php
if ($messageHandler->errors) {
    foreach ($messageHandler->errors as $error) {
        echo $error . "<br/>";
    }   
}   
if ($messageHandler->messages) {
    foreach ($messageHandler->messages as $message) {
        echo $message . "<br/>";
    }
}
echo "<a href='index.php?logout'>Logout</a>";
