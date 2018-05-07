var canvas = document.getElementById("sierpinski");
var context  = canvas.getContext("2d");

var width  = window.innerWidth;
var height = window.innerHeight;
var delta  = 10;

//Set canvas width and height
canvas.width  = width
canvas.height = height;

function triangle(x1, y1,
                  x2, y2,
                  x3, y3)
{
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.lineTo(x3, y3);
    context.lineTo(x1, y1);
    context.stroke();
}

function Sierpinski_Gasket(x1, y1,
                           x2, y2,
                           x3, y3)
{
    var recursion = 8;
    triangle(x1,y1,  x2,y2,  x3,y3);
    draw_gasket(x1,y1,  x2,y2,  x3,y3,  recursion)
}

function draw_gasket(x1, y1,
                     x2, y2,
                     x3, y3, recursion)
{
    if (!recursion--) { return; }

    var r1 = Math.random();
    var m1 = x1 + (x2 - x1) * r1;
    var n1 = y1 + (y2 - y1) * r1;

    var r2 = Math.random();
    var m2 = x2 + (x3 - x2) * r2;
    var n2 = y2 + (y3 - y2) * r2;

    var r3 = Math.random();
    var m3 = x3 + (x1 - x3) * r3;
    var n3 = y3 + (y1 - y3) * r3;

    triangle(m1,n1,  m2,n2,  m3,n3);

    draw_gasket(x1,y1,  m1,n1,  m3,n3,  recursion);
    draw_gasket(m1,n1,  x2,y2,  m2,n2,  recursion);
    draw_gasket(m3,n3,  m2,n2,  x3,y3,  recursion);
}

Sierpinski_Gasket(width - delta, height - delta,
                  delta,         height - delta,
                  width / 2,     delta);

