var roof = null;
var roofPoints = [];
var lines = [];
var lineCounter = 0;
var drawingObject = {};
drawingObject.type = "";
drawingObject.background = "";
drawingObject.border = "";

function Point(x, y) {
    this.x = x;
    this.y = y;
}


$("#polygon-icon").click(function () {
    if (drawingObject.type == "roof") {
        drawingObject.type = "";
        lines.forEach(function(value, index, ar){
             canvas.remove(value);
        });
        //canvas.remove(lines[lineCounter - 1]);
        roof = makeRoof(roofPoints);
        canvas.add(roof);
        canvas.renderAll();
    } else {
        drawingObject.type = "roof"; // roof type
    }


    resetDimensions();
});


// canvas Drawing

window.canvas = new fabric.Canvas('canvas-tools', {
    width: window.screenWidth<window.innerWidth?window.innerWidth:window.screenWidth,
    height: window.screenHeight<window.innerHeight?window.innerHeighth:window.screenHeight
});
/* Fix for FabricJS canvas dimensions bug */
/* If less than 3 secs, it wont fix it and revert back to the small dimensions */
/*
    <div class="canvas-container" style="width: 300px; height: 150px; position: relative; user-select: none;">
        <canvas id="canvas-tools" class="canvas lower-canvas" width="1591" height="775" style="position: absolute; width: 300px; height: 150px; left: 0px; top: 0px; user-select: none;"></canvas>
        <canvas class="upper-canvas canvas" width="0" height="0" style="position: absolute; width: 300px; height: 150px; left: 0px; top: 0px; user-select: none;"></canvas>
    </div>
*/
// canvas.renderAll();
setTimeout(()=>{
    resetDimensions();
},3000)

// setTimeout(()=>{
//     document.querySelectorAll(".canvas-container, .canvas-container *").forEach(el=>{
//         el.style.width = window.screenWidth + "px"
//         el.style.height = window.screenHeight + "px"
//     });
// }, 3000);

function resetDimensions() {
    var width = window.screenWidth<window.innerWidth?window.screenWidth:window.innerWidth;
    height = window.screenHeight;
    canvas.setDimensions({
        width,
        height
    });

    // document.querySelectorAll(".canvas-container, .canvas-container *").forEach(el=>{
    //     el.style.width = width + "px"
    //     el.style.height = height + "px"
    // });
    canvas.setBackgroundImage(window.imgSrc, canvas.renderAll.bind(canvas));
} // resetDimensions

resetDimensions();

var x = 0;
var y = 0;

fabric.util.addListener(window,'dblclick', function(){ 
        drawingObject.type = "";
        lines.forEach(function(value, index, ar){
             canvas.remove(value);
        });
        //canvas.remove(lines[lineCounter - 1]);
        roof = makeRoof(roofPoints);
        canvas.add(roof);
        canvas.renderAll();
  
    console.log("Double click - region completed");
    //clear arrays
     roofPoints = [];
     lines = [];
     lineCounter = 0;
    
     document.querySelector("#polygon-icon.active")?.classList?.remove("active");
});

canvas.on('object:selected', function(event) {
    var selectedObject = event.target;

    // Check if the selected object is a Polyline
    if (selectedObject.type === 'polyline') {
        // console.log(selectedObject.points);
        /**
         * [Point, Point,...]
         * 
         * Point {x:0, y:0}
         */

        // Convert to universal format
        var points = selectedObject.points.map(function(point) {
            return [
                point.x,
                point.y
            ];
        });
        console.log({points, link:selectedObject?.dataLink?selectedObject?.dataLink:false}); // [{x:0, y:0}, {x:10, y:10},...]
    }
});

canvas.on('mouse:down', function (options) {
    if (drawingObject.type == "roof") {
        canvas.selection = false;
        setStartingPoint(options); // set x,y
        // x = options.pointer.x;
        // y = options.pointer.y;

        roofPoints.push(new Point(x, y));
        var points = [x, y, x, y];
        lines.push(new fabric.Line(points, {
            strokeWidth: 1,
            selectable: false,
            stroke: 'red'
        }).setOriginX(x).setOriginY(y));
        canvas.add(lines[lineCounter]);
        lineCounter++;
        canvas.on('mouse:up', function (options) {
            canvas.selection = true;
        });
    }
});
canvas.on('mouse:move', function (options) {
    if (lines[0] !== null && lines[0] !== undefined && drawingObject.type == "roof") {
        setStartingPoint(options);
        // x = options.pointer.x;
        // y = options.pointer.y;

        lines[lineCounter - 1].set({
            x2: x,
            y2: y
        });
        canvas.renderAll();
    }
});

function setStartingPoint(options) {
    var offset = $('#canvas-tools').offset();
    x = options.e.pageX - offset.left;
    y = options.e.pageY - offset.top;
}

function makeRoof(roofPoints) {

    var left = findLeftPaddingForRoof(roofPoints);
    var top = findTopPaddingForRoof(roofPoints);
    roofPoints.push(new Point(roofPoints[0].x,roofPoints[0].y))
    var roof = new fabric.Polyline(roofPoints, {
    fill: 'rgba(0,0,0,0)',
    // fill: "transparent",
    stroke:'#58c'
    });
    roof.set({
        left: left,
        top: top,
    });


    return roof;
} // makeRoof

// function makeRoof(roofPoints) {
//     roofPoints.push(new Point(roofPoints[0].x, roofPoints[0].y));
//     var roof = new fabric.Polyline(roofPoints, {
//         fill: 'rgba(0,0,0,0)',
//         stroke: '#58c'
//     });
//     return roof;
// }


function findTopPaddingForRoof(roofPoints) {
    var result = 999999;
    for (var f = 0; f < lineCounter; f++) {
        if (roofPoints[f].y < result) {
            result = roofPoints[f].y;
        }
    }
    return Math.abs(result);
}

function findLeftPaddingForRoof(roofPoints) {
    var result = 999999;
    for (var i = 0; i < lineCounter; i++) {
        if (roofPoints[i].x < result) {
            result = roofPoints[i].x;
        }
    }
    return Math.abs(result);
}