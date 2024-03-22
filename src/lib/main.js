const main = () => {
    const gl = startGL();    
    let shape = new Square(gl);
    shape.init();
};