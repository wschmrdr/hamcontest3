<?php
// show potential errors / feedback (from login object)
if (isset($messageHandler)) {
    if ($messageHandler->errors) {
        foreach ($messageHandler->errors as $error) {
            echo $error . "\n";
        }
    }
    if ($messageHandler->messages) {
        foreach ($messageHandler->messages as $message) {
            echo $message . "\n";
        }
    }
}
?>

<!-- login form box -->
<form method="post" action="index.php" name="loginform">

    <label for="login_input_username">User Name</label>
    <input id="login_input_username" class="login_input" type="text" name="user_name" required />

    <label for="login_input_password">Password</label>
    <input id="login_input_password" class="login_input" type="password" name="user_password" autocomplete="off" required />

    <input type="submit"  name="login" value="Log in" />

</form>

