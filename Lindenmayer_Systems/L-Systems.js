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
    if (description === "koch-turtle") {
        const final = 1;  // final size of the line segment
        let size = 0.7 * Math.min(w, h);  // initial size of triangle
        let turtle = new Turtle(0.5 * (w - size), 0.62 * h, 0);
        for (let i = 0; i < 3; i++) {
            koch(turtle, size, final);
            turtle.turn_right(Math.PI * 120 / 180);
        }
    } else if (description === "dragon-turtle") {
        let level = 16;
        let length = 2;
        let turtle = new Turtle(0.35 * w, 0.63 * h, 0);
        left_dragon(turtle, length, level);
    } else if (description === "koch") {
        let str = "F-F+F+F-F";
        let replace_rule = [{char: "F", replace: "F-F+F+F-F"}];
        let draw_rule = {move_forward: "F", turn_left: "-", turn_right: "+"};
        let level = 5;
        let size = 1;
        let angle = Math.PI / 2;
        str = create_string(str, replace_rule, level);
        let turtle = new Turtle(0.2*w, 0.33*h, 0);
        draw_string(turtle, str, size, angle, draw_rule, 0);
    } else if (description === "dragon") {
        let str = "FX";
        let replace_rule = [{char: "X", replace: "X+YF"},
                            {char: "Y", replace: "FX-Y"}];
        let draw_rule = {move_forward: "F", turn_left: "-", turn_right: "+"};
        let level = 16;
        let size = 2;
        let angle = Math.PI / 2;
        str = create_string(str, replace_rule, level);
        let turtle = new Turtle(0.2*w, 0.33*h, 0);
        draw_string(turtle, str, size, angle, draw_rule, 0);
    } else if (description === "Arrowhead Gasket") {
        let str = "A";
        let replace_rule = [{char: "A", replace: "B+A+B"},
                            {char: "B", replace: "A-B-A"}];
        let draw_rule = {move_forward: "AB", turn_left: "-", turn_right: "+"};
        let level = 8;
        let size = 2.7;
        let angle = Math.PI / 3;
        str = create_string(str, replace_rule, level);
        let turtle = new Turtle(10, 10, 0);
        draw_string(turtle, str, size, angle, draw_rule, 0);
    } else if (description === "Spiky Square") {
        let axiom = "FC-FC-FC-F";
        let replace_rule = [{char: "F", replace: "FA-FB+FA-F"}];
        let variables = [
            {char: "A", value: 17},
            {char: "B", value: 34},
            {char: "C", value: 18}];
        let draw_rule = {move_forward: "F", turn_left: "-", turn_right: "+", variables: variables};
        let level = 6;
        let size = 5;
        let angle = Math.PI / 36;  // 5 degrees
        let str = create_string(axiom, replace_rule, level);
        let turtle = new Turtle(0, 0, 0);
        draw_string(turtle, str, size, angle, draw_rule, 0);
    } else if (description === "Simple L-System with recursion") {
        let axiom = "F";
        let replace_rule = [{char: "F", replace: "F[-F]F"}];
        let draw_rule = {move_forward: "F", turn_left: "-", turn_right: "+",
                         recursion_start: "[", recursion_end: "]"};
        let level = 2;
        let size = 5;
        let angle = Math.PI / 2;
        let str = create_string(axiom, replace_rule, level);
        let turtle = new Turtle(w/2, h/2, 0);
        draw_string(turtle, str, size, angle, draw_rule, 0);
    }

    context.stroke();  // draw the path on the canvas
}

// Create string using axiom (starting) string and rules
function create_string(str, replace_rule, level) {
    for(let i = 0; i < level; i++) {
        let new_str = "";
        let len = str.length;
        for(let j = 0; j < len; j++) {
            let c = str[j];
            let replaced = false;
            let num_rules = replace_rule.length;
            for(let k = 0; k < num_rules; k++) {
                if(c === replace_rule[k].char) {
                    new_str += replace_rule[k].replace;
                    replaced = true;
                } else if(((k+1) === num_rules) && (!replaced)) {
                    new_str += c;
                }
            }
        }
        str = new_str;
    }
    return str;
}

// Draw string from created string
function draw_string(turtle, str, size, angle, draw_rule, position) {
    let multiply = 1;
    let len_vars = 0;
    if (draw_rule.variables) {
        len_vars = draw_rule.variables.length;
    }
    let recursion = false;
    if (draw_rule.recursion_start && draw_rule.recursion_end) {
        recursion = true;
    }
    let len = str.length;

    while(position < len) {
        if(draw_rule.move_forward.includes(str[position])) {
            turtle.move_forward(multiply * size);
            multiply = 1;
        }
        else if(draw_rule.turn_left.includes(str[position])) {
            turtle.turn_left(multiply * angle);
            multiply = 1;
        }
        else if(draw_rule.turn_right.includes(str[position])) {
            turtle.turn_right(multiply * angle);
            multiply = 1;
        }
        else if(recursion && draw_rule.recursion_start.includes(str[position])) {
            position++;
            let x = turtle.x;  // remember current position
            let y = turtle.y;
            let a = turtle.angle;
            draw_string(turtle, str, size, angle, draw_rule, position);
            turtle = new Turtle(x, y, a);  // return to the previous position
        }
        else if(recursion && draw_rule.recursion_end.includes(str[position])) {
            return;
        } else {
            for(let j = 0; j < len_vars; j++) {
                if(draw_rule.variables[j].char === str[position]) {
                    multiply = draw_rule.variables[j].value;
                }
            }
        }
        position++;
    }
}

// Draw Koch Square Curve recursively
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

// Draw Dragon with 2 recursive functions: left_dragon, right_dragon.
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
