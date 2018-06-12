let canvas = document.getElementById("l-systems");
let context = canvas.getContext("2d");

// Get variable from the HTML tag <script>
document.currentScript = document.currentScript || (function() {
        let scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];  // get last script name
    })();
const description = document.currentScript.getAttribute("description");

// Define Turtle class
class Turtle {
    constructor(x, y, angle) {
        this.x = x;
        this.y = y;
        this.angle = angle;
    }
    turn_left(angle) {
        this.angle += angle;
    }
    turn_right(angle) {
        this.angle -= angle;
    }
    move_forward(distance) {
        context.moveTo(this.x, this.y);
        this.x += distance * Math.cos(this.angle);
        this.y += distance * Math.sin(this.angle);
        context.lineTo(this.x, this.y);  // draw line segment
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
    if (description === "koch") {
        const final = 1;  // final size of the line segment
        let size = 0.7 * Math.min(w, h);  // initial size of triangle
        let turtle = new Turtle(0.5 * (w - size), 0.62 * h, 0);
        for (let i = 0; i < 3; i++) {
            koch(turtle, size, final);
            turtle.turn_right(Math.PI * 120 / 180);
        }
    } else if (description === "dragon") {
        let level = 16;
        let length = 2;
        let turtle = new Turtle(0.35 * w, 0.63 * h, 0);
        left_dragon(turtle, length, level);
    }

    context.stroke();  // draw the path on the canvas
}

// Draw Koch Square Curve
function koch(turtle, size, final)
{
    if (size < final) {
        turtle.move_forward(size);
    } else {
        koch(turtle, size/3, final);
        turtle.turn_left(Math.PI / 2);
        koch(turtle, size/3, final);
        turtle.turn_right(Math.PI / 2);
        koch(turtle, size/3, final);
        turtle.turn_right(Math.PI / 2);
        koch(turtle, size/3, final);
        turtle.turn_left(Math.PI / 2);
        koch(turtle, size/3, final);
    }
}

// Draw Dragon with 2 functions: left_dragon, right_dragon.
function left_dragon(turtle, length, level) {
    if (level === 0) {
        turtle.move_forward(length);
    } else {
        left_dragon(turtle, length, level-1);
        turtle.turn_left(Math.PI / 2);
        right_dragon(turtle, length, level-1);
    }
}

function right_dragon(turtle, length, level) {
    if (level === 0) {
        turtle.move_forward(length);
    } else {
        left_dragon(turtle, length, level-1);
        turtle.turn_right(Math.PI / 2);
        right_dragon(turtle, length, level-1);
    }
}

draw();  // draw the figure
window.addEventListener("resize", draw);  // redraw when the window is resized
