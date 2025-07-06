export const FlagVertexShader = `
    uniform float time;
    
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        
        float flagLength = 1.0 - vUv.y;
        float waveIntensity = flagLength * flagLength * 0.4;
        
        vec3 localPosition = position;
        float waveOffset = sin(position.z * 35.0 + time * 2.0) * 1.0 * waveIntensity;
        localPosition.x += waveOffset;
        
        vec4 instancePosition = instanceMatrix * vec4(localPosition, 1.0);
        vec4 worldPosition = modelMatrix * instancePosition;
        
        vec4 viewPosition = viewMatrix * worldPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        
        gl_Position = projectedPosition;
    }
`;

export const FlagFragmentShader = `
    uniform sampler2D map;    
    varying vec2 vUv;
    
    void main() {
        vec4 texColor = texture2D(map, vUv);
        gl_FragColor = texColor;
    }
`; 