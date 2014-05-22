function getCookie(cookie_name)
{
    var name = cookie_name + "=";
    var cookies_all = document.cookie.split(';');
    for(var i=0; i<cookies_all.length; i++) 
    {
        var c = cookies_all[i].trim();
        if (c.indexOf(name)==0) return unescape(c.substring(name.length,c.length));
    }
    return "";
}
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
