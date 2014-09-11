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
        <link rel="stylesheet" href="jquery-ui-1.11.1.custom/jquery-ui.css"></link>
        <link rel="stylesheet" href="timepicker/jquery-ui-timepicker-addon.css"></link>
        <link rel="stylesheet" href="assets/overrides.css"></link>
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
        <div id="contestHeader" class="header">
            <img src='wa2aeasoftware100.png' class='logo pull-left'/>
            <h1 class='header-title pull-center'>Contest Logger</h1>
        </div>
        <div class="contest-subsection center">
          <div>
            <span class='pull-right'>
              <span class='btn-group contest-title'>
                <button type='button' class='btn btn-default dropdown-toggle' data-toggle='dropdown'>
                  Menu
                  <span class='caret'></span>
                </button>
                <ul class='dropdown-menu dropdown-menu-right' role='menu'>
                  <li><a href="#" id="sentdata">Edit Contest Data</a></li>
                  <li><a href="handlers/export.php" target="_blank" id="download">Download</a></li>
                  <li><a href="index.php?logout">Logout</a></li>
                </ul>
              </span>
            </span>
            <span id="contestTitle"></span>
          </div>
            <div id="score"></div>
            <div id="checkLine" class="check-line pull-center"></div>
            <div id="frequency_container"></div>
            <div id="contactmode_container"></div>
            <div id="sectSelect_container"></div>
            <div id="dataEntry"></div>
            <div id="dupeArea" class='dupe-check'></div>
            <div id="contactArea"></div>
        </div>
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
