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
