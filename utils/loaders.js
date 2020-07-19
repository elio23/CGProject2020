let path = window.location.pathname.split("/").pop();
baseDir = window.location.href.replace(path, '');

const loaders = {

    loadModel: function(gl, program, model, modelTextures) {

        //get uniforms from shaders
        let positionAttributeLocation = gl.getAttribLocation(program, "inPosition");
        let normalAttributeLocation = gl.getAttribLocation(program, "inNormal");
        let uvAttributeLocation = gl.getAttribLocation(program, "a_uv");

        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        //Here we extract the position of the vertices, the normals, the indices, and the uv coordinates
        let vertices, normals, indices, texCoords;
        if (model.meshes == null) {
            //Obj model
            vertices = model.vertices;
            normals = model.normals;
            indices = model.indices;
            texCoords = model.textures;
        } else {
            //Json model
            console.log(model);
            vertices = model.meshes[0].vertices;
            normals = model.meshes[0].normals;
            indices = [].concat.apply([], model.meshes[0].faces);
            texCoords = (model.meshes[0].texturecoords != null) ? model.meshes[0].texturecoords[0] : null;
        }

        gl.bindVertexArray(vao);
        let positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        let normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(normalAttributeLocation);
        gl.vertexAttribPointer(normalAttributeLocation, 3, gl.FLOAT, false, 0, 0);

        if (texCoords != null) {
            let uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(uvAttributeLocation);
            gl.vertexAttribPointer(uvAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        }

        let indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        let textures = [];
        modelTextures.forEach((texture) => {
            textures.push(this.loadTexture(gl, texture));
        });

        return new loadedModelData(vao, indices.length, textures);

    },

    /**Function used to load a texture*/
    loadTexture: function(gl, modelTexture) {
        let texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);

        let image = new Image();
        image.src = baseDir + modelTexture;
        image.onload = function () {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);
        };
        return texture;
    }

}
