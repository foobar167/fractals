var canvas = document.getElementById("turtle");
var context = canvas.getContext("2d");

// Get variable from the HTML tag <script>
document.currentScript = document.currentScript || (function() {
        let scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];  // get last script name
    })();
const description = document.currentScript.getAttribute("description");

// Draw the figure
var w, h;  // canvas width and height
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
    context.lineWidth = 2;  // 2 px line width
    // Draw it
    if (description === "cycle") {
        cycle();  // draw the cycle
    } else if (description === "spiral") {
        spiral(); // draw the spiral
    } else if (description === "helix") {
        helix();  // draw the helix
    } else if (description === "cycles") {
        cycles();
    } else if (description === "triangle") {
        // Set initial parameters
        const step = Math.min(w, h);
        const final = 2;
        let angle = 0;  // initial angle
        let x = 0.5 * (w - step);  // initial position near the center of the screen
        let y = 0.5 * (h - step);
        context.moveTo(x, y);
        context.lineWidth = 1;  // 1 px line width
        triangle(x, y, angle, step, final);
    } else if (description === "koch") {
        const turn = - Math.PI * 120 / 180;  // turn right on 120 degrees
        const final = 1;
        let size = 0.8 * Math.min(w, h);  // initial size of triangle
        let x = 0.5 * (w - size);  // initial position
        let y = 0.72 * h;
        let angle = 0;  // initial angle
        context.moveTo(x, y);
        context.lineWidth = 1;  // 1 px line width
        for (let i = 0; i < 3; i++) {
            [x, y] = koch(x, y, angle, size, final);
            angle += turn;
        }
    }
    context.stroke();  // draw the path on the canvas
}

// Draw the cycle
function cycle()
{
    // Set initial parameters
    const turn = Math.PI * 93 / 180;  // 93 degrees in radians
    const step = 0.707 * Math.min(w, h);  // step is comparable to the screen size
    var x = 0.5 * (w - step);  // initial position near the center of the screen
    var y = 0.56 * (h - step);
    var angle = 0;  // initial angle

    // Loop until the polyline closes
    context.moveTo(x, y);
    do {
        x = x + step * Math.cos(angle);  // move forward
        y = y + step * Math.sin(angle);
        context.lineTo(x, y);  // draw line segment
        angle += turn;  // new angle
    } while((parseInt(180 * angle / Math.PI, 10) % 360) !== 0);
}

// Draw the spiral
function spiral()
{
    // Set initial parameters
    const turn = Math.PI * 117 / 180;  // 117 degrees in radians
    const add = 5;  // add 5 pixels to each step forward
    var step = 10;  // initial step is small, but gradually increases
    var x = 0.5 * w;  // initial position near the center of the screen
    var y = 0.5 * h;
    var angle = 0;  // initial angle

    // Loop until the polyline closes
    context.moveTo(x, y);
    for (let i = 0; i < 100; i++) {
        x = x + step * Math.cos(angle);  // move forward
        y = y + step * Math.sin(angle);
        context.lineTo(x, y);  // draw line segment
        angle += turn;  // new angle
        step += add;  // new step size
    }
}

// Draw the helix
function helix()
{
    // Set initial parameters
    const add_step = 1;  // add 1 pixel to each step
    const add_angle = -0.2 * Math.PI / 180;  // -0.2 angle decrease on each step
    var step = 10;  // initial step is small, but gradually increases
    var turn = Math.PI * 30 / 180;  // 30 degrees in radians
    var angle = 0;  // initial angle
    var x = 0.5 * w;  // initial position near the center of the screen
    var y = 0.5 * h;

    // Loop until the polyline closes
    context.moveTo(x, y);
    for (let i = 0; i < 100; i++) {
        x = x + step * Math.cos(angle);  // move forward
        y = y + step * Math.sin(angle);
        context.lineTo(x, y);  // draw line segment
        angle += turn;  // new angle
        step += add_step;  // new step size
        turn += add_angle;  // new turning angle
    }
}

// Draw the cycles
function cycles()
{
    // Set initial parameters
    const step = 2;  // initial step
    const turn = - Math.PI / 180;  // -1 degree in radians
    var angle = 0;  // initial angle
    var x = 0.5 * w;  // initial position near the center of the screen
    var y = 0.5 * h;

    // Loop until the cycle closes
    context.moveTo(x, y);
    for (let i = 0; i < 36; i++) {
        angle += Math.PI * 10 / 180;
        for (let j = 0; j < 360; j++) {
            x = x + step * Math.cos(angle);  // move forward
            y = y + step * Math.sin(angle);
            context.lineTo(x, y);  // draw line segment
            angle += turn;  // new angle
        }
    }
}

// Draw nested triangles
function triangle(x, y, angle, step, final)
{
    if (step > final) {
        const turn = Math.PI * 120 / 180;  // turn left 120 degree in radians
        for (let i = 0; i < 3; i++) {
            triangle(x, y, angle, 0.5*step, final);
            x = x + step * Math.cos(angle);  // move forward
            y = y + step * Math.sin(angle);
            context.lineTo(x, y);  // draw line segment
            angle += turn;  // new angle
        }
    }
}

// Draw Koch Snowflake
function koch(x, y, angle, size, final)
{
    if (size < final) {
        x = x + size * Math.cos(angle);  // move forward
        y = y + size * Math.sin(angle);
        context.lineTo(x, y);  // draw line segment
    } else {
        [x, y] = koch(x, y, angle, size/3, final);
        angle += Math.PI * 60 / 180;
        [x, y] = koch(x, y, angle, size/3, final);
        angle += - Math.PI * 120 / 180;
        [x, y] = koch(x, y, angle, size/3, final);
        angle += Math.PI * 60 / 180;
        [x, y] = koch(x, y, angle, size/3, final);
    }
    return [x, y];  // return new position
}

draw();  // draw the figure
window.addEventListener("resize", draw);  // redraw when the window is resized
