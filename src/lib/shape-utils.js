const canvas = document.querySelector("#ini-canvas");
const CANVAS_WIDTH = canvas.getAttribute("width");
const CANVAS_HEIGHT = canvas.getAttribute("height");

// Translate x pixel to coordinate between [-1, 1]
function translateXPixel(x) {
    let half = CANVAS_WIDTH / 2;
    return (x - half) / half;
}

// Translate y pixel to coordinate between [-1, 1]
// The return is negated because to make the coordinate from 0 to half positive and half to end negative
function translateYPixel(y) {
    let half = CANVAS_HEIGHT / 2;
    return -(y - half) / half;
}

// Translate x coordinate to pixel
function translateXCoordinate(x) {
    let half = CANVAS_WIDTH / 2;
    return x * half + half;
}

// Translate y coordinate to pixel
function translateYCoordinate(y) {
    let half = CANVAS_HEIGHT / 2;
    return -y * half + half;
}

// Convert the coordinate to pixel
// Every point contains 6 elements (x, y, r, g, b, a)
function coordinateToPixel(vertices) {
    for (let i = 0; i < vertices.length; i += 6) {
        vertices[i] = translateXCoordinate(vertices[i]);
        vertices[i + 1] = translateYCoordinate(vertices[i + 1]);
    }

    return vertices;
}

// Convert back pixal to coordinate
function pixelToCoordinate(vertices) {
    for (let i = 0; i < vertices.length; i+= 6) {
        vertices[i] = translateXPixel(vertices[i]);
        vertices[i + 1] = translateYPixel(vertices[i + 1]);
    }

    return vertices;
}

// Get the center of the shape
function getCenter(vertices) {
    totalX = 0;
    totalY = 0;
    n = 0;
    for (let i = 0; i < vertices.length; i += 6) {
        totalX += vertices[i];
        totalY += vertices[i + 1];
        n += 1;
    }

    return [totalX/n, totalY/n];
}

// Doing shape translation
function translation(vertices, dx, dy) {
    for (let i = 0; i < vertices.length; i += 6) {
        vertices[i] += translateXPixel(dx);
        vertices[i + 1] += translateYPixel(dy);
    }

    return vertices
}

// Doing shape scalling
function scale(vertices, factor) {
    center = getCenter(vertices);
    for (let i = 0; i < vertices.length; i += 6) {
        vertices[i] = (vertices[i] - center[0]) * factor + center[0];
        vertices[i + 1] = (vertices[i + 1] - center[1]) * factor + center[1];
    }

    return vertices;    
}

// Doing shape rotation
function rotate(vertices, angle) {
    const canvasWidth = document.getElementById("ini-canvas").offsetWidth;
    const canvasHeight = document.getElementById("ini-canvas").offsetHeight;
    const canvasScalingFactor = canvasWidth/canvasHeight;
    center = getCenter(vertices);
    angle = angle * Math.PI / 180;


    for (let i = 0; i < vertices.length; i += 6) {
        x = vertices[i] - center[0];
        y = vertices[i + 1] - center[1];

        // Doing rotation using polar concepts
        vertices[i] = x*Math.cos(angle) - y*Math.sin(angle)/canvasScalingFactor + center[0];
        vertices[i + 1] = x*Math.sin(angle)*canvasScalingFactor + y*Math.cos(angle) + center[1];
    }

    return vertices;
}

// Doing shape shear
function shear(vertices, shearX, shearY) {
    center = getCenter(vertices);
    for (let i = 0; i < vertices.length; i += 6) {
        vertices[i] = (vertices[i] - center[0]) * shearX + center[0];
        vertices[i + 1] = (vertices[i + 1] - center[1]) * shearY + center[1];
    }

    return vertices;
}

// Change the x value of every points on that shape
function transformX(vertices, value) {
    center = getCenter(vertices);
    for (let i = 0; i < vertices.length; i += 6) {
        vertices[i] = (vertices[i] - center[0]) * value + center[0];
    }
    
    return vertices;
}

// Change the y value of every points on that shape
function transformY(vertices, value) {
    center = getCenter(vertices);
    for (let i = 0; i < vertices.length; i += 6) {
        vertices[i + 1] = (vertices[i + 1] - center[1]) * value + center[1];
    }

    return vertices;
}

// To find orientation of ordered triplet (p, q, r).
// 0 for collinear, 1 for clockwise, 2 for counterclockwise
function pointOrientation(vertex, p, q, r) {
    let val = ((vertex[q + 1] - vertex[p + 1]) * (vertex[r] - vertex[q])) - 
              ((vertex[q] - vertex[p]) * (vertex[r + 1] - vertex[q + 1]))
    
    if (val == 0) return 0; // collinear
    return (val > 0)? 1 : 2; // clock or counterclock wise
}

// Function to do convex-hull
// References : https://www.geeksforgeeks.org/convex-hull-using-jarvis-algorithm-or-wrapping
function convexHull (vertices) {
    // Initiate variables, There must be at least 3 points
    n = vertices.length / 6
    if (n < 3) return vertices;

    // Initialize the result
    let hull = [];

    // Find the leftmost point
    let leftmostidx = 0;
    for (let i = 0; i < vertices.length; i += 6) {
        if (vertices[i] < vertices[leftmostidx]) {
            leftmostidx = i;
        }
    }

    let q; let p = leftmostidx
    do {
        // Add current point to result
        for (let i = 0; i < 6; i += 1) {
            hull.push(vertices[p + i])
        }
        
        // Search for a point 'q' such that orientation(p, q,
        // x) is counterclockwise for all points 'x'.
        q = ((p / 6 + 1) % n) * 6;
        
        for (let i = 0; i < vertices.length; i += 6) {
            // If i is more counterclockwise than current q, then update q
            if (pointOrientation(vertices, p, i, q) == 2) {
                q = i
            }
        }

        // Now q is the most counterclockwise with respect to p
        // Set p as q for next iteration, so that q is added to result 'hull'
        p = q

    } while (p != leftmostidx); // While we don't come to first point
         
    return hull
}

// Doing HEX to RGB convertion
function hexToRGB(color) {
    const parseComponent = (str) => parseInt(str, 16);
    
    const r = parseComponent(color.substr(1, 2));
    const g = parseComponent(color.substr(3, 2));
    const b = parseComponent(color.substr(5, 2));
    
    return { r: r / 255, g: g / 255, b: b / 255 };
}

// Function to reset all the parameter of user input to the canvas
function resetParams() {
    // Get the x value and then reset the min and max value to the canvas size
    const xValue = document.getElementById("x");
    xValue.setAttribute("min", 0);
    xValue.setAttribute("max", CANVAS_WIDTH);
    xValue.value = CANVAS_WIDTH / 2;
    
    // Get the y value and then reset the min and max value to the canvas size
    const yValue = document.getElementById("y");
    yValue.setAttribute("min", 0);
    yValue.setAttribute("max", CANVAS_HEIGHT);
    yValue.value = CANVAS_HEIGHT / 2;

    // Reset the other parameters to default values
    document.getElementById("angle").value = 0;
    document.getElementById("scale").value = 1;
    document.getElementById("transformX").value = 1;
    document.getElementById("transformY").value = 1;

    // reset checkboxes
    document.getElementById("checkbox-lock").checked = false;
    document.getElementById("checkbox-animate").checked = false;
}
