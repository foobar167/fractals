var canvas = document.getElementById("ferns");
var context  = canvas.getContext("2d");

// Get number of vertices in the fern
document.currentScript = document.currentScript || (function() {
        let scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];  // get last script name
    })();
const fern = document.currentScript.getAttribute("fern");
var vertices;  // number of vertices (affine transformations) in the fractal

// Function to multiply two matrices
Math.dot = function (a, b) {
    var rowsA = a.length, colsA = a[0].length,
        rowsB = b.length, colsB = b[0].length,
        c = [];
    if (colsA !== rowsB) return false;
    for (let i = 0; i < rowsA; i++) c[i] = [];
    for (let k = 0; k < colsB; k++) {
        for (let i = 0; i < rowsA; i++) {
            var temp = 0;
            for (let j = 0; j < rowsB; j++) temp += a[i][j]*b[j][k];
            c[i][k] = temp;
        }
    }
    return c;
};

// Function that finds window width and height and prepares polyhedron
function prepare() {
    // Set canvas width and height
    const margin = 10;  // canvas is centered, so the real margin in equal to 1/2 of it
    var w = window.innerWidth - margin;
    var h = window.innerHeight - margin;
    canvas.width = w;
    canvas.height = h;
    const i = Math.sqrt(2) / 3;

    context.clearRect(0, 0, w, h); // Clear screen from previous drawing
    context.font = "18px Arial";  // set text format

    // Fill polyhedron with affine transformation matrices associated with each vertex
    var polyhedron = [];
    if (fern === "Simple") {  // Simple Fern
        context.fillText("Type: Simple Fern", 5, 20);  // add text to the canvas
        vertices = 2;
        let vertex1 = [[2/3, 0,  0],               [0, 2/3, 1/3 * h],           [0, 0, 1]];
        let vertex2 = [[i,   -i, (2/3 + i/2) * w], [i, i,   (1/3 - 3*i/2) * h], [0, 0, 1]];
        polyhedron.push(vertex1, vertex2);
    } else if (fern === "Barnsley") {  // Barnsley Fern
        context.fillText("Type: Barnsley Fern", 5, 20);  // add text to the canvas
        vertices = 4;
        h /= 10;
        let vertex1 = [[0.85,  0.04,  0],  [-0.04, 0.85, 1.6 * h],  [0, 0, 1]];
        let vertex2 = [[0.2,   -0.26, 0],  [0.23,  0.22, 1.6 * h],  [0, 0, 1]];
        let vertex3 = [[-0.15, 0.28,  0],  [0.26,  0.24, 0.44 * h], [0, 0, 1]];
        let vertex4 = [[0,     0,     0],  [0,     0.16, 0],        [0, 0, 1]];
        polyhedron.push(vertex1, vertex2, vertex3, vertex4);
    } else if (fern === "Spirals") {
        context.fillText("Type: Spirals fractal", 5, 20);  // add text to the canvas
        vertices = 2;
        let vertex1 = [[0.2, -0.5, -0.6 * w], [0.4, 0.1, 0.8 * h], [0, 0, 1]];
        let vertex2 = [[0.6, -0.7, -1.1 * w], [0.6, 0.5, 0.5 * h], [0, 0, 1]];
        polyhedron.push(vertex1, vertex2);
    }

    // Get starting point (initial point)
    const vertex = 0, start = polyhedron[vertex]; // get the 1st vertex
    const point = [[start[0][2] / start[1][2] * h], [h], [1]];  // starting point is in the 1st vertex

    return [polyhedron, point];
}

// Function to draw the fern
function draw() {
    const [polyhedron, start] = prepare();  // make preparations before drawing
    const iterations = 200000;
    let vertex, point = start;
    if (fern === "Simple") {
        const shift_y = canvas.height;
        const ratio = Math.sqrt(2) / 3;
        for (let i = 0; i < iterations; i++) {
            vertex = Math.floor(Math.random() * vertices);  // randomly choose a vertex
            point = Math.dot(polyhedron[vertex], point);  // new point attractor position
            // Draw a point as a rectangle
            context.fillRect(point[0][0] * ratio, shift_y - point[1][0] * ratio, 1, 1);
        }
    } else if (fern === "Barnsley") {
        const shift_x = canvas.width / 2;
        const shift_y = canvas.height;
        for (let i = 0; i < iterations; i++) {
            // Choose vertex with weighted probabilities
            let v = Math.random();
            if (v <= 0.73) { vertex = 0; } else
            if (v <= 0.86) { vertex = 1; } else
            if (v <= 0.97) { vertex = 2; } else
                           { vertex = 3; }
            point = Math.dot(polyhedron[vertex], point);  // new point attractor position
            // Draw a point as a rectangle
            context.fillRect(point[0][0] + shift_x, shift_y - point[1][0], 1, 1);
        }
    } else if (fern === "Spirals") {
        const shift_x = 0.8 * canvas.width;
        const shift_y = 0.2 * canvas.height;
        const ratio = 0.23;
        for (let i = 0; i < iterations; i++) {
            // Choose vertex with weighted probabilities
            let v = Math.random();
            if (v <= 0.25) {
                vertex = 0;
                context.fillStyle = "red";
            } else {
                vertex = 1;
                context.fillStyle = "blue";
            }
            point = Math.dot(polyhedron[vertex], point);  // new point attractor position
            // Draw a point as a rectangle
            context.fillRect(point[0][0] * ratio + shift_x, shift_y - point[1][0] * ratio, 1, 1);
        }
    }
}

draw();  // draw the fractal
window.addEventListener("resize", draw);  // redraw when the window is resized
