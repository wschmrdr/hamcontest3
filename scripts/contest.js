$(document).ready( function() {
    var contestList = $.parseJSON(getCookie('contestList'));
    if (!$("#title").html())
        $("#title").html(contestList['contest_name']);
    if (!$("#score").html())
    {
    }
    if (!$("#dataEntry").html())
    {
    }
    if (!$("#bandSelect").html())
    {
    }
    if (!$("#modeSelect").html())
    {
    }
    if (!$("#sectSelect").html())
    {
    }
    if (!$("#dupeArea").html())
    {
    }
    if (!$("#contactList").html())
    {
    }
    if (!$("#sentData").html())
    {
    }
});
