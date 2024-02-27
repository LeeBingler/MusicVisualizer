uniform sampler2D uTexture;
uniform float uTime;
uniform float uAudioFrequency;

void main() {
    vec2 uv = gl_PointCoord;
    uv.y = 1.0 - uv.y;
    float pattern = 1.0 - texture2D(uTexture, uv).r;


    float time = uTime * (1.0 + uAudioFrequency);

    vec3 color = mix(vec3(0.2, 0.3, 0.9), vec3(0.4, 1.0, 0.3), uAudioFrequency);
    color.r *= 0.9 + sin(time) / 3.2;
    color.g *= 1.1 + cos(time / 2.0) / 2.5;
    color.b *= 0.8 + cos(time / 5.0) / 4.0;

    color.rgb += 0.1;

    color *= pattern;

    gl_FragColor = vec4(vec3(color), 1.0);
}
