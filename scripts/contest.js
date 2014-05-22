$(document).ready( function() {
    var contestList = $.parseJSON(getCookie('contestList'));
    var masterList = $.parseJSON(getCookie('masterList'));
    if (!$("#title").html())
        $("#title").html(contestList['contest_name']);
    if (!$("#dataEntry").html())
    {
        var callAdded = false;
        var s = "<form id='contactdataform' name='sentdataform'>";
        for (var x = 1; x < 6; x++)
        {
            if (!contestList['type_data' + x])
                continue;
            if (!callAdded && x > contestList['call_loc'])
            {
                s += htmlLongText('recvcall', 'Call', "", true, "string");
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
                    }
                    else
                    {
                        s += htmlLongText('recvdata' + x, dataType['short_name'], "", true, "string");
                    }
                    break;
                case "number":
                    if (dataType['double_entry'] > 0)
                    {
                        s += "<label>" + dataType['short_name'] + "</label>";
                        s += htmlLongText('sentdata' + x, 'SENT', "", true, "number");
                        s += htmlLongText('recvdata' + x, 'RECV', "", true, "number");
                    }
                    else
                    {
                        s += htmlLongText('recvdata' + x, dataType['short_name'], "", true, "number");
                    }
                    break;
                case "special":
                    if (dataType['unique_name'] == "Precedent - ARRL November Sweepstakes")
                    {
                        if (dataType['double_entry'] > 0)
                        {
                            s += "<label>" + dataType['short_name'] + "</label>";
                            s += htmlLongText('sentdata' + x, 'SENT', "", true, "number");
                            s += htmlLongText('recvdata' + x, 'RECV', "", true, "number");
                        }
                        else
                        {
                            s += htmlLongText('recvdata' + x, dataType['short_name'], "", true, "number");
                        }
                    }
                    break;
            }
        }
        s += "<input type='submit' name='sentdata' value='OK' /></form>";
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
            $("#contactmode").html(htmlLongEnum('contactmode', 'Mode', ["mode_cat"], "", 'ALL'));
            var x = $("#contactmode select option[value='MIXED']").index();
            document.getElementsByName("frequency")[0].remove(x);
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
            s += masterList['x_data' + x] + " ";
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
