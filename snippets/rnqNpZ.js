var BOARD_STATE = getBoardState();
applyBoard();

function applyBoard() {
    addShapes(BOARD_STATE);
    putBoardState(BOARD_STATE);
    putTimestamp(0);
    board.setStageFromLocal();   
}

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

function getBoardCenter() {
    var size = getBoardSize();

    return {
        x: size.width/2,
        y: size.height/2
    }
}

function getBoardSize() {
    return {
        width: BOARD_STATE.originalSize[0],
        height: BOARD_STATE.originalSize[1],
    }
}

function addShapes(state) {
    var flowers = genFlowers(5);
    state.shapes = flowers;
}

function genFlower(params) {
    var initial_rotation = Math.random()*Math.PI;
    var coordinates = [];
    for (var index = 0; index < params.petal_count; index++) {
        var t = index/params.petal_count;
        var x = 
            (index%params.petal_mod+1) *
            params.petal_size * params.x_axis *
            Math.cos( t*2*Math.PI+initial_rotation );
        
        var y =
            (index%params.petal_mod+1) *
            params.petal_size * params.y_axis *
            Math.sin( t*2*Math.PI+initial_rotation);
        
        var z = 0.0001;
        
        coordinates.push({
            x:x,
            y:y,
            z:z
        });
    }   

    return coordinates; 
}

function genFlower2(params) {
    var initial_rotation = Math.random()*Math.PI;
    var coordinates = [];
    for (var index = 0; index < params.petal_count; index++) {
        var t = index/params.petal_count;
        var x = 
            params.petal_size * 
            Math.cos( t*2*Math.PI+initial_rotation );
        
        var y =
            params.petal_size * 
            Math.sin( t*2*Math.PI+initial_rotation);
        
        var z = 0.0001;
        
        coordinates.push({
            x:x,
            y:y,
            z:z
        });
    }   

    return coordinates; 
}


function genFlowers(count) {
    var result = [];
    var area = getBoardSize();
    var pds = new PoissonDiskSampler();
    pds.w = area.width;
    pds.h = area.height/2;
    pds.maxPoints = count;
    pds.radiusMin = 10;
    pds.radiusMax = 80;
    pds.createPoints();

    pds.pointList.forEach( function(point, index) {
        point.y += area.height/4;
        var a = bloom_1(index/count);
        var b = bloom_2(a, index/count);
        var c = bloom_3(b, index/count);

        var si = Math.floor(Math.random()*5);
        c.times.start = 540-60*si;
        c.times.end = Math.min(540, 540-60*(si+2));
        c.params.petal_count = 10;
    
        var theta = Math.random()*Math.PI*2;
        var _point = function(s) { return { 
            x:point.x + s*Math.cos(theta),
            y:point.y + s*Math.sin(theta)
            }
        };

        var d = bloom_4(c, index/count, 1.5, _point(1));
        
        c.times.start = 540-60*6;
        c.times.end = 540-60*3;
        c.params.petal_count = 15;

        var e = bloom_4(c, index/count, 1, _point(5));

        c.times.start = 540-60*4;
        c.times.end = 540-60*2;
        c.params.petal_count = 18;
        
        var f = bloom_4(c, index/count, 0.75, _point(10));

        c.times.start = 540-60*2;
        c.times.end = 540-60*1;
        c.params.petal_count = 25;

        var g = bloom_4(c, index/count, 0.50, _point(15.0));

        c.times.start = 540-60*2;
        c.times.end = 540-60;
        c.params.petal_count = 50;

        var h = bloom_5(c, index/count, 1, _point(17.0));
        
        result.push(a.shape,c.shape, b.shape, d.shape, e.shape, f.shape, g.shape, h.shape);
          
        function bloom_1(t) {
            var start_time = Math.floor(Math.random()*3)*30;

            var bloom_params = {
                petal_size: point.r,
                petal_count: 4,
                petal_mod: 2,
                x_axis: 1,
                y_axis: 0.55  
            };

            var base_color = tinycolor(getScaledColor(3));
            
            var bloom_color = {
                fill: base_color.clone(),
                edge: base_color.clone().desaturate(t*25).darken(25)  
            };

            var bloom_times = {
                start: start_time,
                end:start_time+60
            };

            var shape = gen2DShape(
                {
                    model: {x:point.x, y:point.y, z:0},
                    handles: {inX:1.5, inY:1.5, outX:1.5, outY:1.5},
                    strokeWidth: 1,
                    strokeColor: bloom_color.edge.toRgbString(),
                    fillColor: bloom_color.fill.toRgbString(),
                    startTime:bloom_times.start,
                    endTime:bloom_times.end,
                },
                genFlower(bloom_params)
            );

            return {
                params: bloom_params,
                colors: bloom_color,
                times: bloom_times,
                shape: shape
            }   
        }

        function bloom_2(parent,t ) {
            var bloom_params = {
                petal_size: parent.params.petal_size*0.30,
                petal_count: 10,
                petal_mod: 2,
                x_axis: 1,
                y_axis: 1  
            };

            var base_color = tinycolor(getRandomColor());
            
            function r(list) {
                return list[Math.floor(Math.random()*list.length)];
            }

            var bloom_color = {
                fill: r(base_color.analogous()).clone().desaturate(t*25),
                edge: r(base_color.analogous()).clone().desaturate(t*25).darken(25)  
            };

            var bloom_times = {
                start: parent.times.end,
                end: parent.times.end+60
            };

            var shape = gen2DShape(
                {
                    model: {x:point.x, y:point.y, z:0},
                    handles: {inX:1, inY:1, outX:1, outY:1},
                    strokeWidth: 1,
                    strokeColor: bloom_color.edge.toRgbString(),
                    fillColor: bloom_color.fill.toRgbString(),
                    startTime:bloom_times.start,
                    endTime:bloom_times.end,
                },
                genFlower(bloom_params)
            );

            return {
                params: bloom_params,
                colors: bloom_color,
                times: bloom_times,
                shape: shape
            }   
        }

        function bloom_3(parent,t ) {
            var bloom_params = {
                petal_size: parent.params.petal_size*1.5,
                petal_count: 5,
                petal_mod: 2,
                x_axis: 1,
                y_axis: 1,  
            };

            function r(list) {
                return list[Math.floor(Math.random()*list.length)];
            }

            var base_color = r(parent.colors.fill.splitcomplement());
            
            var bloom_color = {
                fill: r(base_color.analogous()).clone().brighten().setAlpha(0.50),
                edge: r(base_color.analogous()).clone().desaturate(t*60).setAlpha(0.75).darken(5)  
            };

            var bloom_times = {
                start: parent.times.end,
                end: parent.times.end+60
            };

            var shape = gen2DShape(
                {
                    model: {x:point.x, y:point.y, z:0},
                    handles: {inX:0.95, inY:1, outX:1, outY:0.90},
                    strokeWidth: 4,
                    strokeColor: bloom_color.edge.toRgbString(),
                    fillColor: bloom_color.fill.toRgbString(),
                    startTime:bloom_times.start,
                    endTime:bloom_times.end,
                },
                genFlower(bloom_params)
            );

            return {
                params: bloom_params,
                colors: bloom_color,
                times: bloom_times,
                shape: shape
            }   
        }

        function bloom_4(parent,t, s, _mod) {
            var bloom_params = {
                petal_size: parent.params.petal_size*s,
                petal_count: parent.params.petal_count,
                petal_mod: 2,
                x_axis: 1,
                y_axis: 1,  
            };

            function r(list) {
                return list[Math.floor(Math.random()*list.length)];
            }

            var base_color = tinycolor("yellow");
            
            var bloom_color = {
                fill: base_color.clone().brighten().setAlpha(0.90),
                edge: tinycolor("black"), 
            };

            var bloom_times = {
                start: parent.times.end,
                end: parent.times.end+60
            };

            var shape = gen2DShape(
                {
                    model: {x:_mod.x, y:_mod.y, z:0},
                    handles: {inX:1, inY:1, outX:1, outY:1},
                    strokeWidth: 1,
                    strokeColor: bloom_color.edge.toRgbString(),
                    fillColor: makeGradient(bloom_color.fill.toRgbString(), getRandomColor(), point.x, point.y),
                    startTime:bloom_times.start,
                    endTime:bloom_times.end,
                },
                genFlower2(bloom_params)
            );

            return {
                params: bloom_params,
                colors: bloom_color,
                times: bloom_times,
                shape: shape
            }   
        }
        
        function bloom_5(parent,t, s, _mod) {
            var bloom_params = {
                petal_size: parent.params.petal_size*s,
                petal_count: parent.params.petal_count,
                petal_mod: 2,
                x_axis: 1,
                y_axis: 1,  
            };

            function r(list) {
                return list[Math.floor(Math.random()*list.length)];
            }

            var base_color = tinycolor(getRandomColor());
            
            var bloom_color = {
                fill: base_color.clone().brighten().setAlpha(0.90),
                edge: tinycolor("black"), 
            };

            var bloom_times = {
                start: parent.times.end,
                end: parent.times.end+60
            };

            function ir() {
                return Math.random()*2+1.7;
            }
            var shape = gen2DShape(
                {
                    model: {x:_mod.x, y:_mod.y, z:0},
                    handles: {inX:ir(), inY:ir(), outX:ir(), outY:ir()},
                    strokeWidth: 1,
                    strokeColor: bloom_color.edge.toRgbString(),
                    fillColor: makeGradient(bloom_color.fill.toRgbString(), getRandomColor(), point.x, point.y),
                    startTime:bloom_times.start,
                    endTime:bloom_times.end,
                },
                genFlower2(bloom_params)
            );

            return {
                params: bloom_params,
                colors: bloom_color,
                times: bloom_times,
                shape: shape
            }   
        }
           
    });

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
            model: 0,
        };

        if (time >= startTime && time < endTime) {
            var t = (time - startTime)/timeSpan;
            scale.handles = t
            scale.model = t
        }
        else if (time >= endTime) {
            scale.handles = 1;
            scale.model = 1;
        }
      
        keyframes.push(
            gen2DKeyframe(
                coordinates, params, time, scale));
    }
    
    return {
        "break": false,
        "duped": false,
        "numSides": coordinates.length,
        "keyframes": keyframes,
        "fillColor": params.fillColor,
        "strokeColor": params.strokeColor,
        "strokeWidth": params.strokeWidth,
        "hierarchyIndex": null,
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
            x: params.handles.inX*(coord.x + Math.cos(a-Math.PI/Math.random()*16)),
            y: params.handles.inY*(coord.y + Math.sin(a-Math.PI/Math.random()*16)),
        };

        var outHandle = {
            x: params.handles.outX*(coord.x + Math.cos(a+Math.PI/Math.random()*16)),
            y: params.handles.outY*(coord.y + Math.sin(a+Math.PI/Math.random()*16)),   
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
            gen3DKeyframe(
                coordinates, params, time, t));
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
    //var avail = ["#4285F4", "#EA4235", "#FBBC05", "#34A853"];
    var avail = ["#4285F4", "#EA4235", "#FBBC05"];
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
            "stops": [[color_a, 0.01],["white", 0.7],[color_b, 1.0]],
            "radial": true
         },
         "origin": ["Point",x,y],
         "destination": ["Point",0,0]
    }
}

function rxy(x,y,dx,dy) {
    return {
        x: x+Math.random()*dx - dx/2,
        y: y+Math.random()*dy - dy/2,
    };
}
