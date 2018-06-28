let canvas = document.getElementById("julia");
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
    const w = window.innerWidth;  // canvas width
    const h = window.innerHeight;  // canvas height
    //Set canvas width and height
    canvas.width = w;
    canvas.height = h;
    // Clear screen from previous drawing
    context.clearRect(0, 0, w, h);
    context.beginPath();  // begin the path
    // Draw it
    if (description === "Douady Rabbit") {
        const data = {x1: -1.4, x2: 1.4, y1: -1.4, y2: 1.4, w: w, h: h, iter: 50, upper: 50,
                      color: true, c: new Complex(-0.122, 0.745)};
        julia(data);
    } else if (description === "Sea Horse") {
        const data = {x1: -1.4, x2: 1.4, y1: -1.4, y2: 1.4, w: w, h: h, iter: 250, upper: 250,
            color: true, c: new Complex(0.27334, 0.00742)};
        julia(data);
    } else if (description === "Dendrites") {
        const data = {x1: -1.4, x2: 1.4, y1: -1.4, y2: 1.4, w: w, h: h, iter: 250, upper: 250,
            color: true, c: new Complex(-0.001579, 0.740619)};
        julia(data);
    } else if (description === "Dust") {
        const data = {x1: -1.4, x2: 1.4, y1: -1.4, y2: 1.4, w: w, h: h, iter: 100, upper: 200,
            color: true, c: new Complex(0.11031, -0.67037)};
        julia(data);
    }

    context.stroke();  // draw the path on the canvas
    // Add text to the canvas
    context.fillStyle = "black";
    context.font = "18px Arial";
    context.fillText(description, 5, 20);
}

// Draw Mandelbrot Set
function julia(data) {
    const dx = (data.x2 - data.x1) / (data.w - 1);
    const dy = (data.y2 - data.y1) / (data.h - 1);
    let x, y = data.y2;
    for (let j = 0; j < data.h; j++) {
        x = data.x1;
        for (let i = 0; i < data.w; i++) {
            let steps = calculate_point(data.iter, data.upper, x, y, data.c);
            if (data.color) {
                if (steps > data.iter) {
                    context.fillStyle = "black";
                } else {
                    const wl = 380 + 400 * steps / data.iter;  // calculate wavelength
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
function calculate_point(iter, upper, x, y, c) {
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
