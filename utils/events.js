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


let velocity = 0.3;
let movingRight = false;
let movingLeft = false;
let movingForward = false;
let movingBackward = false;

function moveCameraForward() {
    //console.log("direction = " +  angle);
    cz = cz - Math.cos(utils.degToRad(angle)) * velocity;
    cx = cx + Math.sin(utils.degToRad(angle)) * velocity;
}

function moveCameraLeft() {
    //console.log("direction = " +  angle);
    cz = cz + Math.cos(utils.degToRad(angle + 90)) * velocity;
    cx = cx - Math.sin(utils.degToRad(angle + 90)) * velocity;
}

function moveCameraRight() {
    //console.log("direction = " +  angle);
    cz = cz + Math.cos(utils.degToRad(angle - 90)) * velocity;
    cx = cx - Math.sin(utils.degToRad(angle - 90)) * velocity;
}

function moveCameraBackward() {
    //console.log("direction = " +  angle);
    cz = cz - Math.cos(utils.degToRad(angle + 180)) * velocity;
    cx = cx + Math.sin(utils.degToRad(angle + 180)) * velocity;
}
