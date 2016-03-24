var letter_g = {
    width: 11,
    height: 11,
    data: [
    4, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 7,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 9, 10,0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6]
}

var boardState = getBoardState();
var boardWidth = boardState.originalSize[0];
var boardHeight = boardState.originalSize[1];

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
    state.shapes = genParticles(100);
}


function genParticles(count) {
    var results = [];

    var I = 3, J = 3, K = 3;

    for (var i = 0; i < I; i++) {
        for( var j= 0; j < J; j++) {
            for( var k=0; k<K; k++) {
                var x = i/I-0.5;
                var y = j/J-0.5;
                var z = k/K-0.5;
                var color = tinycolor(getRandomColor());
                color.lighten();
                color.setAlpha(i+j+k/(I+J+K));
                color.desaturate(Math.cos(j/J*2*Math.PI)*100);

                var particle = genShape({
                    model: {
                        x: x*3,
                        y: y*3,
                        z: z*3,    
                    },
                    world: {
                        x:0,
                        y:0,
                        z:-4
                    },
                    strokeWidth: 4,
                    strokeColor: "#000000",
                    fillColor: color.toRgbString()
                });

                results.push(particle);        
            }
        }
    }

    return results;
}

function genShape(params) {
    var coordinates = patternToCoordinateList(letter_g);
    var keyframes = genKeyframes(coordinates, params);

    return {
            "break": true,
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


function patternToCoordinateList(pattern) {
    var list = pattern.data.map( function(seq, index) {
        if (seq > 0) {
            return {
                seq:seq,
                x:index%pattern.width / pattern.width - 0.5,
                y:Math.floor(index/pattern.width) / pattern.height - 0.5,
                z:0.001
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

    var model_rotation = {
        pitch: 0,
        roll: t*Math.PI*10,
        yaw: t*Math.PI*9,
    };

    var world_rotation = {
        pitch: t*Math.PI*10,
        roll: t*Math.PI*10,
        yaw:0
    }

    params.world.z = -4 + 1*Math.sin(t*Math.PI)-.5;
    //line = pointsToShape(coordinates, params, Math.PI, 2*Math.PI*t, Math.PI*t ); 
    line = pointsToShape(coordinates, params, model_rotation, world_rotation ); 

    var result = {
        "ease": "easeInOutQuad",
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

function pointsToShape(list, params, model_rotation, world_rotation) {
    var handleIn = [];
    var handleOut = [];
    var points = [];

    var FOCAL_LENGTH = 300;
    list.forEach(function(coordinates, index){
        handleIn.push(["Point",0,0]);
        handleOut.push(["Point",0,0]);
        var rotated = rotate(coordinates, model_rotation);
        var translated = translate(rotated, params.model.x, params.model.y, params.model.z);
        var final = rotate(translated, world_rotation);
        var px = (final.x+params.world.x)*FOCAL_LENGTH/(params.world.z)+boardWidth/2;
        var py = (final.y+params.world.y)*FOCAL_LENGTH/(params.world.z)+boardHeight/2;
        points.push(["Point", px, py]);
    });

    return {
        handleIn:handleIn,
        handleOut:handleOut,
        points:points
    }
}

function genTimeSeries() {
    var result = [];
    for (var t = 0; t <=540; t+= 60) {
        result.push(t);
    }
    return result;
}

function r(max) {
    return Math.random()*max;
}

function translate(coords, dx, dy, dz) {
    
    return {
        x: coords.x+dx,
        y: coords.y+dy,
        z: coords.z+dz,
    };
}

function rotate(coords, rotation) {
    var pitch = rotation.pitch;
    var roll = rotation.roll;
    var yaw = rotation.yaw;

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
        x: Axx*coords.x + Axy*coords.y + Axz*coords.z,
        y: Ayx*coords.x + Ayy*coords.y + Ayz*coords.z,
        z: Azx*coords.x + Azy*coords.y + Azz*coords.z
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

