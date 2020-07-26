function raySphereIntersection(rayStartPoint, rayNormalisedDir, sphereCentre, sphereRadius, i){
    let l = [sphereCentre[0] - rayStartPoint[0], sphereCentre[1] - rayStartPoint[1], sphereCentre[2] - rayStartPoint[2]];
    let l_squared = l[0] * l[0] + l[1] * l[1] + l[2] * l[2];
    if(l_squared < (sphereRadius*sphereRadius)){
        console.log("ray origin inside sphere: " + i);
        return true;
    }
    let s = l[0] * rayNormalisedDir[0] + l[1] * rayNormalisedDir[1] + l[2] * rayNormalisedDir[2];
    if(s < 0){
        console.log("sphere behind ray origin: " + i);
        return false;
    }
    let m_squared = l_squared - (s*s);
    if(m_squared > (sphereRadius*sphereRadius)){
        console.log("m squared > r squared: " + i);
        return false;
    }
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
        if(collider!=null){
            let hit = raySphereIntersection(rayStartPoint, normalisedRayDir, collider[0], collider[1], i);
            if (hit) {
                console.log("hit sphere number "+i);
                console.log(objects[i])
                //colours[i] = [Math.random(), Math.random(), Math.random(), 1];
                document.getElementById("selected").innerText = objects[i].parent.label

                //create textures selection drop-down menu
                dropDownMenu(i);

                //create sliders to change material color
                sliders(i);
            }
            else {
            }
        }
    }
}

function dropDownMenu(i){
    var dropDown = document.getElementById("drop-down");
    dropDown.innerHTML="";
    dropDown.setAttribute("onchange","onDropdownChange("+i+",this.value);");
    objects[i].drawInfo.textures.forEach((texture)=>{
        var textureIndex = objects[i].drawInfo.textures.indexOf(texture);
        var option = document.createElement("option");
        option.setAttribute("value",textureIndex);    //"objectIndex - textureIndex"
        option.innerText=models[items[i].model].modelTextures[textureIndex];
        if(objects[i].drawInfo.textures.indexOf(texture) === objects[i].drawInfo.currentTextureIndex) option.selected="selected";
        dropDown.appendChild(option);
    });
}

function  sliders(i) {
    var sliders = document.getElementById("slider1");
    sliders.innerHTML="";

    for(let j=0;j<3;j++){
        switch (j) {
            case 0: var label = document.createElement("span");
                    sliders.appendChild(label);
                    label.innerText = "R ";
                    break;
            case 1: var label = document.createElement("span");
                    sliders.appendChild(label);
                    label.innerText = "G ";
                    break;
            case 2: var label = document.createElement("span");
                    sliders.appendChild(label);
                    label.innerText = "B ";
                    break;
        }
        let slide = document.createElement("input");
        slide.setAttribute("type","range");
        slide.setAttribute("min","0");
        slide.setAttribute("max","1");
        slide.setAttribute("step","0.1");
        slide.setAttribute("value",objects[i].drawInfo.materialColor[j]);
        slide.setAttribute("onchange","onSliderChange("+i+","+j+",this.value);");
        sliders.appendChild(slide);
        sliders.appendChild(document.createElement("br"));
    }
}