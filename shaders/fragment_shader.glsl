#version 300 es

precision mediump float;

in vec3 fsNormal;
in vec2 uvFS;
out vec4 outColor;

uniform sampler2D u_texture;

uniform vec3 mDiffColor; //material diffuse color 
uniform vec3 lightDirection; // directional light direction vec
uniform vec3 lightColor; //directional light color
uniform vec3 ambientLight;
uniform vec3 ambientColor; 

void main() {
  vec3 nNormal = normalize(fsNormal);
  vec3 lambertColor = mDiffColor * lightColor * dot(-lightDirection,nNormal);
  vec3 ambient = ambientLight * ambientColor;
  outColor = texture(u_texture, uvFS) * vec4(clamp(lambertColor + ambient, 0.00, 1.0),1.0);
}