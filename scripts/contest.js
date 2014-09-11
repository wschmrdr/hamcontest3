// GLOBAL VARIABLES NEEDED
var contactToEdit,
    fullContactList,
    masterList,
    contestList,
    dataTypeList,
    dupeList,
    enumValues = {},
    displayRefresh,
    recordNumberEntry = 0,
    sectionEntry = 0,
    dupe_found_flag = false,
    current_page = 1;

$(document).ready( function() {
    setTimeout("", 1);
    initSentData(false);
    getDataType();
    getContestList();

    $(document).on("clLoadDone", "body", loadContestName);

    $("a#sentdata").click(function() {
        if (displayRefresh) clearInterval(displayRefresh);
        initSentData(true);
        loadContestName();
    });
    $(".modal").on('click', ".edit-save", editContact);
    $(".modal").on('click', ".edit-dont-save", function() { contactToEdit = null; });
    $(".modal").on('click', ".edit-delete", deleteContact);
    $('body').on('click', '.edit-contact', selectContactEdit);
    $('body').on('change', '#frequency', function() { console.log("Frequency Select triggered."); });
    $('body').on('change', '#contactmode', updateUserCheckLine);
    $('body').on('change', '#sectSelect', function() { console.log("Section triggered."); });
    $('body').on("keyup", "#recvcall", checkPotentialDupes);
    $('body').on('focusout', '#recvcall', checkForDupe);
    $('body').on('click', '.page_change', changePage);
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
    $("#contestTitle").html("<h4 class='pull-left'>" + contest['contest_long_name'] + "</h4>");
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
    recordNumberEntry = 0;
    sectionEntry = 0;
    if (!$("#" + data_container).html())
    {
        var s = "";
        edit_flag ? null : s = "<form id='contactdataform' name='contactdataform' method='POST' action='' onsubmit='enterNewContact(event); return false;'>";
        var double_index = 0;
        s += htmlLongUpper(pre_id + 'recvcall', 'Call', "", true);
        $("#" + pre_id + "recvcall input").attr("tabindex", "1");
        s += "<br/>";
        for (var x = 1; x < 6; x++)
        {
            if (!contest['type_data' + x])
                continue;
            var dataType = _.findWhere(dataTypeList, {data_type_id: contest['type_data' + x]});
            if (!dataType) continue;
            if (dataType['long_name'] == 'Record Number')
                recordNumberEntry = x;
            if (dataType['long_name'].toLowerCase().match("section"))
                sectionEntry = x;
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
                    s += "<br/>";
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
                    s += "<br/>";
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
                    s += "<br/>";
                    break;
            }
        }
        edit_flag ? null : s += "<div class='pull-center'><input class='btn btn-primary' type='submit' name='contactdata' value='OK' /></div></form>";
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
            $("#" + data_container).html(htmlLongEnum({htmlField: data_container, label: 'Mode', enumlist: ["mode_cat"], value: "", omit: ['MIXED']}));
        }
    }
}

var initSelectSectionDisplay = function(edit_flag) {
    var contest = _.findWhere(contestList, {contest_name_id : getCookie('contest_name_id')});
    if (contest['sect_select_flag'] !== 'Y') return;
    if (sectionEntry <= 0) return;
    var dataType = _.findWhere(dataTypeList, {data_type_id : contest['type_data' + sectionEntry]});
    var data_container;
    edit_flag ? data_container = "edit_sectSelect" : data_container = "sectSelect";
    if (!$("#" + data_container).html())
    {
        $("#" + data_container).html(htmlLongEnum({htmlField: data_container, label: 'Sent Section', enumlist: [dataType['enum1']], value: "", omit: []}));
    }
}

var initContactTimeDisplay = function() {
    var contest = _.findWhere(contestList, {contest_name_id : getCookie('contest_name_id')});
    var data_container = "edit_contacttime_container";
    if (!$("#" + data_container).html())
    {
        $("#" + data_container).html("<label for='edit_contacttime'>Local Date/Time</label><input id='edit_contacttime' name='edit_Contacttime'/>");
        $("#edit_contacttime").on('focusin', function() {
            $("#edit_contacttime").datetimepicker({
                timeFormat: "HH:mm:ss",
                dateFormat: "yy-mm-dd",
            });
        });
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
    var s = "INFO TO SEND: ";
    for (var x = 1; x < 6; x++)
    {
        if (!contest['type_data' + x])
            continue;
        if (!callAdded && x > contest['call_loc'])
        {
            s += instance['callsign'] + " ";
            callAdded = true;
        }
        if (contest['type_data' + x])
        {
            var dataType = _.findWhere(dataTypeList, {data_type_id: contest['type_data' + x]});
            if (!dataType) continue;
            if (dataType['unique_name'] == "Precedent - ARRL November Sweepstakes")
                s += displayNovSSPrecedent(instance['x_data' + x]) + " ";
            else if (dataType['unique_name'] == "Signal Report")
                if ($("#contactmode").val() == "PH")
                    s += "[RS] ";
                else if ($("#contactmode").val() == "CW" || $("#contactmode").val() == "RY")
                    s += "[RST] ";
                else
                    s += " ";
            else
                s += instance['x_data' + x] + " ";
        }
    }
    $("#checkLine").html(s);
}

function updateContactListDisplay() {
    $("#contactArea").html("<table id='contactList' name='contactList' class='contact-area'><thead></thead><tbody></tbody></table>");
    var contact_headers = ['', 'Freq', 'Mode', 'Time', 'Call'];
    var contest = _.findWhere(contestList, {contest_name_id : getCookie('contest_name_id')});
    for (var x = 1; x <= 5; x++)
    {
        var dataType = _.findWhere(dataTypeList, {data_type_id: contest['type_data' + x]});
        if (!dataType) continue;
        var s = dataType['short_name'];
        contact_headers.push(dataType['short_name']);
    }
    var s = "<tr class='contact-area'>";
    for (var i in contact_headers)
        s += "<th class='contact-area-header'>" + contact_headers[i] + "</th>";
    s += "</tr>";
    $("#contactList thead").append(s);

    var contactList = [];
    for (var x = (current_page - 1) * 5; x < fullContactList.length && x < current_page * 5; x++)
    {
        dupeList = ['recvcall'];
        if (contest['freq_dupe_flag'] == "Y") dupeList.push('frequency');
        if (contest['mode_dupe_flag'] == "Y") dupeList.push('contactmode');
        var contact_string = "<tr class='contact-area'><td class='contact-area'><button type='button' id='" + fullContactList[x]["entry"] + "' class='btn btn-xs btn-warning glyphicon glyphicon-edit edit-contact'></button></td>";
        contact_string += "<td class='contact-area'>" + fullContactList[x]['frequency'] + "</td><td class='contact-area'>"
                        + fullContactList[x]['contactmode'] + "</td><td class='contact-area'>"
                        + moment(fullContactList[x]['contactdate']).utc().format("HHmm") + "</td><td class='contact-area'>"
                        + fullContactList[x]['recvcall'] + "</td>";
        for (var y = 1; y <= 5; y++)
        {
            var dataType = _.findWhere(dataTypeList, {
                data_type_id: contest['type_data' + y]
            });
            if (dataType)
            {
                var s = fullContactList[x]['recvdata' + y];
                contact_string += "<td class='contact-area'>" + s + "</td>";
                if (contestList['data' + y + '_dupe_flag'] == "Y")
                    dupeList.push('recvdata' + y);
            }
        }
        $("#contactList tbody").append(contact_string);
    }
    var paginate_string = "<ul class='pagination'><li id='page_back'><a href='#' id='back' class='page_change'>&laquo;</a></li>";
    for (var x = 1; x <= Math.ceil(fullContactList.length / 5); x++)
    {
        paginate_string += "<li id='page" + x + "'><a href='#' id='" + x + "' class='page_change'>" + x + "</a></li>";
    }
    paginate_string += "<li id='page_fore'><a href='#' id='fore' class='page_change'>&raquo;</a></li></ul>";
    $("#contactArea").html($("#contactArea").html() + paginate_string);
    $("li#page" + current_page).addClass("active");
    switch (current_page)
    {
        case 1:
            $("li#page_back").addClass("disabled");
            break;
        case Math.ceil(fullContactList.length / 5):
            $("li#page_fore").addClass("disabled");
            break;
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

    if (sectionEntry > 0)
    {
        var enum1, enum2, enum3, check;
        var unique = {};
        var distinct = [];
        var dataType = _.findWhere(dataTypeList, { data_type_id: contest['type_data' + sectionEntry] });
        enum1 = enumValues[dataType['enum1']];
        dataType['enum2'] ? enum2 = enumValues[dataType['enum2']] : enum2 = [];
        dataType['enum3'] ? enum3 = enumValues[dataType['enum3']] : enum3 = [];
        if (_.findWhere(enum1, { shortname : instance['x_data' + sectionEntry] })) check = 1;
        else if (_.findWhere(enum2, { shortname : instance['x_data' + sectionEntry] })) check = 2;
        else check = 3;

        for (var i in fullContactList)
        {
            _ref1 = fullContactList[i];
            if (_.findWhere(enum1, {shortname : _ref1['recvdata' + sectionEntry]}))
            {
                if (typeof(unique[_ref1['recvdata' + sectionEntry]]) == "undefined")
                    distinct.push(_ref1['recvdata' + sectionEntry]);
            }
            else if (check == 1 && _.findWhere(enum2, { shortname : _ref1['recvdata' + sectionEntry] }))
            {
                if (typeof(unique[_ref1['recvdata' + sectionEntry]]) == "undefined")
                    distinct.push(_ref1['recvdata' + sectionEntry]);
            }
            unique[_ref1['recvdata' + sectionEntry]] = 0;
        }
        $("#score").html("<table class='score-display'><tr><td class='score-display pull-left'>Total Contacts: " + fullContactList.length + "</td><td class='score-display pull-center'>Total Score: " + score.constant + "</td><td class='score-display pull-right'>Total Sections: " + distinct.length + "</td></tr></table>");
    }
    else
        $("#score").html("<table class='score-display'><tr><td class='score-display'>Total Contacts: " + fullContactList.length + "</td><td class='score-display'>Total Score: " + score.constant + "</td></tr></table>");

    var score_to_DB = { "claimed_score" : score.constant };
    $.ajax({
        type: "PUT",
        url: "handlers/master_list.php",
        data: { "masterList" : JSON.stringify(score_to_DB) }
    });
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
                    var contest = _.findWhere(contestList, {contest_name_id : getCookie('contest_name_id')});
                    var instance = _.findWhere(masterList, {contest_id : getCookie('contest_id')});
                    var dataType = _.findWhere(dataTypeList, { data_type_id: contest['type_data' + formula[iter]] });
                    var enum1, enum2, enum3, check;
                    var unique = {};
                    var distinct = [];

                    if (dataType['data_type'] == 'enum')
                    {
                        enum1 = enumValues[dataType['enum1']];
                        dataType['enum2'] ? enum2 = enumValues[dataType['enum2']] : enum2 = [];
                        dataType['enum3'] ? enum3 = enumValues[dataType['enum3']] : enum3 = [];
                        if (_.findWhere(enum1, { shortname : instance['x_data' + formula[iter]] })) check = 1;
                        else if (_.findWhere(enum2, { shortname : instance['x_data' + formula[iter]] })) check = 2;
                        else check = 3;
                    }

                    for ( var i in fullContactList )
                    {
                        if (dataType['data_type'] != 'enum')
                        {
                            if ( typeof(unique[fullContactList[i]['recvdata' + formula[iter]]]) == "undefined")
                                distinct.push(fullContactList[i]['recvdata' + formula[iter]]);
                        }
                        else if (_.findWhere(enum1, { shortname : fullContactList[i]['recvdata' + formula[iter]] }))
                        {
                            if ( typeof(unique[fullContactList[i]['recvdata' + formula[iter]]]) == "undefined")
                                distinct.push(fullContactList[i]['recvdata' + formula[iter]]);
                        }
                        else if (check == 1 && _.findWhere(enum2, { shortname : fullContactList[i]['recvdata' + formula[iter]] }))
                        {
                            if ( typeof(unique[fullContactList[i]['recvdata' + formula[iter]]]) == "undefined")
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

var changePage = function(event) {
    event.preventDefault();
    switch (event.currentTarget.id)
    {
        case 'back':
            current_page--;
            break;
        case 'fore':
            current_page++;
            break;
        default:
            current_page = parseInt(event.currentTarget.id);
    }
    updateContactListDisplay();
}

var enterNewContact = function(event) {
    event.preventDefault();
    // Check for Valid Contact
    if (checkValidContact(event, false)) return;
    // Add Contact
    contactData = generateNewContact(event, false);
    $.ajax({
        type: "POST",
        url: "handlers/contact_data.php",
        data: { "contactData" : JSON.stringify(contactData) },
        success: function(output) {
            if (recordNumberEntry > 0)
            {
                instance = _.findWhere(masterList, {contest_id: getCookie('contest_id')});
                instance['x_data' + recordNumberEntry] = parseInt(instance['x_data' + recordNumberEntry]) + 1;
            }
            resetContactDisplay();
        }
    });
}

var checkValidContact = function(event, edit_flag) {
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
    if ($("select#" + pre_id + "sectSelect").val() == '')
    {
        $("#" + pre_id + "sectSelect_required").html("REQUIRED").fadeOut(1600);
        invalid = true;
    }

    return invalid;
}

var checkForDupe = function(event, edit_flag) {
    var pre_id;
    edit_flag ? pre_id = "edit_" : pre_id = "";

    $("#" + pre_id + "dupeArea").html("");
    if ($("#" + pre_id + "dupeArea").hasClass("dupe-found"))
        $("#" + pre_id + "dupeArea").removeClass("dupe-found");
    if ($("#" + pre_id + "recvcall").val() === "") return false;
    for (var x in fullContactList)
    {
        if (edit_flag)
        {
            if (fullContactList[x]['entry'] === contactToEdit['entry']) continue;
        }
        if (checkContactForDupe(fullContactList[x], generateNewContact(event, edit_flag), true))
        {
            dupe_found_flag = true;
            var fullContact = _.findWhere(fullContactList, function(ct) { return ct['entry'] == fullContactList[x]['entry']; });
            $("#" + pre_id + "dupeArea").html(fullContactList[x]['recvcall'] + " IS A DUPLICATE! CONTACTED AT " + fullContact['contactdate']);
            $("#" + pre_id + "dupeArea").addClass("dupe-found");
            if (!edit_flag)
                resetContactDisplay();
            return true;
        }
    }
    return false;
}

var checkPotentialDupes = function(event) {
    if (dupe_found_flag == true)
    {
        dupe_found_flag = false;
        return;
    }
    if ($("#dupeArea").hasClass("dupe-found"))
        $("#dupeArea").removeClass("dupe-found");
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

    var contest = _.findWhere(contestList, {
        contest_name_id : getCookie('contest_name_id')
    });
    var instance = _.findWhere(masterList, {
        contest_id: getCookie("contest_id")
    });
    if (contactToEdit)
        var entry_val = contactToEdit['entry'];
    else
        var entry_val = "";
    var contact_gen = {
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
    if (edit_flag)
        contact_gen['contactdate'] = moment.utc($("#edit_contacttime").val()).format("YYYY-MM-DD HH:mm:ss");
    if (sectionEntry > 0 && contest['sect_select_flag'] == 'Y')
        contact_gen['sentdata' + sectionEntry] = $("#sectSelect").val();
    return contact_gen;
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
    var contest = _.findWhere(contestList, {contest_name_id: getCookie('contest_name_id')});
    $("#recvcall").focus();
}

var selectContactEdit = function(e) {
    $(".modal-title").html("EDIT CONTACT");
    $(".modal-body").load("views/edit_contact.php", function() {
        setTimeout(initEditContact(e.currentTarget.id), 1);
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
    $("body").on("edit_sectSelectdone", function() {
        setSelectValue("edit_sectSelect", contactToEdit["sentdata" + sectionEntry]);
    });

    initDataEntryDisplay(true);
    initFrequencyDisplay(true);
    initContactModeDisplay(true);
    initSelectSectionDisplay(true);
    initContactTimeDisplay();
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
    $("#edit_contacttime").val(contactToEdit["contactdate"]);
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
    var contactData = {entry: contactToEdit['entry']};
    if (recordNumberEntry > 0)
    {
        var maxContact = _.max(fullContactList, function(con) {
            return con['sentdata' + recordNumberEntry];
        });
    }
    $.ajax({
        type: "DELETE",
        url: "handlers/contact_data.php",
        data: { "contactData" : JSON.stringify(contactData) },
        success: function(output) {
            if (recordNumberEntry > 0)
            {
                if (contactToEdit['sentdata' + recordNumberEntry] === maxContact['sentdata' + recordNumberEntry])
                {
                    instance = _.findWhere(masterList, {contest_id: getCookie('contest_id')});
                    instance['x_data' + recordNumberEntry] = maxContact['sentdata' + recordNumberEntry];
                }
            }
            $(".modal").modal('hide');
            updateDisplay();
        }
    });
}

var editContact = function(event) {
    if (checkValidContact(event, true)) return;
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

var initSentData = function(edit_flag) {
    $(".modal-title").html("SET CONTEST DATA");
    $(".modal-body").load("views/sent_data.php", function() {
        $("#sentdataform").submit(function(event) {
            event.preventDefault();
            validateSentData();
        });
        if (edit_flag) loadContestName();
    });
    $(".modal").modal();
    $(".modal").on('hide.bs.modal', function() {
        $(".modal").off('hide.bs.modal');
        if (getCookie('contest_id') && getCookie('contest_name_id'))
            displayRefresh = setInterval(updateDisplay, 60000);
    });
}

var loadContestName = function() {
    var contest_name_id = getCookie('contest_name_id');
    if (contest_name_id)
    {
        var contest = _.findWhere(contestList, {contest_name_id: contest_name_id});
        if (contest)
        {
            $("#contestname").html("<label for='contest_name'>Contest:</label><input id='contest_name' type='hidden' name='contest_name' value='" + contest['contest_name_id'] + "'/><span class='static-sent'>" + contest['contest_name'] + "</span>");
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
            $("#contestselect").html("<label for='contest_instance'>Date:</label><input id='contest_instance' type='hidden' name='contest_instance' value='" + instance['contest_id'] + "'/><span class='static-sent'>" + moment.utc(instance["contest_date"]).format("MMMM YYYY") + "</span>");
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
    $("#contestname").html("<label for='contest_name'>Contest Name</label><select id='contest_name' name='contest_name' onchange='contestSelected(this.value)'>" +
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
    $("#contestselect").html("<label for='contest_instance'>Contest</label><select id='contest_instance' name='contest_instance' onchange='instanceSelected(this.value)'>" + s + "</select><span id='contest_instance_required'></span>");
}

var instanceSelected = function(contest_id) {
    if (!contest_id) return;

    var contest_name_id = getCookie('contest_name_id');
    if (!contest_name_id)
        contest_name_id = $("#contest_name").val();
    var contest = _.findWhere(contestList, {
        contest_name_id: contest_name_id
    });
    if (!contest) return;

    var data_flags = ['assisted', 'band', 'mode', 'operator', 'power', 'station', 'time', 'transmitter', 'overlay'];

    var instance = _.findWhere(masterList, function(m) {
        contest_id: contest_id
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
        if (contest[data_flags[x] + '_flag'] === "Y" || contest[data_flags[x] + '_flag'] === "B")
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

        $("#contestparams").html($("#contestparams").html() + "<div id='soapbox'></div>");
        if (instance) value = instance['soapbox'];
        $("#soapbox").html(htmlTextArea('soapbox', "Soapbox", value, false, "string"));
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
    var fields = ["assisted_cat", "band_cat", "mode_cat", "operator_cat", "power_cat", "station_cat", "time_cat", "transmitter_cat", "overlay_cat"];
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
