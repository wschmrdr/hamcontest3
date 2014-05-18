function setCookie(cookie_name,cookie_value)
{
    var d = new Date();
    d.setTime(d.getTime()+(30*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cookie_name+"="+cookie_value+"; "+expires;
}

var getContestList = function() {
    $.ajax({
        type: "GET",
        url: "handlers/contest_list.php",
        data: { "contest_list" : "all" },
        success: function(output) {
            setCookie("contestList",output);
            displayContestList($.parseJSON(output));
        }
    });
}
var getDataType = function() {
    $.ajax({
        type: "GET",
        url: "handlers/data_type.php",
        data: { "data_type" : "all" },
        success: function(output) {
            setCookie("dataType",output);
        }
    });
}
var displayContestList = function(contestList) {
    var s = "<option value=''>Select a Contest...</option>";
    for (var x in contestList)
    {
        s += "<option value='" + contestList[x]["contest_name_id"] + "'>" + contestList[x]["contest_name"] + "</option>";
    }
    s += "<option value='Custom'>Custom Contest...</option>";
    $("#contestname").html("<select id='contest_name' name='contest_name' onchange='contestSelected(this.value)'>" +
                            s + "</select><span id='contest_name_required'></span>");
}

var contestSelected = function(contestId) {
    $("#otherdata").html("");
    $("#contestparams").html("");
    if (contestId && contestId != "Custom")
    {
        $.ajax({
            type: "GET",
            url: "handlers/master_list.php",
            data: { "id" : contestId },
            success: function(output) {
                setCookie("masterList", output);
                masterList = $.parseJSON(output);
                // Place the contents in a Drop-Down List
                var s = "<option value=''>Select New or Existing Contest from this list...</option>";
                for (var x in masterList)
                {
                    if (moment(masterList[x]["contest_date"]).isValid())
                    {
                        var d = moment.utc(masterList[x]["contest_date"]);
                        s += "<option value='" + masterList[x]["contest_id"] + "'>" + d.format("MMMM YYYY") + "</option>";
                    }
                }
                s += "<option value='-1'>New Contest</option>";
                $("#contestselect").html("<select id='contest_instance' name='contest_instance' onchange='instanceSelected(this.value)'>" + s + "</select><span id='contest_instance_required'></span>");
            }
        });
    }
    else
    {
        $("#contestselect").html("");
    }
}

$("document").ready( function() {
    // Upon login, we do not have any cookies set.
    if (!getCookie("dataType"))
        getDataType();
    if (!getCookie("contestList"))
        getContestList();
    // If this is called from the contact entry page, the cookies are set.
    // Perform processing according to our cookie settings.
    else
    {
    }

    $("#sentdataform").on('submit', function(event) {
        // Front-end validate the data
        if ($("#contest_name").val() == '')
        {
            ($("#contest_name_required").html("REQUIRED").fadeOut(1600));
            event.preventDefault();
            return;
        }
        if ($("#contest_instance").val() == '')
        {
            ($("#contest_instance_required").html("REQUIRED").fadeOut(1600));
            event.preventDefault();
            return;
        }
        var contestObject = getObject("contestList", $("#contest_name").val());
        for (var x = 1; x < 6; x++)
        {
            var dataType = getObject("dataType", contestObject["type_data" + x]);
            if (!dataType) continue;
            if (dataType["sent_data"] == 0) continue;
            switch (dataType["data_type"])
            {
                case "enum":
                    if ($("select#data" + x).val() == '')
                    {
                        ($("#data" + x + "_required").html("REQUIRED").fadeOut(1600));
                        event.preventDefault();
                    }
                    break;
                case "special":
                    if (dataType['unique_name'] == "Precedent - ARRL November Sweepstakes")
                        if ($("select#data" + x).val() == '')
                        {
                            ($("#data" + x + "_required").html("REQUIRED").fadeOut(1600));
                            event.preventDefault();
                        }
                    break;
            }
        }
        // Now Contest Parameters
        // These will only display if they are required
        for (var x = 10; x < 19; x++)
        {
            if ($("#data" + x).length == 0) continue;
            if ($("select#data" + x).val() == '')
            {
                ($("#data" + x + "_required").html("REQUIRED").fadeOut("slow"));
                event.preventDefault();
                return;
            }
        }
    });
});

var getObject = function(cookie_name, id) {
    var list = getCookie(cookie_name);
    if (!list) return null;
    list = $.parseJSON(list);
    var unique_id = "";
    switch (cookie_name)
    {
        case "contestList":
            unique_id = "contest_name_id";
            break;
        case "dataType":
            unique_id = "data_type_id";
            break;
        case "masterList":
            unique_id = "contest_id";
            break;
    }
    if (!unique_id) return null;
    for (var x in list)
    {
        if (list[x][unique_id] == id)
            return list[x];
    }
    return null;
}

var instanceSelected = function(contestInstanceId) {
    if (!contestInstanceId) return;
    var contest = getObject("contestList", $("#contest_name").val());
    if (!contest) return;
    if (contestInstanceId > 0)
        var instance = getObject("masterList", contestInstanceId);
    else var instance = null;
    var value = "";
    if (instance) value = instance['callsign'];
    else value = getCookie('username');
    $("#otherdata").html(htmlLongText('data0', "Call Sign", value, true, "string") + "<br/>");
    value = "";
    for (var x = 1; x < 6; x++)
    {
        if (instance) value = instance['x_data' + x];
        var dataType = getObject("dataType", contest['type_data' + x]);
        if (!dataType) continue;
        if (dataType['sent_data'] != 0) 
        {
            switch (dataType['data_type'])
            {
                case "string":
                    $("#otherdata").html($("#otherdata").html() + htmlLongText('data' + x, dataType['long_name'], value, true, "string"));
                    $("#otherdata").html($("#otherdata").html() + "<br/>");
                    break;
                case "number":
                    $("#otherdata").html($("#otherdata").html() + htmlLongText('data' + x, dataType['long_name'], value, true, "number"));
                    $("#otherdata").html($("#otherdata").html() + "<br/>");
                    break;
                case "enum":
                    $("#otherdata").html($("#otherdata").html() + "<div id='data" + x + "'></div>");
                    htmlLongEnum('data' + x, dataType['long_name'], [dataType['enum1'], dataType['enum2'], dataType['enum3']], value, []);
                    $("#data" + x + "_required").html("");
                    break;
                case "special":
                    if (dataType['unique_name'] == "Precedent - ARRL November Sweepstakes")
                    {
                        $("#otherdata").html($("#otherdata").html() + htmlLongNovSSPrecedent(x));
                        $("#data" + x + " option[value='" + value + "']").attr("selected", "selected");
                    }
                    $("#otherdata").html($("#otherdata").html() + "<br/>");
                    $("#data" + x + "_required").html("");
                    break;
            }
        }
    }
    $("#contestparams").html("<br/>");
    if (contest['assisted_flag'] == "Y")
    {
        if (instance) value = instance["assisted_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='data10'></div>");
        htmlLongEnum('data10', "Assisted Category", ["assisted_cat"], value, []);
        $("#data10_required").html("");
    }
    if (contest['band_flag'] == "Y")
    {
        if (instance) value = instance["band_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='data11'></div>");
        htmlLongEnum('data11', "Band Category", ["band_cat"], value, []);
        $("#data11_required").html("");
    }
    if (contest['mode_flag'] == "Y")
    {
        if (instance) value = instance["mode_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='data12'></div>");
        htmlLongEnum('data12', "Mode Category", ["mode_cat"], value, []);
        $("#data12_required").html("");
    }
    if (contest['operator_flag'] == "Y")
    {
        if (instance) value = instance["operator_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='data13'></div>");
        htmlLongEnum('data13', "Operator Category", ["operator_cat"], value, []);
        $("#data13_required").html("");
    }
    if (contest['power_flag'] == "Y")
    {
        if (instance) value = instance["power"];
        $("#contestparams").html($("#contestparams").html() + "<div id='data14'></div>");
        htmlLongEnum('data14', "Power Category", ["power"], value, []);
        $("#data14_required").html("");
    }
    if (contest['station_flag'] == "Y")
    {
        if (instance) value = instance["station_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='data15'></div>");
        htmlLongEnum('data15', "Station Category", ["station_cat"], value, []);
        $("#data15_required").html("");
    }
    if (contest['time_flag'] == "Y")
    {
        if (instance) value = instance["time_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='data16'></div>");
        htmlLongEnum('data16', "Time Category", ["time_cat"], value, []);
        $("#data16_required").html("");
    }
    if (contest['transmitter_flag'] == "Y")
    {
        if (instance) value = instance["transmitter_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='data17'></div>");
        htmlLongEnum('data17', "Transmitter Category", ["transmitter_cat"], value, []);
        $("#data17_required").html("");
    }
    if (contest['overlay_flag'] == "Y")
    {
        if (instance) value = instance["overlay_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='data18'></div>");
        htmlLongEnum('data18', "Overlay Category", ["overlay_cat"], value, []);
        $("#data18_required").html("");
    }
    if (contest['personal_flag'] == "Y")
    {
        $("#contestparams").html($("#contestparams").html() + "<div id='data20'></div>");
        if (instance) value = instance['operators'];
        $("#data20").html(htmlLongText('data20', "Operators", value, false, "string"));
        
        $("#contestparams").html($("#contestparams").html() + "<div id='data21'></div>");
        if (instance) value = instance['club'];
        $("#data21").html(htmlLongText('data21', "Club", value, false, "string"));
        
        $("#contestparams").html($("#contestparams").html() + "<div id='data22'></div>");
        if (instance) value = instance['name'];
        $("#data22").html(htmlLongText('data22', "Name", value, false, "string"));

        $("#contestparams").html($("#contestparams").html() + "<div id='data23'></div>");
        if (instance) value = instance['address'];
        $("#data23").html(htmlLongText('data23', "Address", value, false, "string"));
        
        $("#contestparams").html($("#contestparams").html() + "<div id='data24'></div>");
        if (instance) value = instance['addresscity'];
        $("#data24").html(htmlLongText('data24', "City", value, false, "string"));
        
        $("#contestparams").html($("#contestparams").html() + "<div id='data25'></div>");
        if (instance) value = instance['addressstate'];
        $("#data25").html(htmlLongText('data25', "State", value, false, "string"));
        
        $("#contestparams").html($("#contestparams").html() + "<div id='data26'></div>");
        if (instance) value = instance['addresszip'];
        $("#data26").html(htmlLongText('data26', "Postal Code", value, false, "string"));
        
        $("#contestparams").html($("#contestparams").html() + "<div id='data27'></div>");
        if (instance) value = instance['addresscountry'];
        $("#data27").html(htmlLongText('data27', "Country", value, false, "string"));
    }
}
