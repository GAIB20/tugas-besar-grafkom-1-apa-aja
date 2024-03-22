const addedListeners = {};

function getMouseCoordinate(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function addButtonListener(id, shape) {
    if (!addedListeners[id]) { // Check if event listener for this id has been added
        const button = document.getElementById(id);
        button.addEventListener("click", () => {      
            changeShape(id, shape);
        }, false);

        addedListeners[id] = true; // Mark the listener as added
    }
}

function changeShape(id, shape) {
    shape.reset();
        
    switch (id) {
        case "button-line":
            shape = new Line(shape.gl);
            alert("line");
            break;
        case "button-square":
            shape = new Square(shape.gl);
            alert("square");
            break;
        case "button-rectangle":
            shape = new Rectangle(shape.gl);
            alert("rectangle");
            break;
        case "button-polygon":
            shape = new Polygon(shape.gl);
            alert("polygon");
            break;
    }

    shape.init();
    return shape
}

function changeCanvas(id) {
    const oldCanvas = document.querySelector(id);  
    const newCanvas = oldCanvas.cloneNode(true);
    oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);

    return newCanvas
}
