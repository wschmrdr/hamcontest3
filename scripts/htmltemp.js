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
        s += " pattern=/[\x20-\x7E]*/g";
    }
    s = s2 + "<input " + s + " />";
    return s;
}
function enumGather(htmlField, enumlist, listindex, s, value, omit) {
    if (!enumlist[listindex])
    {
        if (enumlist.length == listindex + 1)
        {
            $("#" + htmlField).html(s + "</select><span id='" + htmlField + "_required'></span>");
            return;
        }
        enumGather(htmlField, enumlist, listindex + 1, s, value, omit);
        return;
    }
    $.ajax({
        type: "GET",
        url: "handlers/enum_values.php",
        data: { "type": enumlist[listindex] },
        success: function(output) {
            var values = $.parseJSON(output);
            for (var y in values)
            {
                var optionvalue = values[y]['longname'];
                var displayvalue = values[y]['longname'];
                if (values[y]['shortname'])
                {
                    optionvalue = values[y]['shortname'];
                    displayvalue = values[y]['shortname'] + " - " + values[y]['longname'];
                }
                if (_.find(omit, function(v){ return v == optionvalue; }))
                    continue;
                if (value == optionvalue)
                    s += "<option value='" + optionvalue + "' selected='selected'>" + displayvalue + "</option>";
                else
                    s += "<option value='" + optionvalue + "'>" + displayvalue + "</option>";
            }
            if (enumlist.length == listindex + 1)
            {
                $("#" + htmlField).html(s + "</select><span id='" + htmlField + "_required'></span>");
                return;
            }
            enumGather(htmlField, enumlist, listindex + 1, s, value, omit);
            return;
        }
    });
}
function htmlLongEnum(htmlField, label, enumlist, value, omit) {
    var s = "<label for='" + htmlField + "'>" + label + "</label>";
    s +=    "<select id='" + htmlField + "' name='" + htmlField + "'>";
    s +=        "<option value=''>Select...</option>";
    enumGather(htmlField, enumlist, 0, s, value, omit);
}
function htmlLongNovSSPrecedent(dataNum) {
    var s = "<label for='data" + dataNum + "'>Precedent</label>";
    s +=    "<select id='data" + dataNum + "' name='data" + dataNum + "'>";
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
    s +=    "<span id='data" + dataNum + "_required'></span>";
    return s;
}
