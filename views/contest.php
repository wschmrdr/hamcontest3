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
        <link rel="stylesheet" href="bootstrap-3.2.0-dist/css/bootstrap.css"></link>
        <script src="jquery-1.10.1.js"></script>
        <script src="underscore-min.js"></script>
        <script src="scripts/contest.js"></script>
        <script src="scripts/common.js"></script>
        <script src="scripts/htmltemp.js"></script>
        <script src="scripts/enum.js"></script>
        <script src="moment.min.js"></script>
        <script src="pad.js"></script>
        <script src="bootstrap-3.2.0-dist/js/bootstrap.js"></script>
    </head>
    <body>
        <div id="title"></div>
        <div id="score"></div>
        <div id="dataEntry"></div>
        <div id="frequency"></div>
        <div id="contactmode"></div>
        <div id="sectSelect"></div>
        <div id="checkLine"></div>
        <div id="contactArea"></div>
        <div id="dupeArea"></div>
        <a href="#" id="download">Download</a><br/>
        <a href="#" id="prefs">Preferences</a><br/>
        <a href="index.php?logout">Logout</a><br/>
<!-- Modal -->
        <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                            <span class="sr-only">Close</span>
                        </button>
                        <h4 class="modal-title" id="myModalLabel" />
                    </div>
                    <div class="modal-body" />
                </div>
            </div>
        </div>
    </body>
</html>
