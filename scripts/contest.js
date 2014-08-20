var contactToEdit;
$(document).ready( function() {
    setTimeout("", 1);
    var contestList = $.parseJSON(getCookie('contestList'));
    var masterList = $.parseJSON(getCookie('masterList'));
    if (!$("#title").html())
        $("#title").html(contestList['contest_name']);
    initDataEntryDisplay(false);
    initFrequencyDisplay(false);
    initContactModeDisplay(false);
    initSelectSectionDisplay(false);
    updateDisplay();

    document.getElementById("recvcall").addEventListener("keyup", checkPotentialDupes, false);
    // document.getElementById("recvcall").addEventListener("focusout", checkForDupe, false);
    $("#download").click(function() { console.log("Download triggered."); });
    $("#prefs").click(function() { console.log("Preferences triggered."); });
    $(".modal").on('click', ".edit-save", editContact);
    $(".modal").on('click', ".edit-dont-save", function() { contactToEdit = null; });
    $(".modal").on('click', ".edit-delete", deleteContact);
    $('body').on('dblclick', '#contactList', selectContactEdit);
    $('body').on('change', '#frequency select', function() { console.log("Frequency Select triggered."); });
    $('body').on('focusout', '#recvcall', checkForDupe);
});

var initDataEntryDisplay = function(edit) {
    var contestList = $.parseJSON(getCookie('contestList'));
    var data_container, pre_id;
    edit ? data_container = "editDataEntry" : data_container = "dataEntry";
    edit ? pre_id = "edit_" : pre_id = "";
    if (!$("#" + data_container).html())
    {
        var callAdded = false;
        var s = "";
        edit ? null : s = "<form id='contactdataform' name='contactdataform' method='POST' action='' onsubmit='enterNewContact(event); return false;'>";
        var double_index = 0;
        for (var x = 1; x < 6; x++)
        {
            if (!contestList['type_data' + x])
                continue;
            if (!callAdded && x > contestList['call_loc'])
            {
                s += htmlLongUpper(pre_id + 'recvcall', 'Call', "", true);
                $("#" + pre_id + "recvcall input").attr("tabindex", "1");
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
                        s += htmlLongUpper(pre_id + 'sentdata' + x, 'SENT', "", true);
                        s += htmlLongUpper(pre_id + 'recvdata' + x, 'RECV', "", true);
                        $("#" + pre_id + "sentdata" + x + " input").attr("tabindex", '"' + (x + double_index + 1) + '"');
                        $("#" + pre_id + "recvdata" + x + " input").attr("tabindex", '"' + (x + double_index + 2) + '"');
                        double_index++;
                    }
                    else
                    {
                        s += htmlLongUpper(pre_id + 'recvdata' + x, dataType['short_name'], "", true);
                        $("#" + pre_id + "recvdata" + x + " input").attr("tabindex", '"' + (x + double_index + 1) + '"');
                    }
                    break;
                case "number":
                    if (dataType['double_entry'] > 0)
                    {
                        s += "<label>" + dataType['short_name'] + "</label>";
                        s += htmlLongText(pre_id + 'sentdata' + x, 'SENT', "", true, "number");
                        s += htmlLongText(pre_id + 'recvdata' + x, 'RECV', "", true, "number");
                        $("#" + pre_id + "sentdata" + x + " input").attr("tabindex", '"' + (x + double_index + 1) + '"');
                        $("#" + pre_id + "recvdata" + x + " input").attr("tabindex", '"' + (x + double_index + 2) + '"');
                        double_index++;
                    }
                    else
                    {
                        s += htmlLongText(pre_id + 'recvdata' + x, dataType['short_name'], "", true, "number");
                        $("#" + pre_id + "recvdata" + x + " input").attr("tabindex", '"' + (x + double_index + 1) + '"');
                    }
                    break;
                case "special":
                    if (dataType['unique_name'] == "Precedent - ARRL November Sweepstakes")
                    {
                        if (dataType['double_entry'] > 0)
                        {
                            s += "<label>" + dataType['short_name'] + "</label>";
                            s += htmlLongUpper(pre_id + 'sentdata' + x, 'SENT', "", true);
                            s += htmlLongUpper(pre_id + 'recvdata' + x, 'RECV', "", true);
                            $("#" + pre_id + "sentdata" + x + " input").attr("tabindex", '"' + (x + double_index + 1) + '"');
                            $("#" + pre_id + "recvdata" + x + " input").attr("tabindex", '"' + (x + double_index + 2) + '"');
                            double_index++;
                        }
                        else
                        {
                            s += htmlLongUpper(pre_id + 'recvdata' + x, dataType['short_name'], "", true);
                            $("#" + pre_id + "recvdata" + x + " input").attr("tabindex", '"' + (x + double_index + 1) + '"');
                        }
                    }
                    break;
            }
        }
        edit ? null : s += "<input type='submit' name='contactdata' value='OK' /></form>";
        $("#" + data_container).html(s);
    }
}

var initFrequencyDisplay = function(edit) {
    var contestList = $.parseJSON(getCookie('contestList'));
    var data_container;
    edit ? data_container = "editFrequency" : data_container = "frequency";
    if (!$("#" + data_container).html())
    {
        if (contestList['band_flag'] != "Y")
        {
            $("#" + data_container).html(htmlLongEnum({htmlField: data_container, label: 'Band', enumlist: ["band_cat"], value: "", omit: ['ALL'] }));
        }
    }
}

var initContactModeDisplay = function(edit) {
    var contestList = $.parseJSON(getCookie('contestList'));
    var data_container;
    edit ? data_container = "editContactmode" : data_container = "contactmode";
    if (!$("#" + data_container).html())
    {
        if (contestList['mode_flag'] != "Y")
        {
            $("#" + data_container).html(htmlLongEnum({htmlfield: data_container, label: 'Mode', enumlist: ["mode_cat"], value: "", omit: ['MIXED']}));
        }
    }
}

var initSelectSectionDisplay = function(edit) {
    var contestList = $.parseJSON(getCookie('contestList'));
    var data_container;
    edit ? data_container = "editSectSelect" : data_container = "sectSelect";
    if (!$("#" + data_container).html())
    {
    }
}

var updateDisplay = function() {
    var masterList = $.parseJSON(getCookie('masterList'));
    $.ajax({
        type: "GET",
        url: "handlers/contact_data.php",
        data: { "contest_id" : masterList['contest_id'] },
        success: function(output) {
            var contacts = $.parseJSON(output);
            document.cookie = "fullContactList=" + JSON.stringify(contacts);
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
    $("#contactArea").html("<select multiple id='contactList' name='contactList'></select>");
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
    var contactList = [];
    for (var x in contacts)
    {
        var dupeCheck = { entry : contacts[x]['entry'], recvcall : contacts[x]['recvcall'] };
        if (contestList['freq_dupe_flag'] == "Y") dupeCheck['frequency'] = contacts[x]['frequency'];
        if (contestList['mode_dupe_flag'] == "Y") dupeCheck['contactmode'] = contacts[x]['contactmode'];
        var contact_string = "";
        contact_string += contacts[x]['frequency'].pad(5, " ", 0) + " "
                        + contacts[x]['contactmode'].pad(2, " ", 0) + " "
                        + moment(contacts[x]['contactdate']).utc().format("HHmm") + " "
                        + contacts[x]['recvcall'].pad(10, " ", 0);
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
                if (contestList['data' + y + '_dupe_flag'] == "Y") dupeCheck['recvdata' + y] = contacts[x]['recvdata' + y];
            }
        }
        var option = document.createElement('option');
        option.value = contacts[x]["entry"];
        option.text = contact_string;
        document.getElementsByName("contactList")[0].add(option);
        contactList.push(dupeCheck);
    }
    _.sortBy(contactList, function(d) { return d['recvcall']; });
    document.cookie = "contactList=" + JSON.stringify(contactList);
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
    generateNewContact();
    $.ajax({
        type: "POST",
        url: "handlers/contact_data.php",
        data: { "contactData" : JSON.stringify(contactData) }
    });
    resetContactDisplay();
}

var checkForDupe = function() {
    var contactList = $.parseJSON(getCookie('contactList'));
    var fullContactList = $.parseJSON(getCookie('fullContactList'));
    $("#dupeArea").html("");
    if ($("#recvcall").val() === "") return;
    for (var x in contactList)
    {
        if (checkContactForDupe(contactList[x], generateNewContact(), true))
        {
            var fullContact = _.findWhere(fullContactList, function(ct) { return ct['entry'] == contactList[x]['entry']; });
            $("#dupeArea").html(contactList[x]['recvcall'] + " IS A DUPLICATE! CONTACTED AT " + fullContact['contactdate']);
            resetContactDisplay();
            return;
        }
    }
}

var checkPotentialDupes = function() {
    var contactList = $.parseJSON(getCookie('contactList'));
    $("#dupeArea").html("");
    if ($("#recvcall").val() === "") return;
    for (var x in contactList)
    {
        if (checkContactForDupe(contactList[x], generateNewContact(), false)) $("#dupeArea").html($("#dupeArea").html() + contactList[x]['recvcall'] + " ");
    }
}

var getDupeList = function() {
    var contestList = $.parseJSON(getCookie('contestList'));
    var dupeList = ["recvcall"];
    if (contestList['freq_dupe_flag'] == "Y") dupeList.push("frequency");
    if (contestList['mode_dupe_flag'] == "Y") dupeList.push("contactmode");
    for (var x = 1; x <= 5; x++)
    {
        if (contestList['data' + x + '_dupe_flag'] == "Y") dupeList.push("recvdata" + x);
        else if (contestList['data' + x + '_dupe_flag'] == "D") _.extend(dupeList, ["sentdata" + x, "recvdata" + x]);
    }
    return dupeList;
}

var checkContactForDupe = function(contact1, contact2, fullCheck) {
    var dupeList = getDupeList();
    for (var x in dupeList)
    {
        if (_.has(contact1, dupeList[x]) && _.has(contact2, dupeList[x]))
        {
            if (!fullCheck && !contact1[dupeList[x]].match(contact2[dupeList[x]])) return false;
            if (fullCheck && contact1[dupeList[x]] !== contact2[dupeList[x]]) return false;
        }
    }
    return true;
}

var repeatCallSign = function(contact1) {
    var contactList = $.parseJSON(getCookie('contactList'));
    if ($("#recvcall").val() === "") return false;
    for (var x in contactList)
    {
        if (contact1["recvcall"] === contactList[x]["recvcall"]) return contactList[x];
    }
    return false;
}

var generateNewContact = function() {
    var masterList = $.parseJSON(getCookie('masterList'));
    return {
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
}

var resetContactDisplay = function() {
    // Reset Contact Display
    $("#recvcall").val("");
    for (var x = 1; x <= 5; x++)
    {
        $("#sentdata" + x).val("");
        $("#recvdata" + x).val("");
    }
    updateDisplay();
}

var selectContactEdit = function(e) {
    $(".modal-title").html("EDIT CONTACT");
    $(".modal-body").load("views/edit_contact.php", function() {
        setTimeout(initEditContact($("#contactList option:selected").val()), 1);
    });
    $(".modal").modal();
}

var initEditContact = function(entry) {
    initDataEntryDisplay(true);
    initFrequencyDisplay(true);
    initContactModeDisplay(true);
    initSelectSectionDisplay(true);
    var contactList = $.parseJSON(getCookie('fullContactList'));
    contactToEdit = _.findWhere(contactList, {entry: entry});
    $("#editFrequency").on("done", function(event) {
        setSelectValue("editFrequency", contactToEdit["frequency"]);
    });
    $("#editContactmode").on("done", function(event) {
        setSelectValue("editContactmode", contactToEdit["contactmode"]);
    });
    $("#edit_sentcall").val(contactToEdit["sentcall"]);
    $("#edit_sentdata1").val(contactToEdit["sentdata1"]);
    $("#edit_sentdata2").val(contactToEdit["sentdata2"]);
    $("#edit_sentdata3").val(contactToEdit["sentdata3"]);
    $("#edit_sentdata4").val(contactToEdit["sentdata4"]);
    $("#edit_sentdata5").val(contactToEdit["sentdata5"]);
    $("#edit_recvcall").val(contactToEdit["recvcall"]);
    $("#edit_recvdata1").val(contactToEdit["recvdata1"]);
    $("#edit_recvdata2").val(contactToEdit["recvdata2"]);
    $("#edit_recvdata3").val(contactToEdit["recvdata3"]);
    $("#edit_recvdata4").val(contactToEdit["recvdata4"]);
    $("#edit_recvdata5").val(contactToEdit["recvdata5"]);
}

var triggerDone = function(selectID) {
    if (selectID == "editFrequency") setSelectValue("editFrequency", contactToEdit["frequency"]);
}

var setSelectValue = function(selectID, value) {
    var sel = document.getElementById(selectID);
    if (!sel) return false;
    for (var i = 0; i < sel.options.length; i++)
    {
        if (sel.options[i].value == value)
        {
            sel.selectedIndex = i;
            return true;
        }
    }
    return false;
}

var deleteContact = function() {
    console.log("Delete Contact Selected.");
    console.log(contactToEdit);
}

var editContact = function() {
    console.log("Edit Contact Selected.");
    console.log(contactToEdit);
}
