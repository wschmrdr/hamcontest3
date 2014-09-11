<html>
    <head>
        <link rel="stylesheet" href="assets/overrides.css"></link>
        <link rel="stylesheet" href="bootstrap-3.2.0-dist/css/bootstrap.css"></link>
        <link rel="stylesheet" href="jquery-ui-1.11.1.custom/jquery-ui.css"></link>
        <link rel="stylesheet" href="timepicker/jquery-ui-timepicker-addon.css"></link>
        <script src="jquery-1.10.1.js"></script>
        <script src="underscore-min.js"></script>
        <script src="scripts/contest.js"></script>
        <script src="scripts/common.js"></script>
        <script src="scripts/htmltemp.js"></script>
        <script src="scripts/enum.js"></script>
        <script src="moment.min.js"></script>
        <script src="pad.js"></script>
        <script src="bootstrap-3.2.0-dist/js/bootstrap.js"></script>
        <script src="jquery-ui-1.11.1.custom/jquery-ui.js"></script>
        <script src="timepicker/jquery-ui-timepicker-addon.js"></script>
    </head>
    <body>
    <h3 class="login-title">Welcome to the WA2AEA Contest Logger!</h3>
    <div class="subsection login">
<?php
// show potential errors / feedback (from login object)
if (isset($messageHandler)) {
    if ($messageHandler->errors) {
        echo "<div class='subsection error-subsection'>";
        foreach ($messageHandler->errors as $error) {
            echo $error . "\n";
        }
        echo "</div><br/>";
    }
?>
<?php
    if ($messageHandler->messages) {
        echo "<div class='subsection warning-subsection'>";
        foreach ($messageHandler->messages as $message) {
            echo $message . "\n";
        }
        echo "</div><br/>";
    }
}
?>
<form method="post" action="index.php" name="loginform">

    <label for="login_input_username" class="login">Call Sign</label>
    <input id="login_input_username" class="login_input" type="text" name="user_name" required />
    <br/>
    <label for="login_input_password" class="login">Password</label>
    <input id="login_input_password" class="login_input" type="password" name="user_password" autocomplete="off" required />
    <br/>
    <br/>
    <input class="btn btn-primary" type="submit"  name="login" value="Log in" />
    <a class="btn btn-info register" href="register.php">Register</a>
</form>
</div>
    </body>
</html>
