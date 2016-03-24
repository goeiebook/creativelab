var boardState = getBoardState();
console.log(boardState.shapes[0]);
addShapes(boardState);
console.log(boardState.shapes[0]);
putBoardState(boardState);
putTimestamp(0);

function getBoardState() {
    return JSON.parse(
        window.localStorage.getItem("boardStates"));
}

function putBoardState(state) {
    window.localStorage.setItem("boardStates",
        JSON.stringify(state));
}

function putTimestamp(t) {
    window.localStorage.setItem('timestamp', t);
}

function getCenterX() {
    return 1020/2;
}

function getCenterY() {
    return 730/2;
}

function addShapes(state) {
    var set_a = genShapes(1,15);
    var set_b = genTop(1,15);
    state.shapes = [].concat(set_a, set_b);
}

function bump_interpolate(v, max, scale) {
    return scale*(1-Math.sin(v/max*Math.PI))   
}

function genTop(xcount, ycount) {
    var results = [];
    var dx = 1020/xcount;
    var dy = 25;

    for (var y = 0; y < ycount; y++) {
        for (var x = 0; x < xcount; x++) {
            var color = tinycolor(getScaledColor(y));
            //color.desaturate(100*y/ycount);
            //color.desaturate(100);
            color.setAlpha(y/ycount);
            var shape = genShape({
                x:x*dx,
                y:319-y*1/(y+1)*dy,
                maximum:-Math.sqrt(ycount-y)*20,
                z:1,
                strokeWidth: Math.sqrt(y)/2,
                angle: Math.PI/5,
                fillColor: color.toRgbString(),
                strokeColor: "#444444"
            });
            
            results.push(shape);        
        }
    }
    
    return results;
}

function genShapes(xcount, ycount) {
    var results = [];
    var dx = 1020/xcount;
    var dy = 25;

    for (var y = 0; y < ycount; y++) {
        for (var x = 0; x < xcount; x++) {
            var color = tinycolor(getScaledColor(y));
            //color.desaturate(
            //    bump_interpolate(y, ycount, 100));
            color.desaturate(100);
            color.setAlpha(y/ycount);
            var shape = genShape({
                x:x*dx,
                y:287+y*1/(y+1)*dy,
                maximum:Math.sqrt(ycount-y)*25,
                z:1,
                strokeWidth: Math.sqrt(y)/2,
                angle: Math.PI/5,
                fillColor: color.toRgbString(),
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
            "numSides": 23,
            "isLine": false,
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
            maximum: params.maximum*Math.sin((1-t)*Math.PI),
            z: 0.25+params.z*t,
            angle: params.angle*t,
            strokeColor: params.strokeColor,
            strokeWidth: params.strokeWidth,
            fillColor: params.fillColor,
         }));
    }

    return results;
}

function r(max) {
    return Math.random()*max;
}

function pointsToLine(list) {
    var handleIn = [];
    var handleOut = [];
    var points = [];

    list.forEach(function(coordinates){
        handleIn.push(["Point",r(-10),r(10)-5]);
        handleOut.push(["Point",r(10),r(10)-5]);
        points.push(["Point", coordinates.x, coordinates.y]);
    });

    return {
        handleIn:handleIn,
        handleOut:handleOut,
        points:points
    }
}

function buildCoordinates(y, maximum) {
    var list = [];
    list.push({x:-100, y:y});
    list.push({x:1120, y:y});

    for(var count=0; count<=20; count++) {
        var index = Math.floor(Math.random()*(list.length-1));
        var p1 = list[index];
        var p2 = list[index+1];
        var mid_x = (p1.x+p2.x)/2;
        var mid_y = (p1.y+p2.y)/2 + Math.random()*maximum;
        list.splice(index+1,0,{x:mid_x,y:mid_y});
    }

    list.push({x:list[0].x, y:list[0].y});
    return list;
}

function genKeyframe(params) {
    var line = pointsToLine(buildCoordinates(params.y, params.maximum));
    
var result = {
    "ease": "easeInOutExpo",
    "fillColor": params.fillColor,
    "handlesMoved": true,
    "state": {
        "handleIn": line.handleIn,
        "handleOut": line.handleOut,
        "point": line.points
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

function getScaledColor(index) {
    var avail = ["#4285F4", "#EA4235", "#FBBC05", "#34A853"];
    var index = index%avail.length;
    return avail[index];
}

