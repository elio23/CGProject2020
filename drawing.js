let gl;
let baseDir;
let shaderDir;
let program;

let viewMatrix;
let perspectiveMatrix;


let objects = [];

//Parameters for Camera
let cx = -40.0;
let cy = 25.0;
let cz = 0.0;
let elevation = -20.0;
let angle = 90.0;
let roll = 0.01;

//object used to store model data after being loaded
let loadedModelData = function (vao, indicesLength, textures) {
    this.vao = vao;
    this.indicesLength = indicesLength;
    this.textures = textures;
};


function main() {

    //Setting up mouse events
    let canvas = document.getElementById("c");
    canvas.addEventListener("mousedown", doMouseDown, false);
    canvas.addEventListener("mouseup", doMouseUp, false);
    canvas.addEventListener("mousemove", doMouseMove, false);

    //Setting up keyboard events
    //'window' is a JavaScript object (if "canvas", it will not work)
    window.addEventListener("keyup", keyFunctionUp, false);
    window.addEventListener("keydown", keyFunctionDown, false);
    window.addEventListener("mouseup", raycastMouseUp);

    //Setting up lights
    let dirLightAlpha = -utils.degToRad(60);
    let dirLightBeta = -utils.degToRad(120);
    let directionalLight = [Math.cos(dirLightAlpha) * Math.cos(dirLightBeta),
        Math.sin(dirLightAlpha), Math.cos(dirLightAlpha) * Math.sin(dirLightBeta)];
    let directionalLightColor = [1.0, 1.0, 1.0];


    //SET Global states (viewport size, viewport background color, Depth test)
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.85, 0.85, 0.85, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    //get uniforms from shaders
    let matrixLocation = gl.getUniformLocation(program, "matrix");
    let materialDiffColorHandle = gl.getUniformLocation(program, 'mDiffColor');
    let lightDirectionHandle = gl.getUniformLocation(program, 'lightDirection');
    let lightColorHandle = gl.getUniformLocation(program, 'lightColor');
    let normalMatrixPositionHandle = gl.getUniformLocation(program, 'nMatrix');

    //uniform for textures location
    let textLocation = gl.getUniformLocation(program, "u_texture");

    //Solved in one cycle, no more referencing to variable names, but Object fields...
    Object.keys(models).forEach(k => {
        models[k].model = loaders.loadModel(gl, program, models[k].data, models[k].modelTextures)
    })

    // ...Apart from this, used for roomNode
    let bed = loaders.loadModel(gl, program, models["bed"].data, models["bed"].modelTextures);

    //-------------Define the scene Graph----------------

    let roomNode = new Node();
    roomNode.localMatrix = getLocalMatrix([0.0, 0.0, 0.0], [0.0, 0.0, 0.0], [1, 1, 1]);
    roomNode.drawInfo = {
        materialColor: [1.0, 1.0, 1.0],
        programInfo: program,
        bufferLength: indexData.length,
        vertexArray: bed.vao,
        indicesLength: bed.indicesLength,
        textures: bed.textures,
    };

    objects.push(roomNode);

    const setGraph = (items, rootNode, list) => {
        items.forEach(item => {

            let itemNode = new Node();
            let itemBody = new Node();

            let model = models[item.model].model

            itemNode.localMatrix = getLocalMatrix(
                item.parent.position,
                [0.0, 0.0, 0.0],
                [1.0, 1.0, 1.0]
            );
            itemNode.collider = [item.parent.position, 3.0]

            itemBody.localMatrix = getLocalMatrix(
                item.body.position,
                item.body.rotation,
                item.body.scale
            );

            itemBody.drawInfo = {
                materialColor: [1.0, 1.0, 1.0],
                programInfo: program,
                bufferLength: indexData.length,
                vertexArray: model.vao,
                indicesLength: model.indicesLength,
                textures: model.textures,
                currentTextureIndex: 0, // default texture loaded is the one at index 0 of the textures array
            };

            itemBody.setParent(itemNode);
            itemNode.setParent(rootNode);

            list.push(itemBody);

        })
    }
    setGraph(items, roomNode, objects)
    //---------------SceneGraph defined-------------------

    requestAnimationFrame(drawScene);

    // Draw the scene called for each frame
    function drawScene(time) {
        time *= 0.001;

        gl.clearColor(0.85, 0.85, 0.85, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //compute aspect ratio
        let aspect = gl.canvas.width / gl.canvas.height;

        //compute new camera position
        if (movingRight) moveCameraRight();
        if (movingLeft) moveCameraLeft();
        if (movingForward) moveCameraForward();
        if (movingBackward) moveCameraBackward();


        //compute viewMatrix for camera
        viewMatrix = utils.multiplyMatrices(
            utils.MakeRotateZMatrix(-roll), utils.MakeView(cx, cy, cz, elevation, angle));

        // Update all world matrices in the scene graph
        roomNode.updateWorldMatrix();

        // Compute all the matrices for rendering
        objects.forEach(function (object) {

            gl.useProgram(object.drawInfo.programInfo);

            perspectiveMatrix = utils.MakePerspective(60, aspect, 1.0, 2000.0);

            let projectionMatrix = utils.multiplyMatrices(viewMatrix, object.worldMatrix);
            projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, projectionMatrix);
            let normalMatrix = utils.invertMatrix(utils.transposeMatrix(object.worldMatrix));

            gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
            gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalMatrix));

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, object.drawInfo.textures[object.drawInfo.currentTextureIndex]); // default texture loaded is the one at index 0 of the textures array
            gl.uniform1i(textLocation, 0);

            gl.uniform3fv(materialDiffColorHandle, object.drawInfo.materialColor);
            gl.uniform3fv(lightColorHandle, directionalLightColor);
            gl.uniform3fv(lightDirectionHandle, directionalLight);

            gl.bindVertexArray(object.drawInfo.vertexArray);
            gl.drawElements(gl.TRIANGLES, object.drawInfo.indicesLength, gl.UNSIGNED_SHORT, 0);
        });

        requestAnimationFrame(drawScene);
    }
}

async function init() {
    let path = window.location.pathname;
    let page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '');
    console.log("basedir = " + baseDir);
    shaderDir = baseDir + "shaders/";

    let canvas = document.getElementById("c");
    gl = canvas.getContext("webgl2");
    if (!gl) {
        document.write("GL context not opened");
        return;
    }
    utils.resizeCanvasToDisplaySize(gl.canvas);

    await utils.loadFiles([shaderDir + 'vs.glsl', shaderDir + 'fs.glsl'], function (shaderText) {
        console.log(shaderText[0]);
        console.log(shaderText[1]);
        let vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
        let fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);

        program = utils.createProgram(gl, vertexShader, fragmentShader);
    });

    gl.useProgram(program);

    for (const k of Object.keys(models)) {
        await utils.get_json(models[k].modelStr, (data) => {
            models[k].data = data;
        })
    }

    main();
}

window.onload = init();

function getLocalMatrix(position, rotation, scale) {
    let matricesList = [
        utils.MakeScaleMatrix(scale[0], scale[1], scale[2]),
        utils.MakeRotateXMatrix(rotation[0]),
        utils.MakeRotateYMatrix(rotation[1]),
        utils.MakeRotateZMatrix(rotation[2]),
        utils.MakeTranslateMatrix(position[0], position[1], position[2]),
    ];
    return utils.multiplyListOfMatrices(matricesList);
}
