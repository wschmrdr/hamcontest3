$(document).ready( function() {
    var contestList = $.parseJSON(getCookie('contestList'));
    var masterList = $.parseJSON(getCookie('masterList'));
    if (!$("#title").html())
        $("#title").html(contestList['contest_name']);
    if (!$("#dataEntry").html())
    {
        var callAdded = false;
        var s = "<form id='contactdataform' name='contactdataform' method='POST' action='' onsubmit='enterNewContact(event); return false;'>";
        var double_index = 0;
        for (var x = 1; x < 6; x++)
        {
            if (!contestList['type_data' + x])
                continue;
            if (!callAdded && x > contestList['call_loc'])
            {
                s += htmlLongUpper('recvcall', 'Call', "", true);
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
                        s += htmlLongUpper('sentdata' + x, 'SENT', "", true);
                        s += htmlLongUpper('recvdata' + x, 'RECV', "", true);
                        $("#sentdata" + x + " input").attr("tabindex", '"' + (x + double_index + 1) + '"');
                        $("#recvdata" + x + " input").attr("tabindex", '"' + (x + double_index + 2) + '"');
                        double_index++;
                    }
                    else
                    {
                        s += htmlLongUpper('recvdata' + x, dataType['short_name'], "", true);
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
                            s += htmlLongUpper('sentdata' + x, 'SENT', "", true);
                            s += htmlLongUpper('recvdata' + x, 'RECV', "", true);
                            $("#sentdata" + x + " input").attr("tabindex", '"' + (x + double_index + 1) + '"');
                            $("#recvdata" + x + " input").attr("tabindex", '"' + (x + double_index + 2) + '"');
                            double_index++;
                        }
                        else
                        {
                            s += htmlLongUpper('recvdata' + x, dataType['short_name'], "", true);
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
            $("#frequency").html(htmlLongEnum({htmlField: 'frequency', label: 'Band', enumlist: ["band_cat"], value: "", omit: ['ALL'] }));
        }
    }
    if (!$("#contactmode").html())
    {
        if (contestList['mode_flag'] != "Y")
        {
            $("#contactmode").html(htmlLongEnum({htmlfield: 'contactmode', label: 'Mode', enumlist: ["mode_cat"], value: "", omit: ['MIXED']}));
        }
    }
    if (!$("#sectSelect").html())
    {
    }
    if (!$("#contactList").html())
    {
        $("#contactList").html("<select multiple id='contactList' name='contactList'></select>");
    }
    updateDisplay();

    $("#recvcall").keypress(checkPotentialDupes());
    $("#recvcall").focusout(function() { console.log("Focus off triggered."); });
    $("#download").click(function() { console.log("Download triggered."); });
    $("#prefs").click(function() { console.log("Preferences triggered."); });
    $('body').on('dblclick', '#contactList select', function() { console.log("Contact List Select triggered."); });
    $('body').on('change', '#frequency select', function() { console.log("Frequency Select triggered."); });
});

var updateDisplay = function() {
    var masterList = $.parseJSON(getCookie('masterList'));
    $.ajax({
        type: "GET",
        url: "handlers/contact_data.php",
        data: { "contest_id" : masterList['contest_id'] },
        success: function(output) {
            var contacts = $.parseJSON(output);
            updateUserCheckLine();
            updateContactListDisplay(contacts);
            updateScoreDisplay(contacts);
        }
    });
}

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

function updateContactListDisplay(contacts) {
    $("#contactList").html("<select multiple id='contactList' name='contactList'></select>");
    var contact_list_string = "FREQ- MO TIME CALLSIGN--";
    var contestList = $.parseJSON(getCookie('contestList'));
    for (var x = 1; x <= 5; x++)
    {
        var dataType = getObject("dataType", contestList['type_data' + x]);
        if (!dataType) continue;
        if (dataType['max_length'] == 0 && dataType['unique_name'] == "Record Number - Unlimited Digits")
            var max_length = 4;
        else
            var max_length = dataType['max_length'];
        var s = dataType['short_name'];
        contact_list_string += " " + s.pad(max_length, "-", 1);
    }
    var option = document.createElement( 'option' );
    option.value = option.text = contact_list_string;
    option.disabled = true;
    document.getElementsByName("contactList")[0].add(option);
    for (var x in contacts)
    {
        var contact_string = "";
        contact_string += contacts[x]['frequency'].pad(5, " ", 0) + " "
                        + contacts[x]['contactmode'].pad(2, " ", 0) + " "
                        + moment(contacts[x]['contactdate']).utc().format("HHmm") + " "
                        + contacts[x]['recvcall'].pad(10, " ", 1);
        for (var y = 1; y <= 5; y++)
        {
            var dataType = getObject("dataType", contestList['type_data' + y]);
            if (dataType)
            {
                if (dataType['max_length'] == 0)
                {
                    switch (dataType['unique_name'])
                    {
                        case "Record Number - Unlimited Digits":
                            var max_length = 4;
                            break;
                        default:
                            var max_length = dataType['max_length'];
                    }
                }
                else var max_length = dataType['max_length'];
                var s = contacts[x]['recvdata' + y];
                contact_string += " " + s.pad(max_length, " ", 1);
            }
        }
        var option = document.createElement('option');
        option.text = contact_string;
        document.getElementsByName("contactList")[0].add(option);
    }
}

function updateScoreDisplay(contacts) {
    // LEGEND
    // OPERANDS
    // a = +
    // s = -
    // m = *
    // d = /
    // e = ^
    // OTHER CODES
    // p = (
    // n = )
    // c = constant (followed by constant number
    //   0 = contacts
    // 1-5 = data row
    //   6 = frequency (followed by 5-char frequency)
    //   7 = contact mode (followed by 2-char mode)
    var contestList = $.parseJSON(getCookie('contestList'));
    var formula = contestList['score_formula'];
    // MUST FOLLOW P-N, E, MD, AS
    var score = calculateScore(contacts, formula, []);
    $("#score").html("Current Score: " + score.constant);
}

function calculateScore(contacts, formula, endchars) {
    // If endchars is empty, go to the end of the string
    var iter = 0;
    var constant = "";
    var recursiveResult = [];
    var operand = ['a', 's', 'm', 'd', 'e'];
    var lookForOperand = false;
    while (iter < formula.length && ($.inArray(formula[iter], endchars) == -1))
    {
        if (!lookForOperand)
        {
            switch (formula[iter])
            {
                case 'c':
                    break;
                case '0':
                    constant = contacts.length;
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                    var masterList = $.parseJSON(getCookie('masterList'));
                    var unique = {};
                    var distinct = [];
                    for ( var i in contacts )
                    {
                        if ( typeof(unique[contacts[i]['recvdata' + formula[iter]]]) == "undefined")
                        {
                            distinct.push(contacts[i]['recvdata' + formula[iter]]);
                        }
                        unique[contacts[i]['recvdata' + formula[iter]]] = 0;
                    }
                    constant = distinct.length;
                    break;
                case '6':
                    frequency = formula.substr(iter+1, iter+6);
                    var count = 0;
                    for ( var i in contacts )
                    {
                        if ( contacts[i]['frequency'] == frequency) ++count;
                    }
                    constant = count;
                    iter += 5;
                    break;
                case '7':
                    contactmode = formula.substr(iter+1, iter+3);
                    var count = 0;
                    for ( var i in contacts )
                    {
                        if ( contacts[i]['contactmode'] == contactmode) ++count;
                    }
                    constant = count;
                    iter += 2;
                    break;

            }
            lookForOperand = true;
            ++iter;
        }
        else
        {
            // If there is no operand, we are in a constant
            switch (formula[iter])
            {
                case 'a':
                    recursiveResult = calculateScore(contacts, formula.substr(iter+1), ['a', 's']);
                    constant = parseInt(constant, 10) + recursiveResult.constant;
                    iter += recursiveResult.iter + 1;
                    break;
                case 's':
                    recursiveResult = calculateScore(contacts, formula.substr(iter+1), ['a', 's']);
                    constant = parseInt(constant, 10) - recursiveResult.constant;
                    iter += recursiveResult.iter + 1;
                    break;
                case 'm':
                    recursiveResult = calculateScore(contacts, formula.substr(iter+1), ['m', 'd', 'a', 's']);
                    constant = parseInt(constant, 10) * recursiveResult.constant;
                    iter += recursiveResult.iter + 1;
                    break;
                case 'd':
                    recursiveResult = calculateScore(contacts, formula.substr(iter+1), ['m', 'd', 'a', 's']);
                    constant = parseInt(constant, 10) / recursiveResult.constant;
                    iter += recursiveResult.iter + 1;
                    break;
                case 'e':
                    recursiveResult = calculateScore(contacts, formula.substr(iter+1), operand);
                    constant = Math.pow(parseInt(constant, 10), recursiveResult.constant);
                    iter += recursiveResult.iter + 1;
                    break;
                default:
                    constant += formula[iter];
                    ++iter;
            }
        }
    }
    return {'iter' : iter, 'constant' : constant};
}

var enterNewContact = function(e) {
    e.preventDefault();
    var masterList = $.parseJSON(getCookie('masterList'));
    // Check for Valid Contact
        // Dupe Check
        // Contents
        if ($("#recvcall").val()) $("#recvcall").val($("#recvcall").val().toUpperCase());
        for (var x = 1; x <= 5; x++)
        {
            if ($("#recvdata" + x).val()) $("#recvdata" + x).val($("#recvdata" + x).val().toUpperCase());
            if ($("#sentdata" + x).val()) $("#sentdata" + x).val($("#sentdata" + x).val().toUpperCase());
        }
        if (!isValidCall($("#recvcall").val()))
        {
            $("#dupeArea").html("Call is not valid.");
            return;
        }
        if ($("select#frequency").val() == '')
        {
            $("#frequency_required").html("REQUIRED").fadeOut(1600);
            return;
        }
        if ($("select#contactmode").val() == '')
        {
            $("#contactmode_required").html("REQUIRED").fadeOut(1600);
            return;
        }
    // Add Contact
    var contactData = {
        contest_id : masterList["contest_id"],
        frequency : $("#frequency select").val() || masterList["band_cat"],
        contactmode : $("#contactmode select").val() || masterList["mode_cat"],
        sentcall : masterList["callsign"],
        sentdata1 : $("#sentdata1").val() || masterList["x_data1"],
        sentdata2 : $("#sentdata2").val() || masterList["x_data2"],
        sentdata3 : $("#sentdata3").val() || masterList["x_data3"],
        sentdata4 : $("#sentdata4").val() || masterList["x_data4"],
        sentdata5 : $("#sentdata5").val() || masterList["x_data5"],
        recvcall : $("#recvcall").val().toUpperCase() || $("#recvcall").val(),
        recvdata1 : $("#recvdata1").val(),
        recvdata2 : $("#recvdata2").val(),
        recvdata3 : $("#recvdata3").val(),
        recvdata4 : $("#recvdata4").val(),
        recvdata5 : $("#recvdata5").val()
    };
    $.ajax({
        type: "POST",
        url: "handlers/contact_data.php",
        data: { "contactData" : JSON.stringify(contactData) }
    });
    // Reset Contact Display
    $("#recvcall").val("");
    for (var x = 1; x <= 5; x++)
    {
        $("#sentdata" + x).val("");
        $("#recvdata" + x).val("");
    }
    updateDisplay();
}

var checkPotentialDupes = function() {
    console.log("Key Press triggered.");
}
