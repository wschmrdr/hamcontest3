function htmlLongText(dataNum, label, value, required, type) {
    var s2 = "<label for='data" + dataNum + "'>" + label + "</label>";
    var s = "id='data" + dataNum + "' type='text' name='data" + dataNum + "' value='" + value + "'";
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
function enumGather(dataNum, enumlist, listindex, s, value) {
    if (!enumlist[listindex])
    {
        if (enumlist.length == listindex + 1)
        {
            $("#data" + dataNum).html(s + "</select><span id='data" + dataNum + "_required'></span>");
            return;
        }
        enumGather(dataNum, enumlist, listindex + 1, s, value);
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
                if (values[y]['shortname'])
                {
                    if (value == values[y]['shortname'])
                    {
                        s += "<option value='" + values[y]['shortname'] + "' selected='selected'>";
                    }
                    else
                    {
                        s += "<option value='" + values[y]['shortname'] + "'>";
                    }
                    s += values[y]['shortname'] + " - " + values[y]['longname'];
                }
                else
                {
                    if (value == values[y]['longname'])
                    {
                        s += "<option value='" + values[y]['longname'] + "' selected='selected'>";
                    }
                    else
                    {
                        s += "<option value='" + values[y]['longname'] + "'>";
                    }
                    s += values[y]['longname'];
                }
                s += "</option>";
            }
            if (enumlist.length == listindex + 1)
            {
                $("#data" + dataNum).html(s + "</select><span id='data" + dataNum + "_required'></span>");
                return;
            }
            enumGather(dataNum, enumlist, listindex + 1, s, value);
            return;
        }
    });
}
function htmlLongEnum(dataNum, label, enumlist, value) {
    var s = "<label for='data" + dataNum + "'>" + label + "</label>";
    s +=    "<select id='data" + dataNum + "' name='data" + dataNum + "'>";
    s +=        "<option value=''>Select...</option>";
    enumGather(dataNum, enumlist, 0, s, value);
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
