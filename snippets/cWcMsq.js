var spaceship = {
    width: 11,
    height: 11,
    data: [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 8, 0, 7, 0, 4, 0, 3, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 6, 0, 5, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
}

var boardState = getBoardState();
var boardWidth = boardState.originalSize[0];
var boardHeight = boardState.originalSize[1];
console.log(boardState, boardWidth, boardHeight);
addShapes(boardState);

putBoardState(boardState);
putTimestamp(0);
board.setStageFromLocal();

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
    return boardWidth/2;
}

function getCenterY() {
    return boardHeight/2;
}

function addShapes(state) {
    state.shapes = genParticles(50);
}


function genParticles(count) {
    var results = [];

    for (var i = 0; i < count; i++) {
        var t1 = Math.random();
        var t2 = Math.random();
        var theta = (t1 * 2*Math.PI) - Math.PI;
        var phi = (t2 * Math.PI/2) - Math.PI/2;
        var r = 4;
        var xyz = sphericalToCartesian(r, theta, phi);
        
        x = Math.sin(i/count*2*Math.PI); 
        z = -2;
        y = Math.cos(i/count*2*Math.PI); 
        
        var color = tinycolor(getRandomColor());
        color.setAlpha(Math.cos(i/count*Math.PI));
        color.lighten();
        var particle = genShape({
            x: x,
            y: y,
            z: z,
            strokeWidth: 1,
            strokeColor: "#000000",
            fillColor: color.toRgbString()
        });

        results.push(particle);
    }

console.log(results);

    return results;

}

function patternToCoordinateList(pattern) {
    var list = pattern.data.map( function(seq, index) {
        if (seq > 0) {
            return {
                seq:seq,
                x:index%pattern.width / pattern.width - 0.5,
                y:Math.floor(index/pattern.width) / pattern.height - 0.5,
                z:0
            }
        }
    })

    var result = list.filter( function(item) { 
        return item !== undefined;
    });

    result.sort( function(a,b) { 
        if (a.seq > b.seq) {
            return 1;
        }
        if (a.seq < b.seq) {
            return -1;
        }

        return 0;
    });

    return result;
}

function genShape(params) {
    var coordinates = patternToCoordinateList(spaceship);
    var keyframes = genKeyframes(coordinates, params);

    return {
            "break": false,
            "duped": false,
            "fillColor": params.fillColor,
            "hierarchyIndex": null,
            "keyframes": keyframes,
            "numSides": coordinates.length,
            "isLine": false,
            "strokeColor": params.strokeColor,
            "strokeWidth": params.strokeWidth
        }
}

function genTimeSeries() {
    var result = [];
    for (var t = 0; t <=540; t+= 60) {
        result.push(t);
    }
    return result;
}

function genKeyframes(coordinates, params) {
    var results = [];
    
    var times = genTimeSeries();
    while (times.length > 0) {
        var time = times.shift();
        var t = time / 540;
        results.push(genKeyframe(coordinates, params, time, t));
    }

    return results;
}

function genKeyframe(coordinates, params, time, t) {
    var line = [];

    //line = pointsToShape(coordinates, params, Math.PI, 2*Math.PI*t, Math.PI*t ); 
    line = pointsToShape(coordinates, params, Math.PI, 0, Math.PI*t ); 
    

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
        "time": time
    }

    return result;
}



function r(max) {
    return Math.random()*max;
}

function pointsToShape(list, params, a,b,z_axis_rot) {
    var handleIn = [];
    var handleOut = [];
    var points = [];

    var FOCAL_LENGTH = 300;
    list.forEach(function(coordinates, index){
        handleIn.push(["Point",0,0]);
        handleOut.push(["Point",0,0]);
        var rotated = rotate(coordinates.x, coordinates.y, coordinates.z, a, b ,z_axis_rot);
        var px = (rotated.x+params.x)*FOCAL_LENGTH/(rotated.z + params.z)+boardWidth/2;
        var py = (rotated.y+params.y)*FOCAL_LENGTH/(rotated.z + params.z)+boardHeight/2;
        points.push(["Point", px, py]);
    });

    return {
        handleIn:handleIn,
        handleOut:handleOut,
        points:points
    }
}

var FOCAL_LENGTH = 1;

function rotate(px, py, pz, pitch, roll, yaw) {
    var cosa = Math.cos(yaw);
    var sina = Math.sin(yaw);

    var cosb = Math.cos(pitch);
    var sinb = Math.sin(pitch);

    var cosc = Math.cos(roll);
    var sinc = Math.sin(roll);

    var Axx = cosa*cosb;
    var Axy = cosa*sinb*sinc - sina*cosc;
    var Axz = cosa*sinb*cosc + sina*sinc;

    var Ayx = sina*cosb;
    var Ayy = sina*sinb*sinc + cosa*cosc;
    var Ayz = sina*sinb*cosc - cosa*sinc;

    var Azx = -sinb;
    var Azy = cosb*sinc;
    var Azz = cosb*cosc;

    return {
        x: Axx*px + Axy*py + Axz*pz,
        y: Ayx*px + Ayy*py + Ayz*pz,
        z: Azx*px + Azy*py + Azz*pz
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

function sphericalToCartesian(r, theta, phi) {
    return {
        x: r * Math.cos(theta) * Math.sin(theta),
        y: r * Math.sin(theta) * Math.sin(phi),
        z: r * Math.cos(phi)
    }
}

