/* Run this as a javascript snippet in Chrome Dev Console. */

/* This will load https://www.creativelab5.com/s/FnMYfI */
run('FnMYfI');

function run(externalId) {
    loadExternalBoard(externalId, function(externalBoard) {
        var importedShapes = extractShapes(externalBoard);
        
        var localBoard = getBoardState();
        localBoard.shapes = importedShapes;
        putBoardState(localBoard);
        board.setStageFromLocal();   
    });
}

function extractShapes(board) {
    var strokeColor = "rgba(100,100,100,0.50)";
    var fillColor = "rgba(100,100,100,0.01)";

    board.shapes.forEach(function(shape) {
        shape.fillColor = fillColor;
        shape.strokeColor = strokeColor; 
        shape.strokeWidth = 1;

        shape.keyframes.forEach(function(keyframe) {
            keyframe.fillColor = fillColor;
            keyframe.strokeColor = strokeColor;
            keyframe.strokeWidth = 1;
        });
    });

    return board.shapes;
}

function loadExternalBoard(id, callback) {
    var regexp = /var shareData = {(.|\n)*};/; 
    var url = `https://www.creativelab5.com/s/${id}`; 
    httpGetAsync(url, function (responseText) {
        var match = regexp.exec(responseText);
        var shareDataString = match[0];
        eval(shareDataString);
        callback(shareData);
    });
}

function httpGetAsync(url, callback)
{
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(xmlHttp.responseText);
        }
    }

    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

function getBoardState() {
    return JSON.parse(
        window.localStorage.getItem("boardStates"));
}

function putBoardState(state) {
    window.localStorage.setItem("boardStates",
        JSON.stringify(state));
}
