const addedListeners = {};

// Make the load button more clickable
document.getElementById('file-button').addEventListener('click', function() {
    document.getElementById('button-load').click();
});

// Get the current mouse coordinates
function getMousePixel(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

// Add event listeners to the buttons
function addButtonListener(id, shape) {
    if (!addedListeners[id]) { // Check if event listener for this id has been added
        const button = document.getElementById(id);
        button.addEventListener("click", () => {      
            changeShape(id, shape);
        }, false);

        addedListeners[id] = true; // Mark the listener as added
    }
}

// Handle shape changing mechanism
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

// Change with new canvas
function changeCanvas(id) {
    const oldCanvas = document.querySelector(id);  
    const newCanvas = oldCanvas.cloneNode(true);
    oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);

    return newCanvas
}

// Create range value listeners from slider values
function addRangeListener(id, shape) {
    const range = document.getElementById(id);
    console.log(range.value);

    range.addEventListener("input", () => {
        console.log(shape[id]);
        shape[id] = parseFloat(range.value);
        shape.transformDrawShape();
    }, false);
}

// Create a new node by replacing the old one
function cloneAndReplace(id) {
    const oldNode = document.getElementById(id);  
    const newNode = oldNode.cloneNode(true);
    oldNode.parentNode.replaceChild(newNode, oldNode);

    return newNode
}

// Export model to be saved
function exportModel(type, vertex) {
    const element = document.createElement('a');
    const config = {
        "type": type,
        "vertex": vertex,
    }

    element.setAttribute('href', 'data:text/json, ' + encodeURIComponent(JSON.stringify(config)));
    element.setAttribute('download', 'config.json');

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Parse json file to load model
function parseJsonFile(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = event => resolve(JSON.parse(event.target.result))
        fileReader.onerror = error => reject(error)
        fileReader.readAsText(file)
    })
}