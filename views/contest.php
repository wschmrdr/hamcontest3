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
?>
<html>
    <head>
        <script src="jquery-1.10.1.min.js"></script>
        <script src="underscore-min.js"></script>
        <script src="scripts/htmltemp.js"></script>
        <script src="scripts/enum.js"></script>
        <script src="moment.min.js"></script>
    </head>
    <body>
        <div id="title"></div>
        <div id="score"></div>
        <div id="dataEntry"></div>
        <div id="bandSelect"></div>
        <div id="modeSelect"></div>
        <div id="sectSelect"></div>
        <div id="sentData"></div>
        <div id="contactList"></div>
        <a href="#" id="download">Download</a><br/>
        <a href="#" id="prefs">Preferences</a><br/>
        <a href="index.php?logout">Logout</a><br/>
    </body>
</html>
