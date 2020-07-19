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
let loadedModelData = function(vao,indicesLength,textures) {
  this.vao = vao;
  this.indicesLength = indicesLength;
  this.textures = textures;
};

//---------3D Models declarations---------------
let bedModel;
let bedModelStr = 'models/bed/bed.json';
let bedModelTexture = 'models/bed/bed_d.png';

let chairModel;
let chairModelStr = 'models/chair/chair.json';
let chairModelTexture = 'models/chair/chair.png';

let closetModel;
let closetModelStr = 'models/closet/closet.json';
let closetModelTexture = 'models/closet/closet.png';

let sofaModel;
let sofaModelStr = 'models/sofa/sofa.json';
let sofaModelTexture1 = 'models/sofa/verde.jpg';
let sofaModelTexture2 = 'models/sofa/url.jpg';
let sofaModelTexture3 = 'models/sofa/bianco.jpg';
let sofaModelTexture4 = 'models/sofa/TEXT_MDF.jpg';

let sofa2Model;
let sofa2ModelStr = 'models/sofa2/sofa2.json';
let sofa2ModelTexture = 'models/sofa2/mufiber03.png';


let tableModel;
let tableModelStr = 'models/table/wooden-coffe-table.json';
let tableModelTexture = 'models/table/wooden-coffe-table.jpg';

let wallModel;
let wallModelStr = 'models/empty_room/EmptyRoom.json';
let wallModelTexture = 'models/empty_room/Wall.jpg';
let floorModelTexture = 'models/empty_room/Floor.jpg'

//TODO for each 3d model
//...

//----------------------------------------------

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

  //Setting up lights
  let dirLightAlpha = -utils.degToRad(60);
  let dirLightBeta  = -utils.degToRad(120);
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


  //-----------------loading models--------------------
  let bed = loaders.loadModel(gl, program, bedModel,[bedModelTexture]);
  let chair = loaders.loadModel(gl, program, chairModel,[chairModelTexture]);
  let closet = loaders.loadModel(gl, program, closetModel,[closetModelTexture]);
  let sofa = loaders.loadModel(gl, program, sofaModel,[sofaModelTexture1, sofaModelTexture2, sofaModelTexture3, sofaModelTexture4]); //Actually this is a 3d pallet model with a sofa texture
  let sofa2 = loaders.loadModel(gl, program, sofa2Model,[sofa2ModelTexture, sofaModelTexture1, sofaModelTexture2, sofaModelTexture3, sofaModelTexture4]);


  //let table = loadModel(tableModel, [tableModelTexture])
  let wall = loaders.loadModel(gl, program, wallModel, [wallModelTexture])
  let floor = loaders.loadModel(gl, program, wallModel, [floorModelTexture])
  //TODO for each furniture model
  //....
  //---------------------------------------------------


  let items = [
    /*{
      parent: {
        position: [-9, 0, 5],
      },
      body: {
        position: [0,0,0],
        rotation: [0,0,0],
        scale: [8, 8, 8]
      },
      model: wall,
    },
    {
      parent: {
        position: [-9, 0, 5],
      },
      body: {
        position: [],
        rotation: [],
        scale: [8, 8, 8]
      },
      model: wall,
    },*/
    {
      parent: {
        position: [-9, -0.5, -61],
      },
      body: {
        position: [0, 0, 0],
        rotation: [0, 90, 0],
        scale: [20, 20, 20]
      },
      model: wall,
    },
    {
      parent: {
        position: [66, -1.0, -61.5],
      },
      body: {
        position: [0, 0, 0],
        rotation: [0, 90, 0],
        scale: [20, 20, 20]
      },
      model: wall,
    },
    {
      parent: {
        position: [-9, -0.5, 89],
      },
      body: {
        position: [0, 0, 0],
        rotation: [0, 90, 0],
        scale: [20, 20, 20]
      },
      model: wall,
    },
    {
      parent: {
        position: [66, -1.0, 89.5],
      },
      body: {
        position: [0, 0, 0],
        rotation: [0, 90, 0],
        scale: [20, 20, 20]
      },
      model: wall,
    },
    {
      parent: {
        position: [-50, 210, 50],
      },
      body: {
        position: [0, 0, 0],
        rotation: [0, 0, 90],
        scale: [100, 100, 100]
      },
      model: floor,
    },
    {
      parent: {
        position: [-89.5, 0.5, 95],
      },
      body: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [20, 20, 20]
      },
      model: wall,
    },
    {
      parent: {
        position: [-90, 0, 20],
      },
      body: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [20, 20, 20]
      },
      model: wall,
    },
    {
      parent: {
        position: [60.5, 0.5, 95],
      },
      body: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [20, 20, 20]
      },
      model: wall,
    },
    {
      parent: {
        position: [60, 0, 20],
      },
      body: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [20, 20, 20]
      },
      model: wall,
    },
    {
      parent: {
        position: [-9.0, 0.0, 5.0],
      },
      body: {
        position: [0.0, 0.1, 0.0],
        rotation: [0.0, 0.0, 0.0],
        scale: [8.0, 8.0, 8.0]
      },
      model: bed,
    },
    {
      parent: {
        position: [51.0, 0.0, -10.0],
      },
      body: {
        position: [0.0, -5.0, 0.0],
        rotation: [0.0, 180.0, 0.0],
        scale: [1.0, 1.0, 1.0]
      },
      model: sofa,
    },
    {
      parent: {
        position: [0.0, 0.0, 30.0],
      },
      body: {
        position: [0.0, 0.0, -1.0],
        rotation: [0.0, 180.0, 0.0],
        scale: [12.0, 12.0, 12.0]
      },
      model: sofa2,
    },
    {
      parent: {
        position: [1.0, 0.0, -10.0],
      },
      body: {
        position: [100.0, 0.0, 0.0],
        rotation: [-90.0, 0.0, 0.0],
        scale: [0.1, 0.1, 0.1]
      },
      model: chair,
    },
    {
      parent: {
        position: [31.0, 0.0, -10.0],
      },
      body: {
        position: [0.0, 0.62, 0.0],
        rotation: [0.0, 180.0, 0.0],
        scale: [27.0, 27.0, 27.0]
      },
      model: closet,
    },
    /*{
      parent: {
        position: [0.0, 0.0, 50.0],
      },
      body: {
        position: [0.0, 0.62, 0.0],
        rotation: [0.0, 180.0, 0.0],
        scale: [10.0, 10.0, 10.0]
      },
      model: table,
    },*/
  ]

  //-------------Define the scene Graph----------------

  let roomNode = new Node ();
  roomNode.localMatrix = getLocalMatrix([0.0,0.0,0.0],[0.0,0.0,0.0], [1,1,1]);
  roomNode.drawInfo = {
    materialColor: [1.0,1.0,1.0],
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

      itemNode.localMatrix = getLocalMatrix(
          item.parent.position,
          [0.0,0.0,0.0],
          [1.0, 1.0, 1.0]
      );
      itemNode.collider = [item.parent.position, 3.0]

      itemBody.localMatrix = getLocalMatrix(
          item.body.position,
          item.body.rotation,
          item.body.scale
      );

      itemBody.drawInfo = {
        materialColor: [1.0,1.0,1.0],
        programInfo: program,
        bufferLength: indexData.length,
        vertexArray: item.model.vao,
        indicesLength: item.model.indicesLength,
        textures: item.model.textures,
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
    if(movingRight) moveCameraRight();
    if(movingLeft) moveCameraLeft();
    if(movingForward) moveCameraForward();
    if(movingBackward) moveCameraBackward();


    //compute viewMatrix for camera
    viewMatrix = utils.multiplyMatrices(
        utils.MakeRotateZMatrix(-roll),utils.MakeView(cx, cy, cz, elevation, angle));

    // Update all world matrices in the scene graph
    roomNode.updateWorldMatrix();

    // Compute all the matrices for rendering
    objects.forEach(function(object) {

      gl.useProgram(object.drawInfo.programInfo);

      perspectiveMatrix = utils.MakePerspective(60,aspect,1.0,2000.0);

      let projectionMatrix = utils.multiplyMatrices(viewMatrix, object.worldMatrix);
      projectionMatrix = utils.multiplyMatrices(perspectiveMatrix,projectionMatrix);
      let normalMatrix = utils.invertMatrix(utils.transposeMatrix(object.worldMatrix));

      gl.uniformMatrix4fv(matrixLocation, gl.FALSE, utils.transposeMatrix(projectionMatrix));
      gl.uniformMatrix4fv(normalMatrixPositionHandle, gl.FALSE, utils.transposeMatrix(normalMatrix));

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, object.drawInfo.textures[object.drawInfo.currentTextureIndex]); // default texture loaded is the one at index 0 of the textures array
      gl.uniform1i(textLocation, 0);

      gl.uniform3fv(materialDiffColorHandle, object.drawInfo.materialColor);
      gl.uniform3fv(lightColorHandle,  directionalLightColor);
      gl.uniform3fv(lightDirectionHandle,  directionalLight);

      gl.bindVertexArray(object.drawInfo.vertexArray);
      gl.drawElements(gl.TRIANGLES, object.drawInfo.indicesLength, gl.UNSIGNED_SHORT, 0 );
    });

    requestAnimationFrame(drawScene);
  }
}

async function init(){
    let path = window.location.pathname;
    let page = path.split("/").pop();
    baseDir = window.location.href.replace(page, '');
    console.log("basedir = " + baseDir);
    shaderDir = baseDir+"shaders/";

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

  //################################# Load Models #####################################
  //This loads the json model in the models letiables previously declared

  //JSON models
  await utils.get_json(bedModelStr, function(loadedModel){bedModel = loadedModel;});
  await utils.get_json(chairModelStr, function(loadedModel){chairModel = loadedModel;});
  await utils.get_json(closetModelStr, function(loadedModel){closetModel = loadedModel;});
  await utils.get_json(sofaModelStr, function(loadedModel){sofaModel = loadedModel;});
  await utils.get_json(sofa2ModelStr, function(loadedModel){sofa2Model = loadedModel;});
  //await utils.get_json(tableModelStr, function(loadedModel){tableModel = loadedModel;});
  await utils.get_json(wallModelStr, function(loadedModel){wallModel = loadedModel;});
  //await utils.get_json(sofa3ModelStr, function(loadedModel){sofa3Model = loadedModel;});




  //Obj models
  /*let tableObjStr = await utils.get_objstr(baseDir+ tableModelStr);
  tableModel = new OBJ.Mesh(tableObjStr);*/
  //...

  //TODO for each 3d model
  //...
  //###################################################################################

    main();
}

window.onload = init();

function getLocalMatrix(position,rotation,scale){
  let matricesList = [
      utils.MakeScaleMatrix(scale[0],scale[1],scale[2]),
      utils.MakeRotateXMatrix(rotation[0]),
      utils.MakeRotateYMatrix(rotation[1]),
      utils.MakeRotateZMatrix(rotation[2]),
      utils.MakeTranslateMatrix(position[0],position[1],position[2]),
  ];
  return utils.multiplyListOfMatrices(matricesList);
}

//----------------------------Mouse events functions-------------------------------------------
let mouseState = false;
let lastMouseX = -100, lastMouseY = -100;
const maxElevation = 60;  //max angle for elevation (to limit vertical camera rotations)
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
  if(mouseState) {
    let dx = event.pageX - lastMouseX;
    let dy = lastMouseY - event.pageY;
    lastMouseX = event.pageX;
    lastMouseY = event.pageY;

    if((dx !== 0) || (dy !== 0)) {
      angle = angle + 0.5 * dx;
      elevation = elevation + ((Math.abs(elevation + 0.5*dy)>maxElevation)?0:0.5*dy); //limit vertical rotations
    }
  }
}
//------------------------------------------------------------------------------------------------

//-------------------------------------Input keys-------------------------------------------------
let keys = [];

let keyFunctionDown =function(e) {
  if(!keys[e.keyCode]) {
    keys[e.keyCode] = true;
    switch(e.keyCode) {
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
    }
  }
//console.log(e.keyCode);
};

let keyFunctionUp =function(e) {
  if(keys[e.keyCode]) {
    keys[e.keyCode] = false;
    switch(e.keyCode) {
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
//console.log(e.keyCode);
};

//-------------------------------------------------------------------------------------------------

//--------------------------First person camera movements------------------------------------------
let velocity = 0.3;
let movingRight = false;
let movingLeft = false;
let movingForward = false;
let movingBackward = false;

function moveCameraForward(){
  //console.log("direction = " +  angle);
  cz= cz - Math.cos(utils.degToRad(angle))*velocity;
  cx= cx + Math.sin(utils.degToRad(angle))*velocity;
}

function moveCameraLeft(){
  //console.log("direction = " +  angle);
  cz= cz + Math.cos(utils.degToRad(angle+90))*velocity;
  cx= cx - Math.sin(utils.degToRad(angle+90))*velocity;
}

function moveCameraRight(){
  //console.log("direction = " +  angle);
  cz= cz + Math.cos(utils.degToRad(angle-90))*velocity;
  cx= cx - Math.sin(utils.degToRad(angle-90))*velocity;
}

function moveCameraBackward(){
  //console.log("direction = " +  angle);
  cz= cz - Math.cos(utils.degToRad(angle+180))*velocity;
  cx= cx + Math.sin(utils.degToRad(angle+180))*velocity;
}
