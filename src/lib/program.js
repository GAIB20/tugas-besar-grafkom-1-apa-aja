function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    if (!program) {
        console.error('Failed to create program');
        return null;
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    } else {
        console.error('Failed to compile program: ', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
}

export default createProgram;
