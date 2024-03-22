class Line extends Shape {

    constructor(gl){
        super(gl, gl.LINES);
    }

    addCanvasListener(){
        
        let initCoor = (0.0, 0.0);
        let isDown = false;

        const canvas = document.querySelector("#ini-canvas");

        canvas.addEventListener("mousedown", (event) => {
            
            isDown= true;
    
            if (!this.isDrawn) {
                initCoor = getMouseCoordinate(canvas, event);
            }

        }, false);

        canvas.addEventListener("mousemove", (event) => {

            if (!this.isDrawn && isDown) {
                const coordinate = getMouseCoordinate(canvas, event);
                this.createLine(initCoor, coordinate, false);
            }

        }, false);
        canvas.addEventListener("mouseup", (event) => {

            isDown= false;

            if (!this.isDrawn) {
                const coordinate = getMouseCoordinate(canvas, event);
                this.createLine(initCoor, coordinate, false);
                this.isDrawn = true;
            }

        }, false);

    }

    createLine(initCoor, coor, isDone){

        const { r, g, b } = this.colors;

        this.arrVertices = [
            initCoor.x, initCoor.y, r, g, b, 1.0,
            coor.x, coor.y, r, g, b, 1.0]

        this.arrVertices = pixelToCoordinate(this.arrVertices);
        this.transformDrawShape(isDone);

    }

}