precision mediump float;

uniform sampler2D u_tex;
uniform float u_mix;
varying vec2 v_texcoord;

float bayerDither(vec2 pos) {
  int x = int(mod(pos.x, 4.0));
  int y = int(mod(pos.y, 4.0));
  int index = x + y * 4;
  int threshold[16] = int[16](
    0,  8,  2, 10,
    12, 4, 14, 6,
    3, 11, 1, 9,
    15, 7, 13, 5
  );
  return float(threshold[index]) / 16.0;
}

void main() {
  vec4 color = texture2D(u_tex, v_texcoord);
  float gray = dot(color.rgb, vec3(0.3, 0.59, 0.11));
  float d = bayerDither(gl_FragCoord.xy * 0.25);
  float result = step(d, gray);
  vec3 dithered = vec3(result) * vec3(0.7, 0.75, 1.0);
  gl_FragColor = mix(color, vec4(dithered, 1.0), u_mix);
}
