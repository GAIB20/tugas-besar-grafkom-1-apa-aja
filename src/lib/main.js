const main = () => {
    const gl = startGL();    
    let shape = new Line(gl);
    shape.init();

    const loadModelButton = document.getElementById('button-load');
        
    loadModelButton.addEventListener('change', (event) => {
        parseJsonFile(event.target.files[0]).then((data) => {
            const id = "button-" + data["type"];
            
            shape = changeShape(id, shape);
            shape.arrVertices = data["vertex"];
            shape.transformDrawShape();
        })
    });
};