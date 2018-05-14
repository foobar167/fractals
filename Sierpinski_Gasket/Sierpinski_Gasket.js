var canvas = document.getElementById("sierpinski");
var context  = canvas.getContext("2d");

// Get number of vertices in the Sierpinski fractal
document.currentScript = document.currentScript || (function() {
        let scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];  // get last script name
    })();
const vertices = document.currentScript.getAttribute("vertices");

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
    const w = window.innerWidth - margin;
    const h = window.innerHeight - margin;
    canvas.width = w;
    canvas.height = h;

    context.clearRect(0, 0, w, h); // Clear screen from previous drawing

    // Add text to the canvas
    context.font = "18px Arial";
    context.fillText("Vertices: " + vertices, 5, 20);

    // Fill polyhedron with affine transformation matrices associated with each vertex
    var polyhedron = [];
    if (vertices === "3") {  // Sierpinski Gasket
        let vertex1 = [[0.5, 0, 0],        [0, 0.5, 0.5 * h], [0, 0, 1]];  // (0, h)
        let vertex2 = [[0.5, 0, 0.5 * w],  [0, 0.5, 0.5 * h], [0, 0, 1]];  // (w, h)
        let vertex3 = [[0.5, 0, 0.25 * w], [0, 0.5, 0],       [0, 0, 1]];  // (w/2, 0)
        polyhedron.push(vertex1, vertex2, vertex3);
    } else if (vertices === "6") {  // Sierpinski Hexagon
        let vertex1 = [[1/3, 0, 1/6 * w], [0, 1/3, 2/3 * h], [0, 0, 1]];
        let vertex2 = [[1/3, 0, 1/2 * w], [0, 1/3, 2/3 * h], [0, 0, 1]];
        let vertex3 = [[1/3, 0, 0],       [0, 1/3, 1/3 * h], [0, 0, 1]];
        let vertex4 = [[1/3, 0, 2/3 * w], [0, 1/3, 1/3 * h], [0, 0, 1]];
        let vertex5 = [[1/3, 0, 1/6 * w], [0, 1/3, 0],       [0, 0, 1]];
        let vertex6 = [[1/3, 0, 1/2 * w], [0, 1/3, 0],       [0, 0, 1]];
        polyhedron.push(vertex1, vertex2, vertex3, vertex4, vertex5, vertex6);
    } else if (vertices === "8") {  // Sierpinski Carpet
        let vertex1 = [[1/3, 0, 0],       [0, 1/3, 2/3 * h], [0, 0, 1]];
        let vertex2 = [[1/3, 0, 1/3 * w], [0, 1/3, 2/3 * h], [0, 0, 1]];
        let vertex3 = [[1/3, 0, 2/3 * w], [0, 1/3, 2/3 * h], [0, 0, 1]];
        let vertex4 = [[1/3, 0, 0],       [0, 1/3, 1/3 * h], [0, 0, 1]];
        let vertex5 = [[1/3, 0, 2/3 * w], [0, 1/3, 1/3 * h], [0, 0, 1]];
        let vertex6 = [[1/3, 0, 0],       [0, 1/3, 0],       [0, 0, 1]];
        let vertex7 = [[1/3, 0, 1/3 * w], [0, 1/3, 0],       [0, 0, 1]];
        let vertex8 = [[1/3, 0, 2/3 * w], [0, 1/3, 0],       [0, 0, 1]];
        polyhedron.push(vertex1, vertex2, vertex3, vertex4, vertex5, vertex6, vertex7, vertex8);
    }

    // Get starting point (initial point)
    const vertex = 0, start = polyhedron[vertex]; // get the 1st vertex
    const point = [[start[0][2] / start[1][2] * h], [h], [1]];  // starting point is in the 1st vertex

    return [polyhedron, point];
}

// Function to draw Sierpinski fractal
function draw() {
    const [polyhedron, start] = prepare();  // make preparations before drawing
    const iterations = 200000;
    let vertex, point = start;
    for (let i = 0; i < iterations; i++) {
        vertex = Math.floor(Math.random() * vertices);  // randomly choose a vertex
        point = Math.dot(polyhedron[vertex], point);  // new point position
        context.fillRect(point[0][0], point[1][0], 1, 1);  // draw a point as a rectangle
    }
}

draw();  // draw the fractal
window.addEventListener("resize", draw);  // redraw when the window is resized
