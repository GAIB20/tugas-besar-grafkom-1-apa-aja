class Shape {
    // Base class shape constructor
    constructor(gl, type) {
        this.gl = gl;
        this.type = type;
        this.shape = "";
        this.reset();
        this.prevParams = {};
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

        this.savePrevParams();

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
        this.addRotationListener();
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
            this.changeColor(this.arrVertices);
            this.transformDrawShape(true, false, true);
        }, false);
    }

    addRotationListener() {
        const animate = document.getElementById("checkbox-animate");
        animate.addEventListener("change", () => {
            if (animate.checked) {
                this.startAnimationLoop();
            } else {
                this.stopAnimationLoop();
                this.transformDrawShape();
            }
        });
      }

    // Change all the color elements
    changeColor(arrVertices) {
        let arrLength = arrVertices.length;
        for (let i = 0; i < arrLength; i+=6){
            arrVertices[i + 2] = this.colors.r;
            arrVertices[i + 3] = this.colors.g;
            arrVertices[i + 4] = this.colors.b;
            arrVertices[i + 5] = 1;
        }
        return arrVertices;
    }

    // Clear button listener
    addClearButtonListener() {
        const clearButton = document.getElementById("button-clear");
        clearButton.addEventListener("click", () => {
            this.stopAnimationLoop();
            this.resetVerticesListener();
            this.reset();
        })
    }

    // Listener for parameter adjusted by user
    addParamsListener() {

        const x = document.getElementById("x");
        const y = document.getElementById("y");
        const angle = document.getElementById("angle");
        const scale = document.getElementById("scale");
        const transformX = document.getElementById("transformX");
        const transformY = document.getElementById("transformY");

        const params = [x, y, angle, scale, transformX, transformY];

        const animateCheckbox = document.getElementById("checkbox-animate");

        // disable params if in animation
        const toggleParams = () => {
            params.forEach(param => {
                param.disabled = animateCheckbox.checked;
            });
        };

        animateCheckbox.addEventListener("change", toggleParams);

        toggleParams();

        addRangeListener("x", this);
        addRangeListener("y", this);
        addRangeListener("angle", this);
        addRangeListener("scale", this);
        addRangeListener("transformX", this);
        addRangeListener("transformY", this);
    
    }

    // Save current params as previeous params
    savePrevParams() {
        this.prevParams = {
            x: this.x,
            y: this.y,
            scale: this.scale,
            angle: this.angle,
            transformX: this.transformX,
            transformY: this.transformY
        };
    }

    // Listener for save button
    addSaveListener() {
        cloneAndReplace("button-save");

        const saveModelButton = document.getElementById('button-save');        
        saveModelButton.addEventListener('click', () => {
            exportModel(this.shape, this.arrVertices);
        });
    }

    // start animation
    startAnimationLoop() {
        this.animationFrameId = requestAnimationFrame(this.startAnimationLoop.bind(this));
        this.transformDrawShape(true,true);
    }

    // stop animation
    stopAnimationLoop() {
        cancelAnimationFrame(this.animationFrameId);
    }

    // Draw the shape functionalities
    // Main function for transform and draw shape
    transformDrawShape(isDone = true, isAnimated = false, isColor = false, isTransform = true) {

        let arrVertices = this.arrVertices.slice();

        if (isTransform){
            arrVertices = this.transformShape(arrVertices, isColor);
        }

        // animation rotation
        if (isAnimated) {
            const angle = this.getRotationAngle();
            arrVertices = rotate(arrVertices, angle);
        }
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

    // rotation animation angle
    getRotationAngle() {
        const time = Date.now();
        const rotationSpeed = 0.1;
        const angle = time * rotationSpeed;
        return angle;
      }

    // Transform the shape
    transformShape(arrVertices, isColor = false) {

        if (this.scale == 1){
            arrVertices = scale(arrVertices, this.scale);  
        } else {
            arrVertices = scale(arrVertices, this.scale / this.prevParams.scale);    
        }

        if (this.rotate == 0){
            arrVertices = rotate(arrVertices, this.angle);
        } else {
            arrVertices = rotate(arrVertices, this.angle - this.prevParams.angle);
        }

        if (this.transformX == 1){
            arrVertices = transformX(arrVertices, this.transformX);
        } else {
            arrVertices = transformX(arrVertices, this.transformX/ this.prevParams.transformX);
        }

        if (this.transformY == 1){
            arrVertices = transformY(arrVertices, this.transformY);
        } else {
            arrVertices = transformY(arrVertices, this.transformY / this.prevParams.transformY);
        }

        if (this.x == 535 && this.y == 345){
            arrVertices = translation(arrVertices, this.x, this.y);
        }  else {
            arrVertices = translation(arrVertices, this.x - this.prevParams.x + 535, this.y - this.prevParams.y + 345);
        }

        if (isColor){
            this.changeColor(arrVertices);
        }

        if (arrVertices != null){
            for (let i = 0; i < this.arrVertices.length; i+=6) {
                this.arrVertices[i] = arrVertices[i];
                this.arrVertices[i+1] = arrVertices[i+1];
            }
        }

        this.savePrevParams();

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
        const checkbox = document.getElementById("checkbox-lock");

        let initialVertexX, initialVertexY, parallelX, parallelY, nonParallel
        let deltaX, deltaY; 
        let squareVertex = false;

        const canvasScalingFactor = canvasWidth/canvasHeight;

        // Event listener for start dragging
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

            if ((this.arrVertices[index * 6 + 1] < this.arrVertices[parallelX + 1] && this.arrVertices[index * 6] > this.arrVertices[parallelY])
                || (this.arrVertices[index * 6 + 1] > this.arrVertices[parallelX + 1] && this.arrVertices[index * 6] < this.arrVertices[parallelY])){
                squareVertex = true;
            } 
        });

        vertexElement.addEventListener("drag", (event) => {
            const pixel = getMousePixel(canvas,event);

            if (pixel.x > leftPanelWidth && pixel.y > 0 && pixel.y < canvasHeight && pixel.x < (canvasWidth + leftPanelWidth)){

                initialVertexX = this.arrVertices[i];
                initialVertexY = this.arrVertices[i+1];

                deltaX = translateXPixel(pixel.x - leftPanelWidth) - initialVertexX;
                deltaY = translateYPixel(pixel.y) - initialVertexY;

                // add sparkle effect
                const sparkle = document.createElement("div");
                sparkle.classList.add("sparkle");

                if (checkbox.checked) {
                    for (let i = 0; i < this.arrVertices.length; i+=6) {
                        this.arrVertices[i] += deltaX;
                        this.arrVertices[i+1] += deltaY;
                        sparkle.style.top = `${pixel.y}px`;
                        sparkle.style.left = `${pixel.x}px`;
                    } 
                } 
                else {
                    // remain the shape of square/rectangle
                    if (this.shape == "rectangle" || this.shape == "square") {

                        if (this.shape == "rectangle"){
                            this.arrVertices[parallelX] += deltaX;
                            this.arrVertices[parallelY + 1] += deltaY;
                            this.arrVertices[i] = translateXPixel(pixel.x - leftPanelWidth);
                            this.arrVertices[i+1] = translateYPixel(pixel.y);
                            sparkle.style.top = `${pixel.y}px`;
                            sparkle.style.left = `${pixel.x}px`;
                        } 
                        else if (this.shape == "square"){
                            if (squareVertex){
                                this.arrVertices[parallelY + 1] -= deltaX * canvasScalingFactor;
                                this.arrVertices[parallelX] += deltaX;
                                this.arrVertices[i] += deltaX;
                                this.arrVertices[i+1] -= deltaX * canvasScalingFactor;
                            } 
                            else {
                                this.arrVertices[parallelY + 1] += deltaX * canvasScalingFactor;
                                this.arrVertices[parallelX] += deltaX;
                                this.arrVertices[i] += deltaX;
                                this.arrVertices[i+1] += deltaX * canvasScalingFactor;
                            }
                            sparkle.style.top = `${translateYCoordinate(this.arrVertices[i+1])}px`;
                            sparkle.style.left = `${pixel.x}px`;
                        }
                    }
                    else {
                        this.arrVertices[i] = translateXPixel(pixel.x - leftPanelWidth);
                        this.arrVertices[i+1] = translateYPixel(pixel.y);
                        sparkle.style.top = `${pixel.y}px`;
                        sparkle.style.left = `${pixel.x}px`;
                    }
                }
                
                this.transformDrawShape(true,false,false,false);

                document.body.appendChild(sparkle);

                // remove the sparkle element after dragging end
                sparkle.addEventListener("animationend", () => {
                    sparkle.remove();
                });
                
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