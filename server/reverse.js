run();

function run() {
    var externalId = "pnMGi5";

    loadExternalBoard(externalId, function(externalBoard) {
        var modifiedBoard = modifyBoard(externalBoard);
        var localBoard = getBoardState();
        localBoard.shapes = modifiedBoard.shapes;
        putBoardState(localBoard);
        board.setStageFromLocal();   
    });
}

function modifyBoard(board) {
    var grey = tinycolor("#444444").setAlpha(.50).toRgbString();

    board.shapes.forEach(function(shape) {
        shape.fillColor = tinycolor(shape.fillColor).setAlpha(0.10).toRgbString();
        shape.stroke = grey; 
        shape.strokeWidth = 1;
        shape.keyframes.forEach(function(keyframe) {
            keyframe.fillColor = tinycolor(keyframe.fillColor).setAlpha(0.10).toRgbString();
            keyframe.strokeColor = grey;
            keyframe.strokeWidth = 1;
        });
    });

    return board;
}

function loadExternalBoard(id, callback) {
    var regexp = /var shareData = {(.|\n)*};/; 
    var url = `https://www.creativelab5.com/s/${id}`; 
    httpGetAsync(url, function (responseText) {
        var match = regexp.exec(responseText);
        var shareDataString = match[0];
        eval(shareDataString);
        callback(id, shareData);
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
