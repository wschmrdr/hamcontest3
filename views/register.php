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
    <h3 class="login-title">Contest Logger Registration</h3>
    <div class="subsection register">
<?php
// show potential errors / feedback (from registration object)
if (isset($registration)) {
    if ($registration->errors) {
        foreach ($registration->errors as $error) {
            echo $error;
        }
    }
    if ($registration->messages) {
        foreach ($registration->messages as $message) {
            echo $message;
        }
    }
}
?>

<!-- register form -->
<form method="post" action="register.php" name="registerform">

    <!-- the user name input field uses a HTML5 pattern check -->
    <label for="login_input_username" class="register">Call Sign</label>
    <input id="login_input_username" class="login_input" type="text" pattern="[a-zA-Z0-9]{2,64}" name="user_name" required />
    <br/>
    <!-- the email input field uses a HTML5 email type check -->
    <label for="login_input_email" class="register">E-mail</label>
    <input id="login_input_email" class="login_input" type="email" name="user_email" required />
    <br/>
    <label for="login_input_password_new" class="register">Password</label>
    <input id="login_input_password_new" class="login_input" type="password" name="user_password_new" pattern=".{6,}" required autocomplete="off" />
    <br/>
    <label for="login_input_password_repeat" class="register">Repeat password</label>
    <input id="login_input_password_repeat" class="login_input" type="password" name="user_password_repeat" pattern=".{6,}" required autocomplete="off" />
    <br/>
    <br/>
    <input class="btn btn-primary" type="submit"  name="register" value="Register" />
    <a class="btn btn-danger register" href="index.php">Cancel</a>

</form>

<!-- backlink -->
        </div>
    </body>
</html>
