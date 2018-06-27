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
function draw() {
    // Get screen width and height
    const margin = 0;  // canvas is centered, so the real margin in equal to 1/2 of it
    const w = window.innerWidth - margin;  // canvas width
    const h = window.innerHeight - margin;  // canvas height
    //Set canvas width and height
    canvas.width = w;
    canvas.height = h;
    // Clear screen from previous drawing
    context.clearRect(0, 0, w, h);
    // Add text to the canvas
    context.font = "18px Arial";
    context.fillText(description, 5, 20);
    //context.translate(0, canvas.height);  // translate canvas before flipping / mirroring
    //context.scale(1, -1);  // draw a flipped / mirrored image
    context.beginPath();  // begin the path
    context.lineWidth = 1;  // 1 px line width
    // Draw it
    if (description === "Mandelbrot Set 1") {
        const data = {x1: -2.25, x2: 0.75, y1: -1.5, y2: 1.5, w: w, h: h, iter: 100, upper: 50, color: true};
        mandelbrot(data);
    } else if (description === "Mandelbrot Set 2") {
        const data = {x1: -0.745468, x2: -0.745385, y1: 0.112979, y2: 0.113039, w: w, h: h, iter: 350, upper: 30, color: true};
        mandelbrot(data);
    } else if (description === "Mandelbrot Set 3") {
        const data = {x1: -1.254024, x2: -1.252861, y1: 0.046252, y2: 0.047125, w: w, h: h, iter: 250, upper: 15, color: true};
        mandelbrot(data);
    } else if (description === "Mandelbrot Set 4") {
        const data = {x1: -0.95, x2: -0.88333, y1: 0.233333, y2: 0.3, w: w, h: h, iter: 250, upper: 15, color: true};
        mandelbrot(data);
    } else if (description === "Mandelbrot Set 5") {
        const data = {x1: -0.74758, x2: -0.74624, y1: 0.10671, y2: 0.10779, w: w, h: h, iter: 1000, upper: 1.7, color: true};
        mandelbrot(data);
    }

    context.stroke();  // draw the path on the canvas
}

// Draw Mandelbrot Set
function mandelbrot(data) {
    const dx = (data.x2 - data.x1) / (data.w - 1);
    const dy = (data.y2 - data.y1) / (data.h - 1);
    let x, y = data.y2;
    for (let j = 0; j < data.h; j++) {
        x = data.x1;
        for (let i = 0; i < data.w; i++) {
            let steps = calculate_point(data.iter, data.upper, x, y);
            if (data.color) {
                if (steps > data.iter) {
                    context.fillStyle = "black";
                } else {
                    const wl = 380 + steps % 401;  // calculate wavelength
                    context.fillStyle = wavelengthToRGB(wl);  // set the color
                }
                context.fillRect(i, j, 1, 1); // draw a point as a rectangle
            } else if (steps === data.iter) {
                context.fillRect(i, j, 1, 1); // draw a point as a rectangle
            }
            x += dx;
        }
        y -= dy;
    }
}

// Calculate point in the fractal
function calculate_point(iter, upper, x, y) {
    const c = new Complex(x, y);
    let z = new Complex(x, y);
    for (let i = 1; i <= iter; i++) {
        z = Complex.multiply(z, z).add(c);  // z = z*z + c;
        if (Math.abs(z.re) >= upper ||
            Math.abs(z.im) >= upper) {
            return i;
        }
    }
    return iter+1;
}

// Converts wavelength to RGB color. Approximately human eye vision
function wavelengthToRGB(wavelength) {
    let red, green, blue;  // RGB colors

    let scale = 1.0;
    if (wavelength > 700) {
        scale = 0.3 + 0.7 * (780 - wavelength) / 80;
    } else if (wavelength < 420) {
        scale = 0.3 + 0.7 * (wavelength - 380) / 40;
    }

    if (wavelength >= 380 && wavelength <= 440) {
        red = (440 - wavelength) / 60;
        green = 0;
        blue = 1;
    } else if (wavelength >= 440 && wavelength <= 490) {
        red = 0;
        green = (wavelength - 440) / 50;
        blue = 1;
    } else if (wavelength >= 490 && wavelength <= 510) {
        red = 0;
        green = 1;
        blue = (510 - wavelength) / 20;
    } else if (wavelength >= 510 && wavelength <= 580) {
        red = (wavelength - 510) / 70;
        green = 1;
        blue = 0;
    } else if (wavelength >= 580 && wavelength <= 645) {
        red = 1;
        green = (645 - wavelength) / 65;
        blue = 0;
    } else if (wavelength >= 645 && wavelength <= 780) {
        red = 1;
        green = 0;
        blue = 0;
    } else {  // black otherwise
        red = 0;
        green = 0;
        blue = 0;
    }

    return 'rgb(' +
        Math.floor(255 * Math.pow(red   * scale, 0.8)) + ',' +
        Math.floor(255 * Math.pow(green * scale, 0.8)) + ',' +
        Math.floor(255 * Math.pow(blue  * scale, 0.8)) + ')';
}

draw();  // draw the figure
window.addEventListener("resize", draw);  // redraw when the window is resized
