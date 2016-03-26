/* This file should be loaded as a snippet in Google Chrome */

addScriptSrc("https://localhost:4443/tinycolor.js");
addScriptSrc("https://localhost:4443/Smooth-0.1.7.js");
addScriptSrc("https://localhost:4443/boardinterface.js");
addScriptSrc("https://localhost:4443/main.js");

function addScriptSrc(src) {
    var preexisting = 
        document.querySelector(`script[src^='${src}']`);
    
    if (preexisting) {
        console.log("remove preexisting", preexisting);
        document.head.removeChild(preexisting);
    }
    
    var script = document.createElement('script');
    script.src = `${src}?cacheBust=${Date.now()}`;
    script.async = false;
    document.head.appendChild(script);
}
