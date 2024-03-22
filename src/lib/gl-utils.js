// Vertex shader program
const vsSource = `
    precision mediump float;  
    attribute vec4 a_position;
    attribute vec4 vertColor;
    varying vec4 fragColor;

    void main() {
    fragColor = vertColor;
    gl_PointSize = 10.0;
    gl_Position = a_position;
    }`;

// Fragment shader program
const fsSource = `
    precision mediump float;
    varying vec4 fragColor;
    void main() {
    gl_FragColor = fragColor;
    }`;

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert(
			`Unable to initialize the shader program: ${gl.getProgramInfoLog(
				shaderProgram,
			)}`,
		);
		return null;
	}

	return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

	// Send the source to the shader object

	gl.shaderSource(shader, source);

	// Compile the shader program

	gl.compileShader(shader);

	// See if it compiled successfully

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(
            `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`,
        ); 
        gl.deleteShader(shader);
        return null;
	}

	return shader;
}

function setPositionAttribute(gl, program, attributeName, numComponents = 2, offset=0, type = gl.FLOAT, normalize = gl.FALSE, stride = 6) {

	const location = gl.getAttribLocation(program, attributeName)

	stride = stride * Float32Array.BYTES_PER_ELEMENT;
  	offset = offset * Float32Array.BYTES_PER_ELEMENT;

    gl.vertexAttribPointer(
      location,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(location);
}

function setPositionAttributeColor(gl, program, numComponents = 4, offset = 2) {
	setPositionAttribute(gl, program,"vertColor", numComponents, offset);
}

function setPositionAttributeVertex(gl, program) {
	setPositionAttribute(gl, program, "a_position");
}

function startGL(){
    const canvas = document.getElementById("ini-canvas")

	const gl = canvas.getContext("webgl");

	if (gl === null){
		alrert(
			"Unable to initialize WebGL. Your browser or machine may not support it."
		);
		return;
	}

	gl.clearColor(1.0,1.0,1.0,1.0);

	// Clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Initialize a shader program; this is where all the lighting
	// for the vertices and so forth is established.
	const program = initShaderProgram(gl, vsSource, fsSource);
	gl.useProgram(program);

	// Define buffer
	const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Define vertex shader attribute
	setPositionAttributeVertex(gl, program);
	setPositionAttributeColor(gl, program, 4, 2);

	return gl
}