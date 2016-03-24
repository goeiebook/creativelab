var boardStates = JSON.stringify(generateBoardState());
window.localStorage.setItem("boardStates", boardStates);

var CENTER_X = 1020/2;
var CENTER_Y = 730/2;

function getCenterX() {
    return 1020/2;
}

function getCenterY() {
    return 730/2;
}

function generateBoardState() { return {
    "globalEndTime": 10,
    "lastGlobalTime": 1,
    "originalSize": [
        1020,
        730
    ],
    "quill": {
        "keyFrames": [
            {
                "editorX": 150,
                "editorY": 429,
                "handleX": 410,
                "handleY": 405,
                "text": "<div><br></div>",
                "timeMarker": 0,
                "viewHeight": 730,
                "viewWidth": 832
            },
            {
                "editorX": 150,
                "editorY": 429,
                "handleX": 410,
                "handleY": 405,
                "text": "<div><br></div>",
                "timeMarker": 60,
                "viewHeight": 730,
                "viewWidth": 832
            }
        ]
    },
    "shapes": genShapes(10,10)
}}

function genShapes(xcount, ycount) {
    var results = [];
    var dx = 1020 / xcount;
    var dy = 730 / ycount;
    for (var y = 0; y < ycount; y++) {
        for( var x = 0; x < xcount; x++) {
            var shape = genShape({
                x:x*dx - getCenterX(),
                y:y*dy - getCenterY(),
                z:10,
                size: 10,
                fillColor: getRandomColor(),
                strokeColor: "#444444"
                });
            results.push(shape);
        }
    }
    
    return results;
}

function genShape(params) {
  
    return {
            "break": false,
            "duped": false,
            "fillColor": params.fillColor,
            "hierarchyIndex": null,
            "keyframes": genKeyframes(params),
            "numSides": 2,
            "strokeColor": params.strokeColor,
            "strokeWidth": params.size
        }
}


function genKeyframes(params) {
    var results = [];
    for (var time = 0; time <=540; time+=60) {
        var t = time / 540;
        results.push(genKeyframe({
            time:time,
            x: params.x,
            y: params.y,
            z: 0.5+Math.sin(10*(t*Math.PI)),
            angle: Math.random()*Math.PI*2,
            strokeColor: params.strokeColor,
            fillColor: params.fillColor,
            }))
    }

    return results;
}

function genKeyframe(params) {
    var cx = params.x;
    var cy = params.y;

    var p1 = rotate(cx,cy-10, cx,cy, params.angle);
    var p2 = rotate(cx,cy+10, cx,cy, params.angle);
    
var result =                 {
                    "ease": "easeInOutExpo",
                    "fillColor": params.fillColor,
                    "handlesMoved": true,
                    "state": {
                        "handleIn": [
                            [
                                "Point",
                                (p1.x+p2.x)/2/params.z,
                                (p1.y+p2.y)/2/params.z,
                            ],
                            [
                                "Point",
                                -(p2.x+p2.x)/2/params.z,
                                -(p2.y+p2.y)/2/params.z,
                            ]
                        ],
                        "handleOut": [
                            [
                                "Point",
                               -(p2.x+p2.x)/2/params.z,
                                -(p2.y+p2.y)/2/params.z,
                            ],
                             [
                                "Point",
                                (p1.x+p2.x)/2/params.z,
                                (p1.y+p2.y)/2/params.z,
                            ],
                        ],
                        "point": [
                            [
                                "Point",
                                p1.x/params.z + getCenterX(),
                                p1.y/params.z + getCenterY(),
                            ],
                            [
                                "Point",
                                p2.x/params.z + getCenterX(),
                                p2.y/params.z + getCenterY(),
                            ],
                            [
                                "Point",
                                p1.x/params.z + getCenterX(),
                                p1.y/params.z + getCenterY(),
                            ]
                        ]
                    },
                    "strokeColor": params.strokeColor,
                    "strokeWidth": params.size,
                    "time": params.time
                }
             return result;

}

function rotate(x, y, cx, cy, theta) {

    return {
        x: cx + (x-cx)*Math.cos(theta) - (y-cy)*Math.sin(theta),
        y: cy + (x-cx)*Math.sin(theta) + (y-cy)*Math.cos(theta),
    }
}

function getRandomColor() {
    var avail = ["#4285F4", "#EA4235", "#FBBC05", "#34A853"];
    //var avail = ["#4285F4", "#34A853"];
    var index = Math.floor(Math.random()*avail.length);
    return avail[index];
}

