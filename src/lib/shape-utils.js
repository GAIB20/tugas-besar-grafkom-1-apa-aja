const canvas = document.querySelector("#ini-canvas");
const CANVAS_WIDTH = canvas.getAttribute("width");
const CANVAS_HEIGHT = canvas.getAttribute("height");

// Translate x pixel to coordinate between [-1, 1]
function translateXPixel(x) {
    let half = CANVAS_WIDTH / 2;
    return (x - half) / half;
}

/* Translate y pixel to coordinate between [-1, 1]
The return is negated because to make the coordinate from 0 to half positive and half to end negative */
function translateYPixel(y) {
    let half = CANVAS_HEIGHT / 2;
    return -(y - half) / half;
}

/* Translate x coordinate to pixel */
function translateXCoordinate(x) {
    let half = CANVAS_WIDTH / 2;
    return x * half + half;
}

/* Translate y coordinate to pixel */
function translateYCoordinate(y) {
    let half = CANVAS_HEIGHT / 2;
    return -y * half + half;
}

// += 6 karena tiap 1 titik ngandung 6 elemen (x, y, r, g, b, a)
function coordinateToPixel(vertices) {
    for (let i = 0; i < vertices.length; i += 6) {
        vertices[i] = translateXCoordinate(vertices[i]);
        vertices[i + 1] = translateXCoordinate(vertices[i + 1]);
    }

    return vertices;
}

// += 6 karena tiap 1 titik ngandung 6 elemen (x, y, r, g, b, a)
function pixelToCoordinate(vertices) {
    for (let i = 0; i < vertices.length; i+=6) {
        vertices[i] = translateXPixel(vertices[i]);
        vertices[i+1] = translateXPixel(vertices[i+1]);
    }

    return vertices;
}

// Ambil center dari shapenya
function getCenter(vertices) {
    totalX = 0;
    totalY = 0;
    n = 0;
    for (let i = 0; i < vertices.length; i+=6) {
        totalX += vertices[i];
        totalY += vertices[i+1];
        n += 1;
    }

    return [totalX/n, totalY/n];
}

// Ini fungsi translasi buat shape
function translation(vertices, dx, dy) {
    for (let i = 0; i < vertices.length; i+=6) {
        vertices[i] += translateXCoordinate(dx);
        vertices[i+1] += translateYCoordinate(dy);
    }

    return vertices
}

// Ini fungsi buat scaling shape
function scale(vertices, factor) {
    center = getCenter(vertices);
    for (let i = 0; i < vertices.length; i+=6) {
        vertices[i] = (vertices[i] - center[0]) * factor + center[0];
        vertices[i+1] = (vertices[i+1] - center[1]) * factor + center[1];
    }

    return vertices;    
}

// // Ini fungsi buat ubah nilai x tiap titik shapenya
// function transformX(vertices, value) {
//     center = getCenter(vertices);
//     for (let i = 0; i < vertices.length; i+=6) {
//         vertices[i] = (vertices[i] - center[0]) * value + center[0];
//     }
    
//     return vertices;
// }

// // Ini fungsi buat ubah nilai y tiap titik shapenya
// function transformY(vertices, value) {
//     center = getCenter(vertices);
//     for (let i = 0; i < vertices.length; i+=6) {
//         vertices[i + 1] = (vertices[i + 1] - center[1]) * value + center[1];
//     }

//     return vertices;
// }

function hexToRGB(color) {
    const parseComponent = (str) => parseInt(str, 16);
    
    const r = parseComponent(color.substr(1, 2));
    const g = parseComponent(color.substr(3, 2));
    const b = parseComponent(color.substr(5, 2));
    
    return { r: r / 255, g: g / 255, b: b / 255 };
}


