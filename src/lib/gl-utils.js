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

function setPositionAttribute(gl, program, arr = [], attributeName, numComponents = 2, offset=0, type = gl.FLOAT, normalize = gl.FALSE, stride = 0) {

	const location = gl.getAttribLocation(program, attributeName)

	const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);

	gl.useProgram(program);

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

function setPositionAttributeColor(gl, program, arrColors = [], numComponents = 4) {
	setPositionAttribute(gl, program, arrColors, "vertColor", numComponents);
}

function setPositionAttributeVertex(gl, program, arrVertices = []) {
	setPositionAttribute(gl, program, arrVertices, "a_position");
}

function startGL(){
    const canvas = document.querySelector("#ini-canvas");

	const gl = canvas.getContext("webgl");

	if (gl === null){
		alrert(
			"Unable to initialize WebGL. Your browser or machine may not support it."
		);
		return;
	}

	// Set clear color to light blue
	gl.clearColor(0.4,0.5,0.7,0.5);

	// Clear the color buffer with specified clear color
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Initialize a shader program; this is where all the lighting
	// for the vertices and so forth is established.
	const program = initShaderProgram(gl, vsSource, fsSource);
	gl.useProgram(program);

	// // testing make a triangle
	// // Define vertex data for the triangle
    // const vertices = [
    //     0.0,  0.5, // Vertex 1 (x, y)
    //    -0.5, -0.5, // Vertex 2 (x, y)
    //     0.5, -0.5  // Vertex 3 (x, y)
    // ];

    // // Define color data for the triangle
    // const colors = [
    //     1.0, 0.0, 0.0, 1.0, // Red (Vertex 1)
    //     0.0, 1.0, 0.0, 1.0, // Green (Vertex 2)
    //     0.0, 0.0, 1.0, 1.0  // Blue (Vertex 3)
    // ];

	// setPositionAttributeVertex(gl, program,vertices);
	// setPositionAttributeColor(gl,program,colors,4);

	// gl.drawArrays(gl.TRIANGLES, 0, 3);

	// testing
	// Define buffer
	const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Define vertex shader attribute
	setPositionAttributeVertex(gl, program, []);
	setPositionAttributeColor(gl, program, [], 4);

	return gl
  
}