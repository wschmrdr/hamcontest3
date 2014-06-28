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
                    if ($("select#x_data" + x).val() == '')
                    {
                        ($("#x_data" + x + "_required").html("REQUIRED").fadeOut(1600));
                        event.preventDefault();
                    }
                    break;
                case "special":
                    if (dataType['unique_name'] == "Precedent - ARRL November Sweepstakes")
                        if ($("select#x_data" + x).val() == '')
                        {
                            ($("#x_data" + x + "_required").html("REQUIRED").fadeOut(1600));
                            event.preventDefault();
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
                event.preventDefault();
                return;
            }
        }
    });
});

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
    $("#otherdata").html(htmlLongText('callsign', "Call Sign", value, true, "string") + "<br/>");
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
                    $("#otherdata").html($("#otherdata").html() + htmlLongText('x_data' + x, dataType['long_name'], value, true, "string"));
                    $("#otherdata").html($("#otherdata").html() + "<br/>");
                    break;
                case "number":
                    $("#otherdata").html($("#otherdata").html() + htmlLongText('x_data' + x, dataType['long_name'], value, true, "number"));
                    $("#otherdata").html($("#otherdata").html() + "<br/>");
                    break;
                case "enum":
                    $("#otherdata").html($("#otherdata").html() + "<div id='x_data" + x + "'></div>");
                    htmlLongEnum('x_data' + x, dataType['long_name'], [dataType['enum1'], dataType['enum2'], dataType['enum3']], value, []);
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
    if (contest['assisted_flag'] == "Y")
    {
        if (instance) value = instance["assisted_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='assisted_cat'></div>");
        htmlLongEnum('assisted_cat', "Assisted Category", ["assisted_cat"], value, []);
        $("#assisted_cat_required").html("");
    }
    if (contest['band_flag'] == "Y")
    {
        if (instance) value = instance["band_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='band_cat'></div>");
        htmlLongEnum('band_cat', "Band Category", ["band_cat"], value, []);
        $("#band_cat_required").html("");
    }
    if (contest['mode_flag'] == "Y")
    {
        if (instance) value = instance["mode_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='mode_cat'></div>");
        htmlLongEnum('mode_cat', "Mode Category", ["mode_cat"], value, []);
        $("#mode_cat_required").html("");
    }
    if (contest['operator_flag'] == "Y")
    {
        if (instance) value = instance["operator_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='operator_cat'></div>");
        htmlLongEnum('operator_cat', "Operator Category", ["operator_cat"], value, []);
        $("#operator_cat_required").html("");
    }
    if (contest['power_flag'] == "Y")
    {
        if (instance) value = instance["power"];
        $("#contestparams").html($("#contestparams").html() + "<div id='power'></div>");
        htmlLongEnum('power', "Power Category", ["power"], value, []);
        $("#power_required").html("");
    }
    if (contest['station_flag'] == "Y")
    {
        if (instance) value = instance["station_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='station_cat'></div>");
        htmlLongEnum('station_cat', "Station Category", ["station_cat"], value, []);
        $("#station_cat_required").html("");
    }
    if (contest['time_flag'] == "Y")
    {
        if (instance) value = instance["time_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='time_cat'></div>");
        htmlLongEnum('time_cat', "Time Category", ["time_cat"], value, []);
        $("#time_cat_required").html("");
    }
    if (contest['transmitter_flag'] == "Y")
    {
        if (instance) value = instance["transmitter_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='transmitter_cat'></div>");
        htmlLongEnum('transmitter_cat', "Transmitter Category", ["transmitter_cat"], value, []);
        $("#transmitter_cat_required").html("");
    }
    if (contest['overlay_flag'] == "Y")
    {
        if (instance) value = instance["overlay_cat"];
        $("#contestparams").html($("#contestparams").html() + "<div id='overlay_cat'></div>");
        htmlLongEnum('overlay_cat', "Overlay Category", ["overlay_cat"], value, []);
        $("#overlay_cat_required").html("");
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
