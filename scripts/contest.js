var contactToEdit, fullContactList, masterList, contestList, dataTypeList, dupeList, enumValues = {};

$(document).ready( function() {
    setTimeout("", 1);
    initSentData();
    getDataType();
    getContestList();

    $(document).on("clLoadDone", "body", loadContestName);

    $("#download").click(function() { console.log("Download triggered."); });
    $("#prefs").click(function() { console.log("Preferences triggered."); });
    $(".modal").on('click', ".edit-save", editContact);
    $(".modal").on('click', ".edit-dont-save", function() { contactToEdit = null; });
    $(".modal").on('click', ".edit-delete", deleteContact);
    $('body').on('dblclick', '#contactList', selectContactEdit);
    $('body').on('change', '#frequency select', function() { console.log("Frequency Select triggered."); });
    $('body').on("keyup", "#recvcall", checkPotentialDupes);
    $('body').on('focusout', '#recvcall', checkForDupe);

});

var initContest = function() {
    $("body").off("mlLoadDone", initContest);
    initMainScreen();
    $(".modal").modal('hide');
}

var initMainScreen = function() {
    var contest = _.findWhere(contestList, {
        contest_name_id: getCookie("contest_name_id")
    });
    $("#contestTitle").html(contest['contest_name']);
    initDataEntryDisplay(false);
    initFrequencyDisplay(false);
    initContactModeDisplay(false);
    initSelectSectionDisplay(false);
    updateDisplay();
}

var initDataEntryDisplay = function(edit_flag) {
    var contest = _.findWhere(contestList, {contest_name_id : getCookie('contest_name_id')});
    var data_container, pre_id;
    edit_flag ? data_container = "edit_dataEntry" : data_container = "dataEntry";
    edit_flag ? pre_id = "edit_" : pre_id = "";
    if (!$("#" + data_container).html())
    {
        var callAdded = false;
        var s = "";
        edit_flag ? null : s = "<form id='contactdataform' name='contactdataform' method='POST' action='' onsubmit='enterNewContact(event); return false;'>";
        var double_index = 0;
        for (var x = 1; x < 6; x++)
        {
            if (!contest['type_data' + x])
                continue;
            if (!callAdded && x > contest['call_loc'])
            {
                s += htmlLongUpper(pre_id + 'recvcall', 'Call', "", true);
                $("#" + pre_id + "recvcall input").attr("tabindex", "1");
                callAdded = true;
            }
            var dataType = _.findWhere(dataTypeList, {data_type_id: contest['type_data' + x]});
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
        edit_flag ? null : s += "<input type='submit' name='contactdata' value='OK' /></form>";
        $("#" + data_container).html(s);
    }
}

var initFrequencyDisplay = function(edit_flag) {
    var contest = _.findWhere(contestList, {contest_name_id : getCookie('contest_name_id')});
    var data_container;
    edit_flag ? data_container = "edit_frequency" : data_container = "frequency";
    if (!$("#" + data_container).html())
    {
        if (contest['band_flag'] != "Y")
        {
            $("#" + data_container).html(htmlLongEnum({htmlField: data_container, label: 'Band', enumlist: ["band_cat"], value: "", omit: ['ALL'] }));
        }
    }
}

var initContactModeDisplay = function(edit_flag) {
    var contest = _.findWhere(contestList, {contest_name_id : getCookie('contest_name_id')});
    var data_container;
    edit_flag ? data_container = "edit_contactmode" : data_container = "contactmode";
    if (!$("#" + data_container).html())
    {
        if (contest['mode_flag'] != "Y")
        {
            $("#" + data_container).html(htmlLongEnum({htmlfield: data_container, label: 'Mode', enumlist: ["mode_cat"], value: "", omit: ['MIXED']}));
        }
    }
}

var initSelectSectionDisplay = function(edit_flag) {
    var contest = _.findWhere(contestList, {contest_name_id : getCookie('contest_name_id')});
    var data_container;
    edit_flag ? data_container = "edit_sectSelect" : data_container = "sectSelect";
    if (!$("#" + data_container).html())
    {
    }
}

var updateDisplay = function() {
    $.ajax({
        type: "GET",
        url: "handlers/contact_data.php",
        data: { "contest_id" : getCookie('contest_id') },
        success: function(output) {
            fullContactList = $.parseJSON(output);
            updateUserCheckLine();
            updateContactListDisplay();
            updateScoreDisplay();
        }
    });
}

var updateUserCheckLine = function() {
    var contest = _.findWhere(contestList, {contest_name_id : getCookie('contest_name_id')});
    var instance = _.findWhere(masterList, {contest_id : getCookie('contest_id')});
    var callAdded = false;
    var s = "";
    for (var x = 1; x < 6; x++)
    {
        if (!contest['type_data' + x])
            continue;
        if (!callAdded && x > contest['call_loc'])
        {
            s += instance['callsign'] + " ";
            callAdded = true;
        }
        if (instance['x_data' + x])
        {
            var dataType = _.findWhere(dataTypeList, {data_type_id: contest['type_data' + x]});
            if (!dataType) continue;
            if (dataType['unique_name'] == "Precedent - ARRL November Sweepstakes")
                s += displayNovSSPrecedent(instance['x_data' + x]) + " ";
            else
                s += instance['x_data' + x] + " ";
        }
    }
    $("#checkLine").html(s);
}

function updateContactListDisplay() {
    $("#contactArea").html("<select multiple id='contactList' name='contactList'></select>");
    var contact_list_string = "FREQ- MO TIME CALLSIGN--";
    var contest = _.findWhere(contestList, {contest_name_id : getCookie('contest_name_id')});
    for (var x = 1; x <= 5; x++)
    {
        var dataType = _.findWhere(dataTypeList, {data_type_id: contest['type_data' + x]});
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
    for (var x in fullContactList)
    {
        dupeList = ['recvcall'];
        if (contest['freq_dupe_flag'] == "Y") dupeList.push('frequency');
        if (contest['mode_dupe_flag'] == "Y") dupeList.push('contactmode');
        var contact_string = "";
        contact_string += fullContactList[x]['frequency'].pad(5, " ", 0) + " "
                        + fullContactList[x]['contactmode'].pad(2, " ", 0) + " "
                        + moment(fullContactList[x]['contactdate']).utc().format("HHmm") + " "
                        + fullContactList[x]['recvcall'].pad(10, " ", 0);
        for (var y = 1; y <= 5; y++)
        {
            var dataType = _.findWhere(dataTypeList, {
                data_type_id: contest['type_data' + y]
            });
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
                var s = fullContactList[x]['recvdata' + y];
                contact_string += " " + s.pad(max_length, " ", 1);
                if (contestList['data' + y + '_dupe_flag'] == "Y")
                    dupeList.push('recvdata' + y);
            }
        }
        var option = document.createElement('option');
        option.value = fullContactList[x]["entry"];
        option.text = contact_string;
        document.getElementsByName("contactList")[0].add(option);
    }
}

function updateScoreDisplay() {
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
    var contest = _.findWhere(contestList, {contest_name_id : getCookie('contest_name_id')});
    var formula = contest['score_formula'];
    // MUST FOLLOW P-N, E, MD, AS
    var score = calculateScore(formula, []);
    $("#score").html("Current Score: " + score.constant);
}

function calculateScore(formula, endchars) {
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
                    constant = fullContactList.length;
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                    var instance = _.findWhere(masterList, {contest_id : getCookie('contest_id')});
                    var unique = {};
                    var distinct = [];
                    for ( var i in fullContactList )
                    {
                        if ( typeof(unique[fullContactList[i]['recvdata' + formula[iter]]]) == "undefined")
                        {
                            distinct.push(fullContactList[i]['recvdata' + formula[iter]]);
                        }
                        unique[fullContactList[i]['recvdata' + formula[iter]]] = 0;
                    }
                    constant = distinct.length;
                    break;
                case '6':
                    frequency = formula.substr(iter+1, iter+6);
                    var count = 0;
                    for ( var i in fullContactList )
                    {
                        if ( fullContactList[i]['frequency'] == frequency) ++count;
                    }
                    constant = count;
                    iter += 5;
                    break;
                case '7':
                    contactmode = formula.substr(iter+1, iter+3);
                    var count = 0;
                    for ( var i in fullContactList )
                    {
                        if ( fullContactList[i]['contactmode'] == contactmode) ++count;
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
                    recursiveResult = calculateScore(formula.substr(iter+1), ['a', 's']);
                    constant = parseInt(constant, 10) + recursiveResult.constant;
                    iter += recursiveResult.iter + 1;
                    break;
                case 's':
                    recursiveResult = calculateScore(formula.substr(iter+1), ['a', 's']);
                    constant = parseInt(constant, 10) - recursiveResult.constant;
                    iter += recursiveResult.iter + 1;
                    break;
                case 'm':
                    recursiveResult = calculateScore(formula.substr(iter+1), ['m', 'd', 'a', 's']);
                    constant = parseInt(constant, 10) * recursiveResult.constant;
                    iter += recursiveResult.iter + 1;
                    break;
                case 'd':
                    recursiveResult = calculateScore(formula.substr(iter+1), ['m', 'd', 'a', 's']);
                    constant = parseInt(constant, 10) / recursiveResult.constant;
                    iter += recursiveResult.iter + 1;
                    break;
                case 'e':
                    recursiveResult = calculateScore(formula.substr(iter+1), operand);
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
    // Check for Valid Contact
    if (checkValidContact(false)) return;
    // Add Contact
    contactData = generateNewContact(event, false);
    $.ajax({
        type: "POST",
        url: "handlers/contact_data.php",
        data: { "contactData" : JSON.stringify(contactData) }
    });
    resetContactDisplay();
}

var checkValidContact = function(edit_flag) {
    var pre_id;
    var invalid;
    edit_flag ? pre_id = "edit_" : pre_id = "";
    

    // Dupe Check
    invalid = checkForDupe(event, edit_flag);

    // Contents
    if ($("#" + pre_id + "recvcall").val())
        $("#" + pre_id + "recvcall").val($("#" + pre_id + "recvcall").val().toUpperCase());
    for (var x = 1; x <= 5; x++)
    {
        if ($("#" + pre_id + "recvdata" + x).val())
            $("#" + pre_id + "recvdata" + x).val($("#" + pre_id + "recvdata" + x).val().toUpperCase());
        if ($("#" + pre_id + "sentdata" + x).val())
            $("#" + pre_id + "sentdata" + x).val($("#" + pre_id + "sentdata" + x).val().toUpperCase());
    }
    if (!isValidCall($("#" + pre_id + "recvcall").val()))
    {
        $("#" + pre_id + "dupeArea").html("Call is not valid.");
        invalid = true;
    }
    if ($("select#" + pre_id + "frequency").val() == '')
    {
        $("#" + pre_id + "frequency_required").html("REQUIRED").fadeOut(1600);
        invalid = true;
    }
    if ($("select#" + pre_id + "contactmode").val() == '')
    {
        $("#" + pre_id + "contactmode_required").html("REQUIRED").fadeOut(1600);
        invalid = true;
    }

    return invalid;
}

var checkForDupe = function(event, edit_flag) {
    var pre_id;
    edit_flag ? pre_id = "edit_" : pre_id = "";

    $("#" + pre_id + "dupeArea").html("");
    if ($("#" + pre_id + "recvcall").val() === "") return false;
    for (var x in fullContactList)
    {
        if (edit_flag)
        {
            if (fullContactList[x]['entry'] === contactToEdit['entry']) continue;
        }
        if (checkContactForDupe(fullContactList[x], generateNewContact(event, edit_flag), true))
        {
            var fullContact = _.findWhere(fullContactList, function(ct) { return ct['entry'] == fullContactList[x]['entry']; });
            $("#" + pre_id + "dupeArea").html(fullContactList[x]['recvcall'] + " IS A DUPLICATE! CONTACTED AT " + fullContact['contactdate']);
            if (!edit_flag)
                resetContactDisplay();
            return true;
        }
    }
    return false;
}

var checkPotentialDupes = function() {
    $("#dupeArea").html("");
    if ($("#recvcall").val() === "") return;
    for (var x in fullContactList)
    {
        if (checkContactForDupe(fullContactList[x], generateNewContact(event, false), false)) $("#dupeArea").html($("#dupeArea").html() + fullContactList[x]['recvcall'] + " ");
    }
}

var checkContactForDupe = function(contact1, contact2, fullCheck) {
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

var generateNewContact = function(event, edit_flag) {
    var pre_id;
    edit_flag ? pre_id = "edit_" : pre_id = "";

    var instance = _.findWhere(masterList, {
        contest_id: getCookie("contest_id")
    });
    if (contactToEdit)
        var entry_val = contactToEdit['entry'];
    else
        var entry_val = "";
    return {
        contest_id : instance["contest_id"],
        entry : entry_val,
        frequency : $("#" + pre_id + "frequency").val() || instance["band_cat"],
        contactmode : $("#" + pre_id + "contactmode").val() || instance["mode_cat"],
        sentcall : instance["callsign"],
        sentdata1 : $("#" + pre_id + "sentdata1").val() || instance["x_data1"],
        sentdata2 : $("#" + pre_id + "sentdata2").val() || instance["x_data2"],
        sentdata3 : $("#" + pre_id + "sentdata3").val() || instance["x_data3"],
        sentdata4 : $("#" + pre_id + "sentdata4").val() || instance["x_data4"],
        sentdata5 : $("#" + pre_id + "sentdata5").val() || instance["x_data5"],
        recvcall : $("#" + pre_id + "recvcall").val().toUpperCase() || $("#" + pre_id + "recvcall").val(),
        recvdata1 : $("#" + pre_id + "recvdata1").val(),
        recvdata2 : $("#" + pre_id + "recvdata2").val(),
        recvdata3 : $("#" + pre_id + "recvdata3").val(),
        recvdata4 : $("#" + pre_id + "recvdata4").val(),
        recvdata5 : $("#" + pre_id + "recvdata5").val()
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
    $(".modal").on('hide.bs.modal', function() { contactToEdit = {}; });
}

var initEditContact = function(entry) {
    contactToEdit = _.findWhere(fullContactList, {entry: entry});
    $("body").on("edit_frequencydone", function() {
        setSelectValue("edit_frequency", contactToEdit["frequency"]);
    });
    $("body").on("edit_contactmodedone", function() {
        setSelectValue("edit_contactmode", contactToEdit["contactmode"]);
    });

    initDataEntryDisplay(true);
    initFrequencyDisplay(true);
    initContactModeDisplay(true);
    initSelectSectionDisplay(true);
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
    if (!confirm("Are you sure you want to delete this contact?")) return;
    contactData = {entry: contactToEdit['entry']};
    $.ajax({
        type: "DELETE",
        url: "handlers/contact_data.php",
        data: { "contactData" : JSON.stringify(contactData) }
    });
    $(".modal").modal('hide');
    updateDisplay();
}

var editContact = function() {
    if (checkValidContact(true)) return;
    contactData = generateNewContact(event, true);
    $.ajax({
        type: "PUT",
        url: "handlers/contact_data.php",
        data: { "contactData" : JSON.stringify(contactData) }
    });
    $(".modal").modal('hide');
    updateDisplay();
}

var getContestList = function() {
    $.ajax({
        type: "GET",
        url: "handlers/contest_list.php",
        data: { "contest_list" : "all" },
        success: function(output) {
            contestList = $.parseJSON(output);
            $("body").trigger("clLoadDone");
        }
    });
}

var getDataType = function() {
    $.ajax({
        type: "GET",
        url: "handlers/data_type.php",
        data: { "data_type" : "all" },
        success: function(output) {
            dataTypeList = $.parseJSON(output);
        }
    });
}

var getMasterList = function(contest_name_id, force_reload) {
    if (masterList && !force_reload) {
        if (masterList['contest_name_id'] == contest_name_id) {
            return $("body").trigger("mlLoadDone");
        }
    }
    $.ajax({
        type: "GET",
        url: "handlers/master_list.php",
        data: { "id" : contest_name_id },
        success: function(output) {
            masterList = $.parseJSON(output);
            $("body").trigger("mlLoadDone");
        }
    });
}

var initSentData = function() {
    $(".modal-title").html("SET CONTEST DATA");
    $(".modal-body").load("views/sent_data.php", function() {
        $("#sentdataform").submit(function(event) {
            event.preventDefault();
            validateSentData();
        });
    });
    $(".modal").modal();
}

var loadContestName = function() {
    var contest_name_id = getCookie('contest_name_id');
    if (contest_name_id)
    {
        contest = _.findWhere(contestList, {contest_name_id: contest_name_id});
        if (contest)
        {
            $("#contestname").html("Contest: " + contest['contest_name']);
            return contestSelected(contest_name_id);
        }
    }
    displayContestList();
}

var contestSelected = function(contest_name_id) {
    $("#otherdata").html("");
    $("#contestparams").html("");
    $("#contestselect").html("");
    $("body").on("mlLoadDone", loadContestInstance);
    getMasterList(contest_name_id, false);
}

var loadContestInstance = function() {
    $("body").off("mlLoadDone", loadContestInstance);
    var contest_id = getCookie('contest_id');
    if (contest_id)
    {
        instance = _.findWhere(masterList, {contest_id: contest_id});
        if (instance)
        {
            $("#contestselect").html("Date: " + moment.utc(instance["contest_date"]).format("MMMM YYYY"));
            return instanceSelected(contest_id);
        }
    }
    displayInstanceList();
}

var displayContestList = function() {
    var s = "<option value=''>Select a Contest...</option>";
    for (var x in contestList)
    {
        s += "<option value='" + contestList[x]["contest_name_id"] + "'>" + contestList[x]["contest_name"] + "</option>";
    }
    s += "<option value='Custom'>Custom Contest...</option>";
    $("#contestname").html("<select id='contest_name' name='contest_name' onchange='contestSelected(this.value)'>" +
                            s + "</select><span id='contest_name_required'></span>");
}

var displayInstanceList = function() {
    var s = "<option value=''>Select New or Existing Contest from this list...</option>";
    for (var x in masterList) {
        if (moment(masterList[x]["contest_date"]).isValid()) {
            var d = moment.utc(masterList[x]["contest_date"]);
            s += "<option value='" + masterList[x]["contest_id"] + "'>" + d.format("MMMM YYYY") + "</option>";
        }
    }
    s += "<option value='-1'>New Contest</option>";
    $("#contestselect").html("<select id='contest_instance' name='contest_instance' onchange='instanceSelected(this.value)'>" + s + "</select><span id='contest_instance_required'></span>");
}

var instanceSelected = function(contest_id) {
    if (!contest_id) return;

    var contest_name_id = getCookie('contest_name_id');
    if (!contest_name_id)
        contest_name_id = $("#contest_name").val();
    var contest = _.findWhere(contestList, function(c) {
        return c['contest_name_id'] == contest_name_id;
    });
    if (!contest) return;

    var data_flags = ['assisted', 'band', 'mode', 'operator', 'power', 'station', 'time', 'transmitter', 'overlay'];

    var instance = _.findWhere(masterList, function(m) {
        return m['contest_id'] == contest_id;
    });

    var value = "";
    if (instance) value = instance['callsign'];
    else value = getCookie('username');
    $("#otherdata").html(htmlLongText('callsign', "Call Sign", value, true, "string") + "<br/>");
    value = "";
    for (var x = 1; x < 6; x++)
    {
        if (instance) value = instance['x_data' + x];
        var dataType = _.findWhere(dataTypeList, {
            data_type_id: contest['type_data' + x]
        });
        if (!dataType) continue;
        if (dataType['sent_data'] != 0) 
        {
            switch (dataType['data_type'])
            {
                case "string":
                    $("#otherdata").html($("#otherdata").html() + htmlLongText('x_data' + x, dataType['long_name'], value, true, "string"));
                    $("#otherdata").html($("#otherdata").html() + "<br/>");
                    break;
                case "number":
                    $("#otherdata").html($("#otherdata").html() + htmlLongText('x_data' + x, dataType['long_name'], value, true, "number"));
                    $("#otherdata").html($("#otherdata").html() + "<br/>");
                    break;
                case "enum":
                    $("#otherdata").html($("#otherdata").html() + "<div id='x_data" + x + "_container'></div>");
                    htmlLongEnum({htmlField: 'x_data' + x, label: dataType['long_name'], enumlist: [dataType['enum1'], dataType['enum2'], dataType['enum3']], value: value, omit: []});
                    $("#x_data" + x + "_required").html("");
                    break;
                case "special":
                    if (dataType['unique_name'] == "Precedent - ARRL November Sweepstakes")
                    {
                        $("#otherdata").html($("#otherdata").html() + htmlLongNovSSPrecedent(x));
                        $("#x_data" + x + " option[value='" + value + "']").attr("selected", "selected");
                    }
                    $("#otherdata").html($("#otherdata").html() + "<br/>");
                    $("#x_data" + x + "_required").html("");
                    break;
            }
        }
    }
    $("#contestparams").html("<br/>");
    for (var x = 0; x < data_flags.length; x++)
    {
        var data_title = data_flags[x].charAt(0).toUpperCase() + data_flags[x].slice(1);
        if (contest[data_flags[x] + '_flag'] == "Y")
        {
            if (instance) value = instance[data_flags[x] + "_cat"];
            $("#contestparams").html($("#contestparams").html() + "<div id='" + data_flags[x] + "_cat_container'></div>");
            htmlLongEnum({htmlField: data_flags[x] + '_cat', label: data_title + " Category", enumlist: [data_flags[x] + "_cat"], value: value, omit: []});
        }
    }
    if (contest['personal_flag'] == "Y")
    {
        $("#contestparams").html($("#contestparams").html() + "<div id='operators'></div>");
        if (instance) value = instance['operators'];
        $("#operators").html(htmlLongText('operators', "Operators", value, false, "string"));
        
        $("#contestparams").html($("#contestparams").html() + "<div id='club'></div>");
        if (instance) value = instance['club'];
        $("#club").html(htmlLongText('club', "Club", value, false, "string"));
        
        $("#contestparams").html($("#contestparams").html() + "<div id='name'></div>");
        if (instance) value = instance['name'];
        $("#name").html(htmlLongText('name', "Name", value, false, "string"));

        $("#contestparams").html($("#contestparams").html() + "<div id='address'></div>");
        if (instance) value = instance['address'];
        $("#address").html(htmlLongText('address', "Address", value, false, "string"));
        
        $("#contestparams").html($("#contestparams").html() + "<div id='addresscity'></div>");
        if (instance) value = instance['addresscity'];
        $("#addresscity").html(htmlLongText('addresscity', "City", value, false, "string"));
        
        $("#contestparams").html($("#contestparams").html() + "<div id='addressstate'></div>");
        if (instance) value = instance['addressstate'];
        $("#addressstate").html(htmlLongText('addressstate', "State", value, false, "string"));
        
        $("#contestparams").html($("#contestparams").html() + "<div id='addresszip'></div>");
        if (instance) value = instance['addresszip'];
        $("#addresszip").html(htmlLongText('addresszip', "Postal Code", value, false, "string"));
        
        $("#contestparams").html($("#contestparams").html() + "<div id='addresscountry'></div>");
        if (instance) value = instance['addresscountry'];
        $("#addresscountry").html(htmlLongText('addresscountry', "Country", value, false, "string"));
    }
}

var validateSentData = function() {
    // Front-end validate the data
    if ($("#contest_name").val() == '')
    {
        ($("#contest_name_required").html("REQUIRED").fadeOut(1600));
        return;
    }
    if ($("#contest_instance").val() == '')
    {
        ($("#contest_instance_required").html("REQUIRED").fadeOut(1600));
        return;
    }
    var contest_name = getCookie('contest_name_id');
    if (contest_name)
        var contest = _.findWhere(contestList, {contest_name_id: contest_name});
    else
        var contest = _.findWhere(contestList, {contest_name_id: $("#contest_name").val()});
    for (var x = 1; x < 6; x++)
    {
        var dataType = _.findWhere(dataTypeList, {data_type_id: contest["type_data" + x]});
        if (!dataType) continue;
        if (dataType["sent_data"] == 0) continue;
        switch (dataType["data_type"])
        {
            case "enum":
                if ($("select#x_data" + x).val() == '') {
                    ($("#x_data" + x + "_required").html("REQUIRED").fadeOut(1600));
                    return;
                }
                break;
            case "special":
                if (dataType['unique_name'] == "Precedent - ARRL November Sweepstakes") {
                    if ($("select#x_data" + x).val() == '') {
                        ($("#x_data" + x + "_required").html("REQUIRED").fadeOut(1600));
                        return;
                    }
                }
                break;
        }
    }
    // Now Contest Parameters
    // These will only display if they are required
    var fields = ["assisted_cat", "band_cat", "mode_cat", "operator_cat", "power", "station_cat", "time_cat", "transmitter_cat", "overlay_cat"];
    for (var x in fields)
    {
        if ($("#" + x).length == 0) continue;
        if ($("select#" + x).val() == '')
        {
            ($("#" + x + "_required").html("REQUIRED").fadeOut("slow"));
            return;
        }
    }
    $.ajax({
        type: "POST",
        url: "handlers/sent_data.php",
        data: $("#sentdataform").serialize(),
        success: function(output) {
            $("body").on("mlLoadDone", initContest);
            getMasterList(getCookie('contest_name_id'), true);
        }
    });
}
