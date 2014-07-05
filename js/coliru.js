function coliru(src, f) {
    var http = new XMLHttpRequest();
    http.open("POST", "http://coliru.stacked-crooked.com/compile", false);
	http.onreadystatechange = function() {
        f(http.response.replace("'x86_64' is not a recognized processor for this target (ignoring processor)", "").trim());
	}
    http.send(JSON.stringify({ "cmd": "/usr/local/bin/Wide/CLI main.cpp && g++ a.o && ./a.out", "src": src }));
}
// http://stackoverflow.com/questions/5251520/how-do-i-escape-some-html-in-javascript
function escapeHTML( string )
{
    var pre = document.createElement('pre');
    var text = document.createTextNode( string );
    pre.appendChild(text);
    return pre.innerHTML;
}