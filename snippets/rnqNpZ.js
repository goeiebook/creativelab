console.log("running....");
var SIZE = boardInterface.getBoardSize();


var FOCAL_LENGTH = 800;

var worldRotation = {
    pitch: function(t) { return 0; },
    roll: function(t) { return Math.PI/3; },
    yaw: function(t) { return 0; }, 
}

var worldTranslation = {
    x: function(t) { return 0; },
    y: function(t) { return 0; },
    z: function(t) { return 300; },  
}

function run() {
    
    var seeds = [];
    for (var z = -50; z < 200; z+=50) {
        for (var x = -100; x < 100; x+=25) {
            seeds.push({
                x: x + Math.random()*10-5, 
                y: 10,
                z: z + Math.random()*10-5
            });
        }
    }

    var colorCount = 4;
    while( colorCount >= 0 ) {
        var index = Math.floor(Math.random()*seeds.length);
        var seed = seeds[index];
        
        if (seed.color === undefined) {
            seed.color = colorCount--;
        }
    }

    var flowers = seeds.map( function(seed) {
        var startTime = Math.floor(Math.random()*8);
        var endTime = startTime+1;
        var scale = [0,Math.ceil(Math.random()*5)*10];
        var handleScale = [scale[0], scale[1]+10];
        
        if (seed.color) {
            seed.bloomColor = tinycolor(getScaledColor(seed.color));
        }
        else {
            seed.bloomColor = tinycolor(getRandomColor()).desaturate(100);
        }
        
        var flowerParams = {
            petalCount: Math.ceil(Math.random()*10)+2,
            scale: scale,
            handleScale: handleScale,
            rotator: [0, 0],
            bloomColor: seed.bloomColor,
            time: [startTime, endTime*60],
            root: {
                x: seed.x,
                y: seed.y,
                z: seed.z 
                },
            apicalTip: {
                x:0,
                y:-1.0,
                z:0 
                }
            }
        
        return flowerParams;
    });

    flowers.sort( function(a,b) {
        return b.root.z - a.root.z;
    });

    var shapes = [];
    flowers.forEach( function(flower) {
        var stem = genStem(flower);
        var center = genFlowerCenter(flower);
        shapes = shapes.concat(stem.shape, center.shape);
    });

    boardInterface.apply(shapes);
    console.log("done.");
}

function genStem(params) {
    var geometry = genStemGeometry(params);

    var shape = genShape({
        model: {
            scale: Smooth(params.scale, {scaleTo:1}),
            translation: {
                x: Smooth([0,0], {scaleTo:1}),
                y: Smooth([0,0], {scaleTo:1}),
                z: Smooth([0,0], {scaleTo:1}),
            },
            rotation: {
                pitch: Smooth(params.rotator, {scaleTo:1}),
                roll: Smooth([0,0], {scaleTo:1}),
                yaw: Smooth(params.rotator, {scaleTo:1}),
            }
        },
        world: {
            translation: {
                x: Smooth([params.root.x, params.root.x], {scaleTo:1}),
                y: Smooth([params.root.y, params.root.y], {scaleTo:1}),
                z: Smooth([params.root.z, params.root.z], {scaleTo:1}) 
            }
        },
        handles: {
            inHandle: {
                scale: Smooth(params.scale, {scaleTo:1}),
                rotation: {
                    pitch: Smooth(params.rotator, {scaleTo:1}),
                    roll: Smooth([0,0], {scaleTo:1}),
                    yaw: Smooth(params.rotator, {scaleTo:1}),
                }
            }, 
            outHandle: {
                scale: Smooth(params.scale, {scaleTo:1}),
                rotation: {
                    pitch: Smooth(params.rotator, {scaleTo:1}),
                    roll: Smooth([0,0], {scaleTo:1}),
                    yaw: Smooth(params.rotator, {scaleTo:1}),
                }
            }, 
        },
        strokeWidth: 1,
        strokeColor: tinycolor("black").lighten().setAlpha(0.50),
        fillColor: tinycolor("black").lighten().setAlpha(0.50),
        startTime: params.time[0],
        endTime: params.time[1],
        },
        geometry
    );

    return {
        shape: shape
    }
}

function genFlowerCenter(params) {
    var bloom_params = {
        starting_angle: 0,
        petal_count: params.petalCount,
        major_axis: 0.10,
        minor_axis: 0.10,
        major_handle_axis: 0.10,
        minor_handle_axis: 0.10,  
    };

    var bloom_color = {
        fill: params.bloomColor,
        edge: tinycolor("black").lighten().setAlpha(0.50)  
    };

    var geometry = genFlowerGeometry(bloom_params);

    var shapes = genShape({
            model: {
                scale: Smooth(params.scale, {scaleTo:1}),
                translation: {
                    x: Smooth([params.apicalTip.x,params.apicalTip.x], {scaleTo:1}),
                    y: Smooth([params.apicalTip.y,params.apicalTip.y], {scaleTo:1}),
                    z: Smooth([params.apicalTip.z,params.apicalTip.z], {scaleTo:1}),
                },
                rotation: {
                    pitch: Smooth(params.rotator, {scaleTo:1}),
                    roll: Smooth([0,0], {scaleTo:1}),
                    yaw: Smooth(params.rotator, {scaleTo:1}),
                }
            },
            world: {
                translation: {
                    x: Smooth([params.root.x, params.root.x], {scaleTo:1}),
                    y: Smooth([params.root.y, params.root.y], {scaleTo:1}),
                    z: Smooth([params.root.z, params.root.z], {scaleTo:1}) 
                }
            },
            handles: {
                inHandle: {
                    scale: Smooth(params.handleScale, {scaleTo:1}),
                    rotation: {
                        pitch: Smooth(params.rotator, {scaleTo:1}),
                        roll: Smooth([0,0], {scaleTo:1}),
                        yaw: Smooth(params.rotator, {scaleTo:1}),
                    }
                }, 
                outHandle: {
                    scale: Smooth(params.handleScale, {scaleTo:1}),
                    rotation: {
                        pitch: Smooth(params.rotator, {scaleTo:1}),
                        roll: Smooth([0,0], {scaleTo:1}),
                        yaw: Smooth(params.rotator, {scaleTo:1}),
                    }
                }, 
            },
            strokeWidth: 1,
            strokeColor: bloom_color.edge.toRgbString(),
            fillColor: bloom_color.fill.toRgbString(),
            startTime: params.time[0],
            endTime: params.time[1],
            },
            geometry
        );


    return {
        shape: shapes
    }   
}

function genStemGeometry(params) {
    var coordinates = [];
    var inHandles = [];
    var outHandles = [];

    var baseCoordinate = {x:0,y:0,z:0};
    var baseInHandle = {x:Math.random()*0.05, y:Math.random()*0.05,z:0};
    var baseOutHandle = {x:Math.random()*0.05, y:Math.random()*0.05,z:0};

    var apicalCoordinate = params.apicalTip;
    var apicalInHandle = {x:0, y:0,z:0};
    var apicalOutHandle = {x:0, y:0,z:0};


    return {
        numSides: 2,
        coordinates: coordinates.concat(baseCoordinate, apicalCoordinate),
        inHandles: inHandles.concat(baseInHandle, apicalInHandle),
        outHandles: outHandles.concat(baseOutHandle, apicalOutHandle),
    }
}

function genFlowerGeometry(params) {
    var coordinates = [];
    var inHandles = [];
    var outHandles = [];

    for (var index = 0; index < params.petal_count; index++) {
        var t = index/params.petal_count;
        var x = 
            params.major_axis * 
            Math.cos( t*2*Math.PI+params.starting_angle);
        
        var z =
            params.minor_axis * 
            Math.sin( t*2*Math.PI+params.starting_angle);
        
        var y = 0;

        var coordinate = {
            x:x,
            y:y,
            z:z,
        };

        var length = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
        var vx = x / length;
        var vz = z / length;
        var a = Math.atan2(vz,vx);
        var offset = Math.PI*2/params.petal_count/2;
        
        var inHandle = {
            x: x + params.major_handle_axis * Math.cos(a-offset),
            z: z + params.minor_handle_axis * Math.sin(a-offset),
            y: -1 
        };

        var outHandle = {
            x: x + params.major_handle_axis * Math.cos(a+offset),
            z: z + params.minor_handle_axis * Math.sin(a+offset),   
            y: -1
        }
        
        coordinates.push(coordinate);
        inHandles.push(inHandle);
        outHandles.push(outHandle);
    }   

    return {
        numSides: coordinates.length,
        coordinates: coordinates,
        inHandles: inHandles,
        outHandles: outHandles
    }; 
}

function genShape(params, geometry) {
    var keyframes = [];
    var startTime = params.startTime;
    var endTime = params.endTime;
    var timeSpan = endTime - startTime;
    
    for (var time = 0; time <= 540; time+=60) {
        var t = time < startTime ? 0 : Math.min(1, (time - startTime)/timeSpan);

        keyframes.push(
            genKeyframe(
                geometry, params, time, t));
    }
    
    return {
        "break": false,
        "duped": false,
        "numSides": geometry.numSides,
        "keyframes": keyframes,
        "fillColor": params.fillColor,
        "strokeColor": params.strokeColor,
        "strokeWidth": params.strokeWidth,
        "hierarchyIndex": null,
     }
}

function genKeyframe(coords, params, time, t) {
    var state = genState(coords, params, t);

    var result = {
        "ease": "easeInOutExp",
        "fillColor": params.fillColor,
        "handlesMoved": true,
        "state": {
            "handleIn": state.handleIn.map(addJitter),
            "handleOut": state.handleOut.map(addJitter),
            "point": state.points.map(addJitter)
        },

        "strokeColor": params.strokeColor,
        "strokeWidth": params.strokeWidth,
        "time": time
    }

    return result;
}

function genState(geometry, params, t) {

    function translate(point, translation, t) {
        return {
            x: point.x + translation.x(t),
            y: point.y + translation.y(t),
            z: point.z + translation.z(t),
        }
    }

    function scale(point, scale, t) {
        return {
            x: point.x * scale(t),
            y: point.y * scale(t),
            z: point.z * scale(t),
        }
    }


    var coordinates = geometry.coordinates.map( function(point, index) {
        var translated = translate(point, params.model.translation, t);
        var rotated = rotate(translated, params.model.rotation, t); 
        var result = scale(rotated, params.model.scale, t);

        return {x:result.x, y:result.y, z:result.z};
    });


    var inHandles = geometry.inHandles.map( function(point, index) {
        var vertex = {
            x: point.x + geometry.coordinates[index].x,
            y: point.y + geometry.coordinates[index].y,
            z: point.z + geometry.coordinates[index].z
        }

        var scaled = scale(vertex, params.handles.inHandle.scale, t);

        if (scaled.x === 0 && scaled.y === 0) {
            return undefined;
        }

        var result = rotate(scaled, params.handles.inHandle.rotation, t); 

        return {
            x: result.x,
            y: result.y,
            z: result.z
        };
    });

    var outHandles = geometry.inHandles.map( function(point, index) {
        var vertex = {
            x: point.x + geometry.coordinates[index].x,
            y: point.y + geometry.coordinates[index].y,
            z: point.z + geometry.coordinates[index].z
        }

        var scaled = scale(vertex, params.handles.outHandle.scale, t);

        if (scaled.x === 0 && scaled.y === 0) {
            return undefined;
        }

        var result = rotate(scaled, params.handles.outHandle.rotation, t); 

        return {
            x: result.x,
            y: result.y,
            z: result.z
        };
    });


    function applyWorld(point) {
        if (point) {
            var model = translate(point, params.world.translation, t);
            var rotated = rotate(model, worldRotation, t);
            var translated = translate(rotated, worldTranslation, t); 
            var result = translated;

            return {
                x: result.x,
                y: result.y,
                z: result.z
            }
        }
        else {
            return undefined;
        }
    }

    function project(point) {
        if (point) {
            return {
                x: (point.x * FOCAL_LENGTH / point.z) + SIZE.width/2,
                y: (point.y * FOCAL_LENGTH / point.z) + SIZE.width/2,
            }
        }
        else {
            return undefined;
        }
    }

    inHandles = inHandles.map(applyWorld).map(project);
    outHandles = outHandles.map(applyWorld).map(project);
    coordinates = coordinates.map(applyWorld).map(project);

    return {
        handleIn: inHandles.map( function(point, index) { 
            if (point) {
                return ["Point", point.x - coordinates[index].x, point.y - coordinates[index].y]; 
            }
            else {
                return ["Point", 0, 0];
            }
        }),
        handleOut: outHandles.map( function(point, index) { 
            if (point) {
                return ["Point", point.x - coordinates[index].x, point.y - coordinates[index].y]; 
            }
            else {
                return ["Point", 0, 0];
            }
        }),
        points: coordinates.map( function(point, index) { 
            return ["Point", point.x, point.y];
        })
    }
}

function addJitter(v) {
    return [
        v[0],
        v[1]+Math.random()*2-1,
        v[2]+Math.random()*2-1
    ]
}

function rotate(coords, rotation, t) {
    var pitch = rotation.pitch(t);
    var roll = rotation.roll(t);
    var yaw = rotation.yaw(t);

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
            "stops": [[color_a, 0.01],["white", 0.7],[color_b, 1.0]],
            "radial": true
         },
         "origin": ["Point",x,y],
         "destination": ["Point",0,0]
    }
}

run();
