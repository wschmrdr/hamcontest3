$(document).ready( function() {
    var contestList = $.parseJSON(getCookie('contestList'));
    if (!$("#title").html())
        $("#title").html(contestList['contest_name']);
});
