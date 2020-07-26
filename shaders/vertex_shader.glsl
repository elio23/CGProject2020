#version 300 es

in vec3 inPosition;
in vec3 inNormal;
in vec2 a_uv;
out vec2 uvFS;
out vec3 fsNormal;

uniform mat4 matrix; 
uniform mat4 nMatrix;     //matrix to transform normals

void main() {
  uvFS = a_uv;
  fsNormal = mat3(nMatrix) * inNormal; 
  gl_Position = matrix * vec4(inPosition, 1.0);
}