var boardState = getBoardState();
var boardWidth = boardState.originalSize[0];
var boardHeight = boardState.originalSize[1];

function again() {
    addShapes(boardState);
    putBoardState(boardState);
    putTimestamp(0);
    board.setStageFromLocal();   
}

again();

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
    var flowers = genFlowers(30);
    state.shapes = flowers;
}

function genFlower(radius, pointCount, mod) {
    var initial_rotation = Math.random()*Math.PI;
    var coordinates = [];
    for (var index = 0; index < pointCount; index++) {
        var x = (index%mod+1)*radius*Math.cos(index/pointCount*2*Math.PI+initial_rotation);
        var y = (index%mod+1)*radius*Math.sin(index/pointCount*2*Math.PI+initial_rotation);
        var z = 0.0001;
        
        coordinates.push({
            x:x,
            y:y,
            z:z
        });
    }   

    return coordinates; 
}

function rxy(x,y,dx,dy) {
    return {
        x: x+Math.random()*dx - dx/2,
        y: y+Math.random()*dy - dy/2,
    };
}

function genFlowers(count) {
    var result = [];

    for (var index = count; index > 0; index--) {
     for (var repeat = 0; repeat <= 2; repeat++) {
        var petal_size = Math.sqrt(index*300);
        var petal_count = Math.min(10, (count-index+1)*6);
        var petal_mod = Math.ceil(Math.random()*3);
        var dx = Math.sqrt((index)*10000);
        var placement = rxy(boardWidth/2, boardHeight/2+75*Math.cos(index/count*Math.PI), dx*1.5, petal_size*1.5);
        var flower_coordinates = genFlower(petal_size, petal_count,petal_mod);
        
        flower_color = tinycolor(getRandomColor());
        flower_color.desaturate(index/count*25);
        outline_color = flower_color.clone();
        outline_color.darken(25);

        var bloomStartTime = Math.floor(Math.random()*8)*60+60
        var bloomEndTime = bloomStartTime+60;
        
        var level_2 = gen2DShape({
            model: {x:placement.x, y:placement.y, z:0},
            strokeWidth: 1,
            strokeColor: outline_color.toRgbString(),
            fillColor: flower_color.toRgbString(),
            startTime:bloomStartTime,
            endTime:bloomEndTime,
            },
            flower_coordinates);

        var secondary_coordinates = genFlower(petal_size*1.25, 5 , 1);
        var secondary_flower_color = flower_color.clone();
        secondary_flower_color.lighten();
        secondary_flower_color.setAlpha(0.5);
        outline_color.lighten();

        var level_1 = gen2DShape({
            model: {x:placement.x, y:placement.y, z:0},
            strokeWidth: 5,
            strokeColor: outline_color.toRgbString(),
            fillColor: makeGradient(secondary_flower_color.toRgbString(), outline_color.toRgbString(), placement.x, placement.y),
            startTime: 480-60,
            endTime: 480,
            },
            secondary_coordinates);

        var centerpoint_coordinates = genFlower(petal_size*0.01, 2 , 1);
        
        var tiny_center = gen2DShape({
            model: {x:placement.x, y:placement.y, z:0},
            strokeWidth: 1,
            strokeColor: "black",
            fillColor: "black",
            startTime: 0,
            endTime: 540,
            },
            centerpoint_coordinates);
            
        
        var center_coordinates = genFlower(petal_size*0.35, 1 , 1);
        flower_color.lighten();
        outline_color.lighten();

        var level_3 = gen2DShape({
            model: {x:placement.x, y:placement.y, z:0},
            strokeWidth: 2,
            strokeColor: outline_color.toRgbString(),
            fillColor: makeGradient(flower_color.toRgbString(), outline_color.toRgbString(), placement.x, placement.y),
            startTime: bloomStartTime-60,
            endTime: bloomStartTime,
            },
            center_coordinates);
        } 

        result.push(level_1, level_2, level_3, tiny_center);
    }

    return result;
}

function gen2DShape(params, coordinates) {
    var keyframes = [];
    var startTime = params.startTime;
    var endTime = params.endTime;
    var timeSpan = endTime - startTime;
    for (var time = 0; time <= 540; time+=60) {
        var scale = {
            handles: 0,
            model: 0.01,
        };
        
        if (time >= startTime && time <= endTime) {
            scale.handles = (time-startTime) / timeSpan
        }
        else if (time >= endTime) {
            scale.handles = 1;
        }
        else if (time === startTime) {
            scale.model = 1;
        }

        keyframes.push(
            gen2DKeyframe(coordinates, params, time, scale));
    }
    
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

function gen2DKeyframe(coords, params, time, scale) {
    var state = gen2DState(coords, params, scale);

    var result = {
        "ease": "easeInOutQuad",
        "fillColor": params.fillColor,
        "handlesMoved": true,
        "state": {
            "handleIn": state.handleIn,
            "handleOut": state.handleOut,
            "point": state.points
        },

        "strokeColor": params.strokeColor,
        "strokeWidth": params.strokeWidth,
        "time": time
    }

    return result;
}

function gen2DState(list, params, scale) {
    var handleIn = [];
    var handleOut = [];
    var points = [];

    list.forEach( function(coord, index) {
        var px = coord.x*scale.model + params.model.x;
        var py = coord.y*scale.model + params.model.y;

        var length = Math.sqrt(Math.pow(coord.x,2)+Math.pow(coord.y,2));
        var vx = coord.x / length;
        var vy = coord.y / length;
        var a = Math.atan(vy/vx);
        
        if (vx < 0 || vy < 0) {
            a+= Math.PI/2;
        }
        
        var inHandle = {
            x: coord.x + 5 * Math.cos(a-Math.PI/4),
            y: coord.y + 5 * Math.sin(a-Math.PI/4),
        };

        var outHandle = {
            x: coord.x + 5 * Math.cos(a+Math.PI/4),
            y: coord.y + 5 * Math.sin(a+Math.PI/4),   
        }
        
        handleIn.push(["Point", inHandle.x*scale.handles, inHandle.y*scale.handles]);
        handleOut.push(["Point", outHandle.x*scale.handles, outHandle.y*scale.handles]);
        
        points.push(["Point", px, py]);
    });
    
    return {
        handleIn: handleIn,
        handleOut: handleOut,
        points: points
    }
}

function genKeyframes(coordinates, params) {
    var results = [];
    
    var times = genTimeSeries();
    while (times.length > 0) {
        var time = times.shift();
        var t = time / 540;
        
        results.push(
            gen3DKeyframe(coordinates, params, time, t));
    }

    return results;
}

function gen3DKeyframe(coordinates, params, time, t) {
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

    line = gen3DState(coordinates, params, model_rotation, world_rotation ); 

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

function gen3DState(list, params, model_rotation, world_rotation) {
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

function makeGradient(color_a, color_b, x, y) {
    return {
        "gradient":{
            "stops": [["white", 0], [color_a, 0.5], [color_b, 1]],
            "radial": true
                },
         "origin": ["Point",x,y],
         "destination": ["Point",x+5,y]
    }
}