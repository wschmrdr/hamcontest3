function htmlLongText(dataNum, label, value, required, type) {
    var s2 = "<label for='" + dataNum + "'>" + label + "</label>";
    var s = "id='" + dataNum + "' type='text' name='" + dataNum + "' value='" + value + "'";
    if (required)
    {
        s += " required";
    }
    if (type == "number")
    {
        s += " pattern='[0-9]*'";
    }
    else if (type == "string")
    {
        s += ' pattern="[\x20-\x7E]*"';
    }
    s = s2 + "<input " + s + " />";
    return s;
}
function htmlTextArea(dataNum, label, value, required, type) {
    var s2 = "<label for='" + dataNum + "'>" + label + "</label>";
    var s = "id='" + dataNum + "' name='" + dataNum + "' cols=40 rows=5";
    if (required)
    {
        s += " required";
    }
    if (type == "string")
    {
        s += ' pattern="[\x20-\x7E]*"';
    }
    s = s2 + "<textarea " + s + ">" + value + "</textarea>";
    return s;
}
function htmlLongUpper(dataNum, label, value, required) {
    var s2 = "<label for='" + dataNum + "'>" + label + "</label>";
    var s = "id='" + dataNum + "' type='text' name='" + dataNum + "' value='" + value + "' style='text-transform:uppercase;' pattern='[\x20-\x7E]*'";
    if (required)
    {
        s += " required";
    }
    s = s2 + "<input " + s + " />";
    return s;
}
function enumCheckWrite(htmlField, enumlist, listindex, s) {
    if (enumlist.length == listindex + 1) {
        $("#" + htmlField + "_container").html(s + "</select><span id='" + htmlField + "_required'></span>");
        $("#" + htmlField + "_required").html("");
        $("body").trigger(htmlField + "done");
        return true;
    }
    return false;
}
function enumWrite(value, omit, obj) {
    var optionvalue = obj['longname'];
    var displayvalue = obj['longname'];
    if (obj['shortname'])
    {
        optionvalue = obj['shortname'];
        displayvalue = obj['shortname'] + " - " + obj['longname'];
    }
    if (_.find(omit, function(v){ return v == optionvalue; }))
        return "";
    if (value == optionvalue)
        return "<option value='" + optionvalue + "' selected='selected'>" + displayvalue + "</option>";
    else
        return "<option value='" + optionvalue + "'>" + displayvalue + "</option>";
}
function enumGather(htmlField, enumlist, listindex, s, value, omit) {
    if (!enumlist[listindex]) {
        if (!enumCheckWrite(htmlField, enumlist, listindex, s)) enumGather(htmlField, enumlist, listindex + 1, s, value, omit);
        return;
    }
    if (enumValues[enumlist[listindex]])
    {
        var values = enumValues[enumlist[listindex]];
        for (var y in values)
            s += enumWrite(value, omit, values[y]);
        if (enumCheckWrite(htmlField, enumlist, listindex, s)) return;
        else enumGather(htmlField, enumlist, listindex + 1, s, value, omit);
        return;
    }
    $.ajax({
        type: "GET",
        url: "handlers/enum_values.php",
        data: { "type": enumlist[listindex] },
        success: function(output) {
            var values = $.parseJSON(output);
            enumValues[enumlist[listindex]] = values;
            for (var y in values)
                s += enumWrite(value, omit, values[y]);
            if (enumCheckWrite(htmlField, enumlist, listindex, s)) return;
            else enumGather(htmlField, enumlist, listindex + 1, s, value, omit);
            return;
        }
    });
}
function htmlLongEnum(args) {
    var s = "<label for='" + args.htmlField + "'>" + args.label + "</label>";
    s +=    "<select id='" + args.htmlField + "' name='" + args.htmlField + "'>";
    s +=        "<option value=''>Select...</option>";
    enumGather(args.htmlField, args.enumlist, 0, s, args.value, args.omit);
}
function htmlLongNovSSPrecedent(dataNum) {
    var s = "<label for='x_data" + dataNum + "'>Precedent</label>";
    s +=    "<select id='x_data" + dataNum + "' name='x_data" + dataNum + "'>";
    s +=        "<option value=''>Select...</option>";
    s +=        "<option value='A'>A - Single-Op, Unassisted, Low Power</option>";
    s +=        "<option value='B'>B - Single-Op, Unassisted, High Power</option>";
    s +=        "<option value='Q'>Q - Single-Op, Unassisted, QRP</option>";
    s +=        "<option value='U'>U - Single-Op, Assisted, High Power</option>";
    s +=        "<option value='L'>U - Single-Op, Assisted, Low Power</option>";
    s +=        "<option value='M'>M - Multi-Op, Assisted, High Power</option>";
    s +=        "<option value='W'>M - Multi-Op, Assisted, Low Power</option>";
    s +=        "<option value='S'>S - School</option>";
    s +=    "</select>";
    s +=    "<span id='x_data" + dataNum + "_required'></span>";
    return s;
}
