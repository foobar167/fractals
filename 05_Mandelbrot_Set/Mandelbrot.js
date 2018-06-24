let canvas = document.getElementById("mandelbrot");
let context = canvas.getContext("2d");

// Get variable from the HTML tag <script>
document.currentScript = document.currentScript || (function() {
        let scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];  // get last script name
    })();
const description = document.currentScript.getAttribute("description");

// Define Complex number class
class Complex {
    constructor(re = 0, im = 0) {
        this.re = re;
        this.im = im;
    }
    static add(a, b) {
        return new Complex(a.re + b.re,
                           a.im + b.im);
    }
    add(b) {
        return Complex.add(this, b);
    }
    static multiply(a, b) {
        return new Complex(a.re * b.re - a.im * b.im,
                           a.re * b.im + a.im * b.re);
    }
    multiply(b) {
        return Complex.multiply(this, b);
    }
}

// Draw the figure
let w, h;  // canvas width and height
function draw()
{
    // Get screen width and height
    const margin = 10;  // canvas is centered, so the real margin in equal to 1/2 of it
    w = window.innerWidth - margin;
    h = window.innerHeight - margin;
    //Set canvas width and height
    canvas.width = w;
    canvas.height = h;
    // Clear screen from previous drawing
    context.clearRect(0, 0, w, h);
    // Add text to the canvas
    context.font = "18px Arial";
    context.fillText(description, 5, 20);
    context.translate(0, canvas.height);  // translate canvas before flipping / mirroring
    context.scale(1, -1);  // draw a flipped / mirrored image
    context.beginPath();  // begin the path
    context.lineWidth = 1;  // 1 px line width
    // Draw it
    if (description === "Mandelbrot Set") {
        let a = new Complex(2, -7);
        let b = new Complex(4,  3);
        console.log(Complex.multiply(a, b));
        console.log(a.multiply(b));
    }

    context.stroke();  // draw the path on the canvas
}

draw();  // draw the figure
window.addEventListener("resize", draw);  // redraw when the window is resized
