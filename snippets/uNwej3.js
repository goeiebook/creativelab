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
    "shapes": genShapes(12,12)
}}

function genShapes(xcount, ycount) {
    var results = [];
    var dx = 1020/xcount;
    var dy = 1020/ycount;

    for (var y = -ycount/2; y <= ycount/2; y++) {
        for (var x = -xcount/2; x <= xcount/2; x++) {
            var shape = genShape({
                x:x*dx,
                y:y*dy,
                z:1,
                strokeWidth: 10,
                angle: Math.PI/5,
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
            "numSides": 4,
            "strokeColor": params.strokeColor,
            "strokeWidth": params.strokeWidth
        }
}

function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

function timeSeries() {
    var result = [];
    for (var time = 0; time <=540; time+=60) {
        result.push(time);
    }
    shuffle(result);
    return result;
}

function genKeyframes(params) {
    var results = [];
    var times = timeSeries();
    var taccum = 0;
    while (times.length > 0) {
        var time = times.shift();
        var t = taccum / 540;
        taccum += 60;
        results.push(genKeyframe({
            time:time,
            x: params.x,
            y: params.y,
            z: 0.25+params.z*t,
            angle: params.angle*t,
            strokeColor: params.strokeColor,
            strokeWidth: params.strokeWidth,
            fillColor: params.fillColor,
         }));
    }

    return results;
}

function genKeyframe(params) {
    var cx = params.x;
    var cy = params.y;

    var p1 = rotate(cx-50,cy-50, cx,cy, params.angle);
    var p2 = rotate(cx+50,cy-50, cx,cy, params.angle);
    var p3 = rotate(cx+50,cy+50, cx,cy, params.angle);
    var p4 = rotate(cx-50,cy+50, cx,cy, params.angle);
    
var result = {
    "ease": "easeInOutExpo",
    "fillColor": params.fillColor,
    "handlesMoved": true,
    "state": {
    "handleIn": [
        [
            "Point",
            0,
            0,
        ],
        [
            "Point",
            0,
            0,
        ],
        [
            "Point",
            0,
            0,
        ],
        [
            "Point",
            0,
            0,
        ]
    ],
    "handleOut": [
        [
            "Point",
            0,
            0,
        ],
        [
            "Point",
            0,
            0,
        ],
        [
            "Point",
            0,
            0,
        ],
        [
            "Point",
            0,
            0,
        ]
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
            p3.x/params.z + getCenterX(),
            p3.y/params.z + getCenterY(),
        ],
        [
            "Point",
            p4.x/params.z + getCenterX(),
            p4.y/params.z + getCenterY(),
        ]
    ]
    },

    "strokeColor": params.strokeColor,
    "strokeWidth": params.strokeWidth,
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
    var index = Math.floor(Math.random()*avail.length);
    return avail[index];
}

