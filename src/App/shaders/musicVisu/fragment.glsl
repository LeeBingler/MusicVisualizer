varying vec2 vUv;
varying float vPattern;

uniform float uTime;
uniform float uAudioFrequency;

/* a struct made for colorRamp function */
struct ColorStop {
    vec3 color;
    float position;
};

/*
    colorRamp -> Basedon Blender's linearColor Ramp node
    colors -> array of color of lenght 3
    factor -> should be between [0, 1]
*/
vec3 colorRamp(ColorStop[4] colors, float factor) {
    int index = 0;
    for(int i = 0; i < colors.length() - 1; i++) {
        ColorStop current = colors[i];

        bool isInBetween = current.position <= factor;
        index = isInBetween ? i : index;
    }
    ColorStop currentColor = colors[index];
    ColorStop nextColor = colors[index + 1];

    float range = nextColor.position - currentColor.position;
    float lerpFactor = (factor - currentColor.position) / range;

    return mix(currentColor.color, nextColor.color, lerpFactor);
}

void main() {
    float time = uTime * (1.0 + uAudioFrequency);
    float r = vPattern;


    vec3 mainColor = mix(vec3(0.2, 0.3, 0.9), vec3(0.4, 1.0, 0.3), uAudioFrequency);
    mainColor.r *= 0.9 + sin(time) / 3.2;
    mainColor.g *= 1.1 + cos(time / 2.0) / 2.5;
    mainColor.b *= 0.8 + cos(time / 5.0) / 4.0;

    mainColor.rgb += 0.1;

    ColorStop[4] colors = ColorStop[](
        ColorStop(vec3(1), 0.0),
        ColorStop(vec3(0.9), 0.01),
        ColorStop(mainColor, 0.1),
        ColorStop(vec3( 0.01, 0.05, 0.2), 1.0)
    );

    vec3 color = colorRamp(colors, r);

    gl_FragColor = vec4(color, 1.0);
}