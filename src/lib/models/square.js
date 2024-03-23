class Square extends Shape {
    constructor(gl){
        super(gl, gl.TRIANGLE_FAN);
        this.shape = "square";
    }

    addCanvasListener(){
        
        let initCoor = (0.0, 0.0);
        let isDown = false;

        const canvas = document.querySelector("#ini-canvas");

        canvas.addEventListener("mousedown", (event) => {
            
            isDown= true;
    
            if (!this.isDrawn) {
                initCoor = getMousePixel(canvas, event);
            }

        }, false);

        canvas.addEventListener("mousemove", (event) => {

            if (!this.isDrawn && isDown) {
                const coordinate = getMousePixel(canvas, event);
                this.createSquare(initCoor, coordinate, false);
            }

        }, false);
        canvas.addEventListener("mouseup", (event) => {

            isDown= false;

            if (!this.isDrawn) {
                const coordinate = getMousePixel(canvas, event);
                this.createSquare(initCoor, coordinate, true);
                this.isDrawn = true;
            }

        }, false);

    }

    createSquare(initCoor, coor, isDone) {
        const { r, g, b } = this.colors;

        const length = Math.abs(initCoor.x - coor.x);

        let xCoor, yCoor;

        if (coor.x < initCoor.x) {
            if(coor.y < initCoor.y) {
                xCoor = initCoor.x - length;
                yCoor = initCoor.y - length;
            }
            else {
                xCoor = initCoor.x - length;
                yCoor = initCoor.y + length;
            }
        } 
        else {
            if(coor.y < initCoor.y) {
                xCoor = initCoor.x + length;
                yCoor = initCoor.y - length;
            }
            else {
                xCoor = initCoor.x + length;
                yCoor = initCoor.y + length;
            }
        }

        this.arrVertices = [
            initCoor.x, initCoor.y, r, g, b, 1.0,
            xCoor, initCoor.y, r, g, b, 1.0,
            xCoor, yCoor, r, g, b, 1.0,
            initCoor.x, yCoor , r, g, b, 1.0,
        ]

        console.log(coor.x, coor.y)

        this.arrVertices = pixelToCoordinate(this.arrVertices);
        this.transformDrawShape(isDone);
    }
 
}