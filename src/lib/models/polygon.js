class Polygon extends Shape {
    // Polygon constructor
    constructor(gl) {
        super(gl, gl.TRIANGLE_FAN);
        this.shape = "polygon";
    }
    
    // Canvas listener for drag and drop purposes
    addCanvasListener() {   

        // Get the canvas
        const canvas = document.querySelector("#ini-canvas");
        canvas.addEventListener("click", (event) => {
            
            // Get the coordinate based on mouse position
            let pos = getMousePixel(canvas, event);
            let x = translateXPixel(pos.x);
            let y = translateYPixel(pos.y);

            // Add vertex and draw object
            this.addVertex(x, y);
            this.transformDrawShape();
        }, false);
    }

    // Add vertex basef on position
    addVertex(x, y) {
        // Initiate the color and push it to the list of vertices
        const { r, g, b } = this.colors;
        this.arrVertices.push(x, y, r, g, b, 1.0);
    }

    // Just draw the outer point using convex hull
    transformDrawShape() {
        this.arrVertices = convexHull(this.arrVertices);
        super.transformDrawShape();
    }
}