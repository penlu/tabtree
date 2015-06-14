var roots = getRoots();
var mydiv = document.getElementById("text");
var aTag = document.createElement("a'");
aTag.setAttribute("href","http://www.google.com");
aTag.innerHTML = "link text";
mydiv.appendChild(aTag);