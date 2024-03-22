class Square extends Shape {
    constructor(gl){
        super(gl, gl.TRIANGLE_FAN);
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
                this.createSquare(initCoor, coordinate, false);
            }

        }, false);
        canvas.addEventListener("mouseup", (event) => {

            isDown= false;

            if (!this.isDrawn) {
                const coordinate = getMouseCoordinate(canvas, event);
                this.createSquare(initCoor, coordinate, false);
                this.isDrawn = true;
            }

        }, false);

    }

    createSquare(initCoor, coor, isDone) {
        const { r, g, b } = this.colors;

        this.arrVertices = [
            initCoor.x, initCoor.y, r, g, b, 1.0,
            coor.x, initCoor.y, r, g, b, 1.0,
            coor.x, coor.y, r, g, b, 1.0,
            coor.x, coor.y , r, g, b, 1.0,
            initCoor.x, coor.y, r, g, b, 1.0,
            initCoor.x, initCoor.y, r, g, b, 1.0
        ]

        console.log(coor.x, coor.y)

        this.arrVertices = pixelToCoordinate(this.arrVertices);
        this.transformDrawShape(isDone);
    }
 
}