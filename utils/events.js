let mouseState = false;
let lastMouseX = -100, lastMouseY = -100;
const maxElevation = 60;


function toggleMenu() {
    let legend = document.getElementById("legend");
    if (legend.style.display === "none") {
        legend.style.display = "block";
    }
    else legend.style.display = "none";
}


function doMouseDown(event) {
    lastMouseX = event.pageX;
    lastMouseY = event.pageY;
    mouseState = true;
}

function doMouseUp(event) {
    lastMouseX = -100;
    lastMouseY = -100;
    mouseState = false;
}

function doMouseMove(event) {
    if (mouseState) {
        let dx = event.pageX - lastMouseX;
        let dy = lastMouseY - event.pageY;
        lastMouseX = event.pageX;
        lastMouseY = event.pageY;

        if ((dx !== 0) || (dy !== 0)) {
            angle = angle + 0.5 * dx;
            elevation = elevation + ((Math.abs(elevation + 0.5 * dy) > maxElevation) ? 0 : 0.5 * dy);
        }
    }
}

let keys = [];

let keyFunctionDown = function (e) {
    if (!keys[e.keyCode]) {
        keys[e.keyCode] = true;
        switch (e.keyCode) {
            case 37:
                //console.log("KeyUp   - Dir LEFT");
                movingLeft = true;
                break;
            case 39:
                //console.log("KeyUp   - Dir RIGHT");
                movingRight = true;
                break;
            case 38:
                //console.log("KeyUp   - Dir UP");
                movingForward = true;
                break;
            case 40:
                //console.log("KeyUp   - Dir DOWN");
                movingBackward = true;
                break;
            case 65:
                //console.log("KeyUp   - Dir LEFT");
                movingLeft = true;
                break;
            case 68:
                //console.log("KeyUp   - Dir RIGHT");
                movingRight = true;
                break;
            case 87:
                //console.log("KeyUp   - Dir UP");
                movingForward = true;
                break;
            case 83:
                //console.log("KeyUp   - Dir DOWN");
                movingBackward = true;
                break;
            case 77:
                console.log("pressed m")
                toggleMenu();
                break;
        }
    }
//console.log(e.keyCode);
};

let keyFunctionUp = function (e) {
    if (keys[e.keyCode]) {
        keys[e.keyCode] = false;
        switch (e.keyCode) {
            case 37:
                //console.log("KeyUp   - Dir LEFT");
                movingLeft = false;
                break;
            case 39:
                //console.log("KeyUp   - Dir RIGHT");
                movingRight = false;
                break;
            case 38:
                //console.log("KeyUp   - Dir UP");
                movingForward = false;
                break;
            case 40:
                //console.log("KeyUp   - Dir DOWN");
                movingBackward = false;
                break;
            case 65:
                //console.log("KeyUp   - Dir LEFT");
                movingLeft = false;
                break;
            case 68:
                //console.log("KeyUp   - Dir RIGHT");
                movingRight = false;
                break;
            case 87:
                //console.log("KeyUp   - Dir UP");
                movingForward = false;
                break;
            case 83:
                //console.log("KeyUp   - Dir DOWN");
                movingBackward = false;
                break;
        }
    }
};


let velocity = 0.5;
let roomXConstraints =[-44.7,99.25]; //range of camera movement along x axis (it derives from room size)
let roomZConstraints =[-15.25,79.47];//range of camera movement along y axis (it derives from room size)
let movingRight = false;
let movingLeft = false;
let movingForward = false;
let movingBackward = false;

function moveCameraForward() {
    //console.log("direction = " +  angle);
    //console.log("camera position: " + cx + ", " + cz);
    var cPos = limitMovementsInsideRoom(
        cz - Math.cos(utils.degToRad(angle)) * velocity,
        cx + Math.sin(utils.degToRad(angle)) * velocity);
    cz = cPos[0];
    cx = cPos[1];
}

function moveCameraLeft() {
    //console.log("direction = " +  angle);
    //console.log("camera position: " + cx + ", " + cz);
    var cPos = limitMovementsInsideRoom(
        cz + Math.cos(utils.degToRad(angle + 90)) * velocity,
        cx - Math.sin(utils.degToRad(angle + 90)) * velocity);
    cz = cPos[0];
    cx = cPos[1];
}

function moveCameraRight() {
    //console.log("direction = " +  angle);
    //console.log("camera position: " + cx + ", " + cz);
    var cPos = limitMovementsInsideRoom(
        cz + Math.cos(utils.degToRad(angle - 90)) * velocity,
        cx - Math.sin(utils.degToRad(angle - 90)) * velocity);
    cz = cPos[0];
    cx = cPos[1];
}

function moveCameraBackward() {
    //console.log("direction = " +  angle);
    //console.log("camera position: " + cx + ", " + cz);
    var cPos = limitMovementsInsideRoom(
        cz - Math.cos(utils.degToRad(angle + 180)) * velocity,
        cx + Math.sin(utils.degToRad(angle + 180)) * velocity);
    cz = cPos[0];
    cx = cPos[1];
}

//limit camera movements inside room, it returns the constrained [cz,cx] camera position
function limitMovementsInsideRoom(cz,cx){
    var cPos = [cz,cx];
    if(cz<roomZConstraints[0]) cPos[0] = roomZConstraints[0];
    else  if (cz>roomZConstraints[1]) cPos[0] = roomZConstraints[1];
    if(cx<roomXConstraints[0]) cPos[1] = roomXConstraints[0];
    else  if (cx>roomXConstraints[1]) cPos[1] = roomXConstraints[1];
    return cPos;
}
