<?php
// show potential errors / feedback (from login object)
if (isset($messageHandler)) {
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
}
// contestSelected(this.value)
?>
<html>
    <head>
        <script src="jquery-1.10.1.min.js"></script>
        <script src="underscore-min.js"></script>
        <script src="scripts/sent_data.js"></script>
        <script src="scripts/common.js"></script>
        <script src="scripts/htmltemp.js"></script>
        <script src="scripts/enum.js"></script>
        <script src="moment.min.js"></script>
    </head>
    <body>
<!-- sentdata form box -->
<form id="sentdataform" method="post" action="index.php" name="sentdataform">

	<div id="contestname"></div>
    <div id="contestselect"></div>
    <div id="otherdata"></div>
    <div id="contestparams"></div>
    <br />
    <input type="submit" name="sentdata" value="OK" />

</form>
<a href="index.php?logout">Logout</a>
    </body>
</html>
