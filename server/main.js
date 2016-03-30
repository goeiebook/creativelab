console.log("running....");

run();

function run() {
    var externalIds = ["pnMGi5", "uJclLz", "9NAlAr", "qqYQg9", "8rbkNZ", "GJz4K2"];
    var loadedBoards = [];

    externalIds.forEach( function(externalId) {
        loadExternalBoard(externalId, function(id, board) {
            console.log("loaded:", id);
            loadedBoards.push(board);
            if (loadedBoards.length === externalIds.length) {
                allLoaded(loadedBoards);
            }
        });
    });
}

function jitter(tuple) {
    return [
        tuple[0],
        tuple[1] + Math.random()*5-2.5,
        tuple[2] + Math.random()*5-2.5
    ];
}

function allLoaded(boards) {
    console.log("all shapes loaded.");

    var shapes = [];
    for (var count=0; count<6; count++) {
        boards.forEach( function(board) {
            var board = boards[count%boards.length];
            var sampledShapes = _.sampleSize(board.shapes, 2); 
            shapes = shapes.concat(sampledShapes);
        });
    }

    shapes.forEach(function(shape) {
        shape.fillColor = tinycolor(shape.fillColor).setAlpha(0).toRgbString();
        shape.keyframes.forEach(function(keyframe) {
            keyframe.fillColor = tinycolor(keyframe.fillColor).setAlpha(0).toRgbString();
            keyframe.strokeColor = tinycolor("black").setAlpha(0.25).toRgbString();
            keyframe.strokeWidth = 2;
            keyframe.state.handleIn = keyframe.state.handleIn.map(jitter);
            keyframe.state.handleOut = keyframe.state.handleOut.map(jitter);
            keyframe.state.point = keyframe.state.point.map(jitter);
        });
    });
    
    _.shuffle(shapes);

    console.log("applying.");
    boardInterface.apply(shapes);
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
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", url, true); // true for asynchronous 
    xmlHttp.send(null);
}

