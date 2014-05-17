$(document).ready( function() {
    var contestList = $.parseJSON(getCookie('contestList'));
    var masterList = $.parseJSON(getCookie('masterList'));
    if (!$("#title").html())
        $("#title").html(contestList['contest_name']);
    if (!$("#dataEntry").html())
    {
    }
    if (!$("#frequency").html())
    {
        if (contestList['band_flag'] != "Y")
        {
            htmlLongEnum('frequency', 'Band', ["band_cat"], "");
        }
    }
    if (!$("#contactmode").html())
    {
        if (contestList['mode_flag'] != "Y")
        {
            htmlLongEnum('contactmode', 'Mode', ["mode_cat"], "");
        }
    }
    if (!$("#sectSelect").html())
    {
    }
    if (!$("#contactList").html())
    {
    }
    if (!$("#sentData").html())
    {
    }
});
