import createShader from "./shader.js";
import createProgram from "./program.js";

/* Initialize WebGL */

const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

const vertexShaderSource = document.getElementById("vertex-shader-2d").textContent;
const fragmentShaderSource = document.getElementById("fragment-shader-2d").textContent;

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

const program = createProgram(gl, vertexShader, fragmentShader);

gl.useProgram(program);

/* Setup viewport */
resizeCanvas(canvas);
gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

/* Clear color */
gl.clear(gl.COLOR_BUFFER_BIT);

/* event listener */

let isDrawing = false;
let shapeType = "";

const lineButton = document.getElementById("button-line");
lineButton.addEventListener("click", function() {
        shapeType = "line";
        isDrawing = false;
});

const squareButton = document.getElementById("button-square");
squareButton.addEventListener("click", function() {
        shapeType = "square";
        isDrawing = false;
});

const rectangleButton = document.getElementById("button-rectangle");
squareButton.addEventListener("click", function() {
        shapeType = "rectangle";
        isDrawing = false;
});

const polygonButton = document.getElementById("button-polygon");
squareButton.addEventListener("click", function() {
        shapeType = "polygon";
        isDrawing = false;
});


canvas.addEventListener("mousedown", function(e) {
    const x = e.clientX
    const y = e.clientY
})
