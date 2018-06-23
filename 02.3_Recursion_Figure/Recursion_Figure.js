var canvas = document.getElementById("recursion");
var context = canvas.getContext("2d");

// Get variable from the HTML tag <script>
document.currentScript = document.currentScript || (function() {
        let scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];  // get last script name
    })();
const description = document.currentScript.getAttribute("description");

// Multiply two matrices
Math.dot = function (a, b) {
    let rowsA = a.length, colsA = a[0].length,
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

// Draw the fractal
function draw_fractal()
{
    const depth = 12;  // recursion depth
    const figure = prepare();  // make preparations before drawing
    recursion(figure,  depth)  // perform recursion
}

// Find window width and height and prepares polyhedron
var affine;  // list of affine transformation matrices
function prepare() {
    // Get screen width and height
    margin = 10;  // canvas is centered, so the real margin in equal to 1/2 of it
    const w = window.innerWidth - margin;
    const h = window.innerHeight - margin;
    const min = Math.min(w, h);
    //Set canvas width and height
    canvas.width = min;
    canvas.height = min;
    // Clear screen from previous drawing
    context.clearRect(0, 0, w, h);
    // Add text to the canvas
    context.font = "18px Arial";
    context.fillText(description, 5, 20);

    // Fill list of affine transformation matrices
    affine = [];
    if (description === "triangle1") {
        let matrix1 = [[-0.5, 0.4,  0.5 * min], [-0.4, -0.5, 0.4 * min], [0, 0, 1]];
        let matrix2 = [[-0.5, -0.4, min],       [0.4,  -0.5, 0],         [0, 0, 1]];
        affine.push(matrix1, matrix2);
    }

    return [0, 0, min, 0, 0.5*min, 0.4*min];  // return initial points of the figure
}

// Repeating recursion
function recursion(figure,  depth)
{
    if (!depth--) {
        draw(figure);  // draw the figure
        return;  // recursion is over
    }

    var figure1 = [];
    var figure2 = [];
    const length = figure.length;
    for (let i = 0; i < length; i += 2) {
        let point = [[figure[i]], [figure[i+1]], [1]];
        let point1 = Math.dot(affine[0], point);
        let point2 = Math.dot(affine[1], point);
        figure1.push(point1[0][0], point1[1][0]);
        figure2.push(point2[0][0], point2[1][0]);
    }

    recursion(figure1,  depth);
    recursion(figure2,  depth);
}

// Draw the polyhedron figure
function draw(figure)
{
    const h = canvas.height;
    context.beginPath();
    context.moveTo(figure[0], 0.5*h - figure[1]);
    const length = figure.length;
    for (let i = 2; i < length; i += 2) {
        context.lineTo(figure[i], 0.5*h - figure[i+1]);
    }
    context.lineTo(figure[0], 0.5*h - figure[1]);
    context.stroke();
}

draw_fractal();  // draw the fractal
window.addEventListener("resize", draw_fractal);  // redraw when the window is resized
