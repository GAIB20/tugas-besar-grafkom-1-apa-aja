class Shape {
    // Base class shape constructor
    constructor(gl, type) {
        this.gl = gl;
        this.type = type;
        this.shape = "";
        this.reset();
    }

    // Reset all the values
    reset() {
        resetParams();
        this.isDrawn = false;
        this.arrVertices = [];
        // Get all the variables, some from DOM
        this.colors = hexToRGB(document.getElementById('color-option').value);
        this.x = parseInt(document.getElementById("x").value),
        this.y = parseInt(document.getElementById("y").value),
        this.scale = parseInt(document.getElementById("scale").value),
        this.angle = parseInt(document.getElementById("angle").value),
        this.transformX = parseInt(document.getElementById("transformX").value),
        this.transformY = parseInt(document.getElementById("transformY").value),

        this.transformDrawShape();
    }

    // Initiate all the listeners
    init() {
        this.resetCanvasListener();
        this.addCanvasListener();
        this.addTypeListener();
        this.addColorButtonListener();
        this.addClearButtonListener();
        this.addParamsListener();
        this.addSaveListener();
    }

    // Reset the canvas
    resetCanvasListener() {
        this.resetVerticesListener();
        changeCanvas("#ini-canvas"); // Change the canvas
        this.gl = startGL();
    }

    // Clear all the vertex elements
    resetVerticesListener() {
        const vertices = document.querySelectorAll(".vertex");
        vertices.forEach((vertex) => {
            vertex.remove();
        })
    }

    // Canvas init validation, must be implemented
    addCanvasListener() {
        throw new Error("Shape is an abstract class");
    }

    // Shape button listeners
    addTypeListener() {
        addButtonListener("button-line", this);
        addButtonListener("button-square", this);
        addButtonListener("button-rectangle", this);
        addButtonListener("button-polygon", this);
    }

    // Color button listener based on option
    addColorButtonListener() {
        const colorButton = document.getElementById("color-option");
        colorButton.addEventListener("input", (event) => {
            this.colors = hexToRGB(event.target.value);
            this.changeColor();
        }, false);
    }

    // Change all the color elements
    changeColor() {
        let arrLength = arrVertices.length;
        for (let i = 0; i < arrLength; i+=6){
            this.arrVertices[i + 2] = this.colors.r;
            this.arrVertices[i + 3] = this.colors.g;
            this.arrVertices[i + 4] = this.colors.b;
            this.arrVertices[i + 5] = 1;
        }
    }

    // Clear button listener
    addClearButtonListener() {
        const clearButton = document.getElementById("button-clear");
        clearButton.addEventListener("click", () => {
            this.resetVerticesListener();
            this.reset();
        })
    }

    // Listener for parameter adjusted by user
    addParamsListener() {
        addRangeListener("x", this);
        addRangeListener("y", this);
        addRangeListener("angle", this);
        addRangeListener("scale", this);
        addRangeListener("transformX", this);
        addRangeListener("transformY", this);
    }

    // Listener for save button
    addSaveListener() {
        cloneAndReplace("button-save");

        const saveModelButton = document.getElementById('button-save');        
        saveModelButton.addEventListener('click', () => {
            exportModel(this.shape, this.arrVertices);
        });
    }

    // Draw the shape functionalities
    // Main function for transform and draw shape
    transformDrawShape(isDone = true) {
        let arrVertices = this.arrVertices.slice();
        arrVertices = this.transformShape(arrVertices);
        this.drawShape(arrVertices);

        if(isDone) {
            this.addVerticesListener(arrVertices);
        }
    }

    // Draw the shape
    drawShape(arrVertices) {
        let arrLength = arrVertices.length;
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(arrVertices), this.gl.STATIC_DRAW);
        this.gl.drawArrays(this.type, 0, arrLength / 6);
    }

    // Transform the shape
    transformShape(arrVertices) {
        arrVertices = translation(arrVertices, this.x, this.y);
        arrVertices = scale(arrVertices, this.scale);    
        arrVertices = rotate(arrVertices, this.angle);
        arrVertices = transformX(arrVertices, this.transformX);
        arrVertices = transformY(arrVertices, this.transformY);

        return arrVertices;
    }

    // Add vertex elements on the html, so that the vertices can be clicked and dragged
    addVerticesListener(arrVertices) {
        this.resetVerticesListener();

        arrVertices = coordinateToPixel(arrVertices);
        let arrLength = arrVertices.length;
        const containerCanvas = document.querySelector(".ini-container-canvas");
        const leftPanelWidth = document.querySelector(".left-panel").offsetWidth;

        for (let i = 0; i < arrLength; i += 6) {
            const vertex = arrVertices.slice(i, i + 6);
            const vertexElement = this.createVertexElement(arrVertices, vertex, i / 6, containerCanvas, leftPanelWidth);
            containerCanvas.appendChild(vertexElement);
        }
    }

    // Create each vertex element
    createVertexElement(arrVertices, vertex, index, containerCanvas, leftPanelWidth) {
        const vertexElement = document.createElement("div");
        vertexElement.setAttribute("id", `vertex-${index / 6}`);
        vertexElement.classList.add("vertex");
        vertexElement.style.cssText = `
            position: absolute;
            top: ${vertex[1] - 4}px;
            left: ${vertex[0] + leftPanelWidth - 4}px;
        `;
        this.addVertexEventListeners(arrVertices, vertexElement, index, containerCanvas, leftPanelWidth);
        return vertexElement;
    }

    // Vertex can be dragged for the drawing, clicked for change color of each vertex, and double clicked for delete each vertex
    addVertexEventListeners(arrVertices, vertexElement, index, containerCanvas, leftPanelWidth){
        let i = index * 6;

        const canvasWidth = document.getElementById("ini-canvas").offsetWidth;
        const canvasHeight = document.getElementById("ini-canvas").offsetHeight;

        let initialVertexX, initialVertexY, parallelX, parallelY, nonParallel
        let deltaX, deltaY; 

        // Event listener untuk memulai drag ketika titik vertex diklik
        vertexElement.addEventListener("mousedown", () => {
            
            vertexElement.setAttribute("draggable", "true");

            if (this.shape == "rectangle" || this.shape == "square"){
                for (let i = 0; i < arrVertices.length; i += 6) {
                    if (i != index * 6){
                        if (this.arrVertices[i] == this.arrVertices[index*6]){
                            parallelX = i;
                        } 
                        else if (this.arrVertices[i+1] == this.arrVertices[index*6 + 1]){
                            parallelY = i;
                        } else {
                            nonParallel = i;
                        }
                    }
                }
            }
        });

        vertexElement.addEventListener("drag", (event) => {
            const pixel = getMousePixel(canvas,event);

            if (pixel.x > leftPanelWidth && pixel.y > 0 && pixel.y < canvasHeight && pixel.x < (canvasWidth + leftPanelWidth)){

                // remain the shape of square/rectangle
                if (this.shape == "rectangle" || this.shape == "square") {

                    initialVertexX = this.arrVertices[i];
                    initialVertexY = this.arrVertices[i+1];

                    deltaX = translateXPixel(pixel.x - leftPanelWidth) - initialVertexX;
                    deltaY = translateYPixel(pixel.y) - initialVertexY;

                    let deltaLength = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX : deltaY;

                    if (this.shape == "rectangle"){
                        this.arrVertices[parallelX] += deltaX;
                        this.arrVertices[parallelY + 1] += deltaY;
                        this.arrVertices[i] = translateXPixel(pixel.x - leftPanelWidth);
                        this.arrVertices[i+1] = translateYPixel(pixel.y);
                    } 
                    else if (this.shape == "square"){
                        this.arrVertices[parallelY] -= deltaX;
                        this.arrVertices[parallelY + 1] -= deltaX;
                        this.arrVertices[parallelX + 1] += deltaX;
                        this.arrVertices[parallelX] += deltaX;
                        this.arrVertices[nonParallel] -= deltaX;
                        this.arrVertices[nonParallel + 1] += deltaX;
                        this.arrVertices[i] += deltaX;
                        this.arrVertices[i+1] -= deltaX;
                    }
                }
                
                this.transformDrawShape();
            }
        }, false);

        vertexElement.addEventListener("dragend", (event) => {
            const pixel = getMousePixel(canvas,event);
            if (pixel.x > leftPanelWidth && pixel.y > 0 && pixel.y < canvasHeight && pixel.x < (canvasWidth + leftPanelWidth)){

                // remain the shape of square/rectangle
                if (this.shape == "rectangle" || this.shape == "square") {

                    if (this.shape == "rectangle"){
                        this.arrVertices[parallelX] += deltaX;
                        this.arrVertices[parallelY + 1] += deltaY;
                        this.arrVertices[i] = translateXPixel(pixel.x - leftPanelWidth);
                        this.arrVertices[i+1] = translateYPixel(pixel.y);
                    } 
                    else if (this.shape == "square"){
                        this.arrVertices[parallelY] -= deltaX;
                        this.arrVertices[parallelY + 1] -= deltaX;
                        this.arrVertices[parallelX + 1] += deltaX;
                        this.arrVertices[parallelX] += deltaX;
                        this.arrVertices[nonParallel] -= deltaX;
                        this.arrVertices[nonParallel + 1] += deltaX;
                        this.arrVertices[i] += deltaX;
                        this.arrVertices[i+1] += deltaX;
                    }


                }
                this.transformDrawShape();
            }
        }, false);

        vertexElement.addEventListener("dblclick", () => {
            let colorOption = document.querySelector(`#color-option-${i/6}`);

            if (colorOption) {
                colorOption.blur();
            }

            this.arrVertices.splice(i, 6);
            let arrLength = this.arrVertices.length;
            this.transformDrawShape();

            // Shape will be deleted if is not relevant anymore, for example: line will be deleted if the vertices < 2, square & rectangle & polygon will be deleted if the vertices < 3
            if (arrLength == 12 && this.type == 6){
                this.resetVerticesListener();
                this.reset();
            }
            else if (arrLength == 6 && this.type == 1) {
                this.resetVerticesListener();
                this.reset();
            }
        }, false)
        
        vertexElement.addEventListener("click", () => {
            let colorOption = document.createElement("input");
            colorOption.setAttribute("id", `color-option-${i/6}`);
            colorOption.setAttribute("type", "color");
            colorOption.classList.add("color-option");
            colorOption.value = document.getElementById("color-option").value;
            colorOption.style.cssText = `
                position: absolute;
                top: ${arrVertices[i+1] - 20}px;
                left: ${arrVertices[i]  + leftPanelWidth + 20}px;
            `

            colorOption.addEventListener("input", (event) =>{
                let { r, g, b} = hexToRGB(event.target.value);

                this.arrVertices[i+2] = r;
                this.arrVertices[i+3] = g;
                this.arrVertices[i+4] = b;
                this.arrVertices[i+5] = 1;
                this.transformDrawShape();
            }, false);

            colorOption.addEventListener("blur", () => {
                colorOption.remove();
            }, false);

            containerCanvas.appendChild(colorOption);
            colorOption.focus();
        });
    }
}