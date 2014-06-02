$(document).ready( function() {
    var contestList = $.parseJSON(getCookie('contestList'));
    var masterList = $.parseJSON(getCookie('masterList'));
    if (!$("#title").html())
        $("#title").html(contestList['contest_name']);
    if (!$("#dataEntry").html())
    {
        var callAdded = false;
        var s = "<form id='contactdataform' name='contactdataform' method='POST' action='' onsubmit='enterNewContact(); return false;'>";
        var double_index = 0;
        for (var x = 1; x < 6; x++)
        {
            if (!contestList['type_data' + x])
                continue;
            if (!callAdded && x > contestList['call_loc'])
            {
                s += htmlLongText('recvcall', 'Call', "", true, "string");
                $("#recvcall input").attr("tabindex", "1");
                callAdded = true;
            }
            var dataType = getObject("dataType", contestList['type_data' + x]);
            if (!dataType) continue;
            switch (dataType['data_type'])
            {
                case "string":
                case "enum":
                    if (dataType['double_entry'] > 0)
                    {
                        s += "<label>" + dataType['short_name'] + "</label>";
                        s += htmlLongText('sentdata' + x, 'SENT', "", true, "string");
                        s += htmlLongText('recvdata' + x, 'RECV', "", true, "string");
                        $("#sentdata" + x + " input").attr("tabindex", '"' + (x + double_index + 1) + '"');
                        $("#recvdata" + x + " input").attr("tabindex", '"' + (x + double_index + 2) + '"');
                        double_index++;
                    }
                    else
                    {
                        s += htmlLongText('recvdata' + x, dataType['short_name'], "", true, "string");
                        $("#recvdata" + x + " input").attr("tabindex", '"' + (x + double_index + 1) + '"');
                    }
                    break;
                case "number":
                    if (dataType['double_entry'] > 0)
                    {
                        s += "<label>" + dataType['short_name'] + "</label>";
                        s += htmlLongText('sentdata' + x, 'SENT', "", true, "number");
                        s += htmlLongText('recvdata' + x, 'RECV', "", true, "number");
                        $("#sentdata" + x + " input").attr("tabindex", '"' + (x + double_index + 1) + '"');
                        $("#recvdata" + x + " input").attr("tabindex", '"' + (x + double_index + 2) + '"');
                        double_index++;
                    }
                    else
                    {
                        s += htmlLongText('recvdata' + x, dataType['short_name'], "", true, "number");
                        $("#recvdata" + x + " input").attr("tabindex", '"' + (x + double_index + 1) + '"');
                    }
                    break;
                case "special":
                    if (dataType['unique_name'] == "Precedent - ARRL November Sweepstakes")
                    {
                        if (dataType['double_entry'] > 0)
                        {
                            s += "<label>" + dataType['short_name'] + "</label>";
                            s += htmlLongText('sentdata' + x, 'SENT', "", true, "string");
                            s += htmlLongText('recvdata' + x, 'RECV', "", true, "string");
                            $("#sentdata" + x + " input").attr("tabindex", '"' + (x + double_index + 1) + '"');
                            $("#recvdata" + x + " input").attr("tabindex", '"' + (x + double_index + 2) + '"');
                            double_index++;
                        }
                        else
                        {
                            s += htmlLongText('recvdata' + x, dataType['short_name'], "", true, "string");
                            $("#recvdata" + x + " input").attr("tabindex", '"' + (x + double_index + 1) + '"');
                        }
                    }
                    break;
            }
        }
        s += "<input type='submit' name='contactdata' value='OK' /></form>";
        $("#dataEntry").html(s);
    }
    if (!$("#frequency").html())
    {
        if (contestList['band_flag'] != "Y")
        {
            $("#frequency").html(htmlLongEnum('frequency', 'Band', ["band_cat"], "", ['ALL']));
        }
    }
    if (!$("#contactmode").html())
    {
        if (contestList['mode_flag'] != "Y")
        {
            $("#contactmode").html(htmlLongEnum('contactmode', 'Mode', ["mode_cat"], "", ['MIXED']));
        }
    }
    if (!$("#sectSelect").html())
    {
    }
    if (!$("#contactList").html())
    {
        $("#contactList").html("<select multiple id='contactList' name='contactList'></select>");
    }
    updateUserCheckLine();
    updateContactListDisplay();
    updateScoreDisplay();

    $("#recvcall").keypress(function() { console.log("Key Press triggered."); });
    $("#recvcall").focusout(function() { console.log("Focus off triggered."); });
    $("#download").click(function() { console.log("Download triggered."); });
    $("#prefs").click(function() { console.log("Preferences triggered."); });
    $('body').on('dblclick', '#contactList select', function() { console.log("Contact List Select triggered."); });
    $('body').on('change', '#frequency select', function() { console.log("Frequency Select triggered."); });
});

var updateUserCheckLine = function() {
    var contestList = $.parseJSON(getCookie('contestList'));
    var masterList = $.parseJSON(getCookie('masterList'));
    var callAdded = false;
    var s = "";
    for (var x = 1; x < 6; x++)
    {
        if (!contestList['type_data' + x])
            continue;
        if (!callAdded && x > contestList['call_loc'])
        {
            s += masterList['callsign'] + " ";
            callAdded = true;
        }
        if (masterList['x_data' + x])
        {
            var dataType = getObject("dataType", contestList['type_data' + x]);
            if (!dataType) continue;
            if (dataType['unique_name'] == "Precedent - ARRL November Sweepstakes")
                s += displayNovSSPrecedent(masterList['x_data' + x]) + " ";
            else
                s += masterList['x_data' + x] + " ";
        }
    }
    $("#checkLine").html(s);
}

var updateContactListDisplay = function() {
    var masterList = $.parseJSON(getCookie('masterList'));
    $.ajax({
        type: "GET",
        url: "handlers/contact_data.php",
        data: { "contest_id" : masterList['contest_id'] },
        success: function(output) {
            var contacts = $.parseJSON(output);
            $("#contactList").html("<select multiple id='contactList' name='contactList'></select>");
            for (var x in contacts)
            {
                document.getElementsByName("contactList")[0].add(contacts[x]);
            }
        }
    });
}

var updateScoreDisplay = function() {
}

var enterNewContact = function() {
    var masterList = $.parseJSON(getCookie('masterList'));
    console.log("Enter New Contact triggered.");
    // Check for Valid Contact
        // Dupe Check
        // Contents
        if (!isValidCall($("#recvcall").val()))
        {
            $("#dupearea").html("Call is not valid.");
        }
    // Add Contact
    var contactData = {};
    contactData["contest_id"] = masterList["contest_id"];
    contactData["frequency"] = "";
    $.ajax({
        type: "POST",
        url: "handlers/enter_contact.php",
        data {}
    });
    // Reset Contact Display
    // Update Contact List Display
    updateContactListDisplay();
    // Update User Check Line
    updateUserCheckLine();
    // Update Score Display
    updateScoreDisplay();
}
