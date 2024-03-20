function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    if (!shader) {
        console.error('Failed to create shader');
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    } else {
        console.error('Failed to compile shader:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader); // Clean up the shader object
        return null;
    }
}

export default createShader;
