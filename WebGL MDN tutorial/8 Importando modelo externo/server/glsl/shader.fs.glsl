precision mediump float;

uniform sampler2D uSampler0;

varying vec2 vTexCoord;

void main() {
  vec4 tex0 = texture2D(uSampler0, vTexCoord);
  gl_FragColor = vec4(lightColor, tex0.a);
}