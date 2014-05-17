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
