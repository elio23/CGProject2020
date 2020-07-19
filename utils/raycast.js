function raySphereIntersection(rayStartPoint, rayNormalisedDir, sphereCentre, sphereRadius){
    let l = [sphereCentre[0] - rayStartPoint[0], sphereCentre[1] - rayStartPoint[1], sphereCentre[2] - rayStartPoint[2]];
    let l_squared = l[0] * l[0] + l[1] * l[1] + l[2] * l[2];
    if(l_squared < (sphereRadius*sphereRadius)){
        console.log("ray origin inside sphere");
        return true;
    }
    let s = l[0] * rayNormalisedDir[0] + l[1] * rayNormalisedDir[1] + l[2] * rayNormalisedDir[2];
    if(s < 0){
        console.log("sphere behind ray origin");
        return false;
    }
    let m_squared = l_squared - (s*s);
    if(m_squared > (sphereRadius*sphereRadius)){
        console.log("m squared > r squared");
        return false;
    }
    console.log("hit");
    return true;

}

function raycastMouseUp(ev){
    let top = 0.0, left = 0.0;
    let canvas = gl.canvas;
    while (canvas && canvas.tagName !== 'BODY') {
        top += canvas.offsetTop;
        left += canvas.offsetLeft;
        canvas = canvas.offsetParent;
    }
    console.log("left "+left+" top "+top);
    let x = ev.clientX - left;
    let y = ev.clientY - top;

    let normX = (2*x)/ gl.canvas.width - 1;
    let normY = 1 - (2*y) / gl.canvas.height;

    let projInv = utils.invertMatrix(perspectiveMatrix);
    let viewInv = utils.invertMatrix(viewMatrix);

    let pointEyeCoords = utils.multiplyMatrixVector(projInv, [normX, normY, -1, 1]);
    let rayEyeCoords = [pointEyeCoords[0], pointEyeCoords[1], pointEyeCoords[2], 0];

    let rayDir = utils.multiplyMatrixVector(viewInv, rayEyeCoords);
    let normalisedRayDir = utils.normalize(rayDir);
    let rayStartPoint = [cx, cy, cz];

    for(let i = 1; i < objects.length; i++){
        let collider = objects[i].parent.collider
        let hit = raySphereIntersection(rayStartPoint, normalisedRayDir, collider[0], collider[1]);
        if (hit) {
            console.log("hit sphere number "+i);
            colours[i] = [Math.random(), Math.random(), Math.random(), 1];
        }
    }
}
