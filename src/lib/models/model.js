class Shape {
    constructor(gl, type){
        this.gl = gl;
        this.type = type;
    }

    addCanvasListener() {
        throw new Error("Geometry is an abstract class");
    }

    drawShape(arrVertices){
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arrVertices), gl.STATIC_DRAW);
        gl.drawArrays(this.type, 0, arrVertices.length / 6);
    }

    transformShape(arrVertices) {
        // not yet implemented
        return arrVertices;
    }

    addVerticesListener(arrVertices) {
        this.resetVerticesListener();

        arrVertices = coordinatetoPixel(arrVertices);
        arrLength = arrVetices.length();
        const containerCanvas = document.querySelector("#ini-container-canvas");
        const canvas = document.querySelector("#ini-canvas");
        for (let i = 0; i < arrLength; i+=6){
            let vertex = document.createElement("div");
            vertex.setAttribute("id", `vertex-${i/6}`);
            vertex.classList.add("vertex");
            vertex.style.cssText = `
                position: absolute;
                top: ${arrVertices[i+1]}px;
                left: ${arrVertices[i]}px;
            `
            
            vertex.addEventListener("click", () => {
                let colorOption = document.createElement("input");
                colorOption.setAttribute("id", `color-option-${i/6}`);
                colorOption.setAttribute("type", "color");
                colorOption.classList.add("color-option");
                colorOption.value = document.getElementById("color-option").value;
                colorOption.style.cssText = `
                    position: absolute;
                    top: ${arrVertices[i+1] - 25}px;
                    left: ${arrVertices[i] - 25}px;
                `

                colorOption.addEventListener("input", (event) =>{

                    

                })
            })




        }
        
    }

    resetVerticesListener() {
        const vertices = document.querySelectorAll(".vertex");
        vertices.forEach((vertex) => {
            vertex.remove();
        })
    }



    
}