class Shape {

    constructor(gl, type){
        this.gl = gl;
        this.type = type;
        this.reset();
    }

    addCanvasListener() {
        throw new Error("Shape is an abstract class");
    }

    reset(){
        this.isDrawn = false;
        this.arrVertices = [];
        this.colors = hexToRGB(document.getElementById('color-option').value);

        this.transformDrawShape();
    }

    init(){

        this.resetCanvasListener();
        this.addCanvasListener();
        this.addTypeListener();
        this.addColorButtonListener();
        this.addClearButtonListener();

    }

    addTypeListener(){

        addButtonListener("button-line", this);
        addButtonListener("button-square", this);
        addButtonListener("button-rectangle", this);
        addButtonListener("button-polygon", this);

    }

    resetCanvasListener(){

        this.resetVerticesListener();

        changeCanvas("#ini-canvas");

        this.gl = startGL();
    }

    addColorButtonListener(){

        const colorButton = document.getElementById("color-option");
        colorButton.addEventListener("input", (event) => {
            this.colors = hexToRGB(event.target.value);
            this.changeColor();
        }, false);

    }

    changeColor(){
        let arrLength = arrVertices.length;
        for (let i = 0; i < arrLength; i+=6){
            this.arrVertices[i+2] = this.colors.r;
            this.arrVertices[i+3] = this.colors.g;
            this.arrVertices[i+4] = this.colors.b;
            this.arrVertices[i+5] = 1;
        }
    }

    addClearButtonListener(){
        const clearButton = document.getElementById("button-clear");
        clearButton.addEventListener("click", () => {
            this.resetVerticesListener();
            this.reset();
        })

    }

    transformDrawShape(isDone = true){

        let arrVertices = this.arrVertices.slice();
        arrVertices = this.transformShape(arrVertices);
        this.drawShape(arrVertices);

        if(isDone){

            this.addVerticesListener(arrVertices);

        }

    }

    drawShape(arrVertices){
        let arrLength = arrVertices.length;
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(arrVertices), this.gl.STATIC_DRAW);
        this.gl.drawArrays(this.type, 0, arrLength / 6);
    }

    transformShape(arrVertices) {
        // not yet implemented
        return arrVertices;
    }

    addVerticesListener(arrVertices) {

        this.resetVerticesListener();

        arrVertices = coordinateToPixel(arrVertices);
        let arrLength = arrVertices.length;
        const containerCanvas = document.querySelector(".ini-container-canvas");
        const headerHeight = document.querySelector(".header").offsetHeight;
        const leftPanelWidth = document.querySelector(".left-panel").offsetWidth;

        for (let i = 0; i < arrLength; i += 6) {
            const vertex = arrVertices.slice(i, i + 6);
            const vertexElement = this.createVertexElement(arrVertices, vertex, i / 6, containerCanvas, headerHeight, leftPanelWidth);
            containerCanvas.appendChild(vertexElement);
        }
        
    }

    createVertexElement(arrVertices, vertex, index, containerCanvas, headerHeight, leftPanelWidth) {
        const vertexElement = document.createElement("div");
        vertexElement.setAttribute("id", `vertex-${index / 6}`);
        vertexElement.classList.add("vertex");
        vertexElement.style.cssText = `
            position: absolute;
            top: ${vertex[1] + headerHeight - 4}px;
            left: ${vertex[0] + leftPanelWidth - 4}px;
        `;
        this.addVertexEventListeners(arrVertices, vertexElement, index, containerCanvas, headerHeight, leftPanelWidth);
        return vertexElement;
    }

    addVertexEventListeners(arrVertices, vertexElement, index, containerCanvas, headerHeight, leftPanelWidth){

        let i = index * 6;

        vertexElement.addEventListener("drag", (event) => {

            const coordinate = getMouseCoordinate(canvas,event);

            if (coordinate.x > 0 && coordinate.y > 0){
                this.arrVertices[i] = translateXPixel(coordinate.x);
                this.arrVertices[i+1] = translateYPixel(coordinate.y);
                this.transformDrawShape();
            }

        }, false);

        vertexElement.addEventListener("dragend", (event) => {

            const coordinate = getMouseCoordinate(canvas,event);

            this.arrVertices[i] = translateXPixel(coordinate.x);
            this.arrVertices[i+1] = translateYPixel(coordinate.y);
            this.transformDrawShape();

        }, false);

        vertexElement.addEventListener("dblclick", () => {

            let colorOption = document.querySelector(`#color-option-${i/6}`);

            if (colorOption){
                colorOption.blur();
            }

            this.arrVertices.splice(i, 6);
            let arrLength = this.arrVertices.length;
            this.transformDrawShape();

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
                top: ${arrVertices[i+1]  + headerHeight - 20}px;
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

    resetVerticesListener() {
        const vertices = document.querySelectorAll(".vertex");
        vertices.forEach((vertex) => {
            vertex.remove();
        })
    }
    
}