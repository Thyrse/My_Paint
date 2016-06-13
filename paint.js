/*jslint browser: true, this, white:true, for:true */
/*global window, FileReader */

var beginin = false;
var draw = false;

var cursorX = null;
var cursorY = null;
var cursorX2 = null;
var cursorY2 = null;
var current = 'only_draw';
var current_fill = false;
var gomme = false;

var right_line = false;
var rect_line = false;
var circle_line = false;
var upload_img = false;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var array_background = document.getElementsByTagName('a');
var save_work = document.getElementById("save_work");
var refresh = document.getElementById("refresh");


/*FONCTION DU CHANGEMENT DE TAILLE DES TRAITS/CRAYON*/

function updateTextInput(val) {
    "use strict";
    var range = document.getElementById("textInput").value;
    range = val;
    ctx.lineWidth = range;
}

function uploadFile() {
    "use strict";
    var preview = document.getElementById('img_user'); //selects the query named img
    var file    = document.getElementById('input_img').files[0]; //sames as here
    var reader  = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result;
    };
    if (file) {
           reader.readAsDataURL(file); //reads the data as a URL
       } else {
        preview.src = "";
    }
}

/*COLORATION DES CERCLES*/
function color() {
    "use strict";
    var i = 0;
    var color_cible;
    for (i = 0; i < array_background.length; i += 1) {
        color_cible = array_background[i].getAttribute("data-couleur");
        array_background[i].style.backgroundColor = color_cible;
    }  
}
color();

/*FONCTION PRINCIPALE PERMETTANT DE DESSINER*/
function callbackdraw() {
    "use strict";
    var arrow_color = this.getAttribute("data-couleur");
    ctx.strokeStyle = arrow_color;
    ctx.fillStyle = arrow_color;
    var remove_border = document.getElementById("border_round");
    if(remove_border !== null) {
        remove_border.id = "none_border";
    }
    this.id = "border_round";

}

function drawR() {
    "use strict";
    canvas = document.getElementById("canvas");
    var arrow = document.getElementsByTagName("a");
    var i = 0;
    for(i = 0; i < arrow.length; i += 1) {
        arrow[i].addEventListener("click", callbackdraw);
    }
    if (!beginin) {
        ctx.moveTo(cursorX, cursorY);
        ctx.beginPath();
        beginin = true;
    } else {
        ctx.lineTo(cursorX, cursorY);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();
    }
}


canvas.addEventListener('mousedown', function(event) {
    "use strict";
    var begininof_path;
    var endof_path;
    var largest;
    var hauteur;
    

    /*CRAYON*/
    if (current === 'only_draw') {
        cursorX = (event.pageX - this.offsetLeft);
        cursorY = (event.pageY - this.offsetTop);
        draw = true;
    }

    /*REMPLISSAGE*/

    if (current === 'fill_canvas') {
        ctx.fillRect(0,0, canvas.width, canvas.height);
    }
    /*LIGNE*/

    if (current === 'draw_line') {
        if (right_line === false) {
            cursorX = (event.pageX - this.offsetLeft);
            cursorY = (event.pageY - this.offsetTop);
            ctx.beginPath();
            ctx.moveTo(cursorX, cursorY);
            right_line = true;
        } else if (right_line === true) {
            cursorX = (event.pageX - this.offsetLeft);
            cursorY = (event.pageY - this.offsetTop);
            ctx.lineTo(cursorX, cursorY);
            ctx.stroke();
            right_line = false;
        }
    }

    /*RECTANGLE*/

    if(current === 'draw_rect') {
        if(rect_line === false) {
            cursorX = (event.pageX - this.offsetLeft);
            cursorY = (event.pageY - this.offsetTop);
            begininof_path = cursorX;
            endof_path = cursorY;
            ctx.beginPath();
            ctx.moveTo(begininof_path, endof_path);
            rect_line = true;
        } else if (rect_line === true) {

            cursorX2 = (event.pageX - this.offsetLeft);
            cursorY2 = (event.pageY - this.offsetTop);
            largest = cursorX2 - cursorX;
            hauteur = cursorY2 - cursorY;
            ctx.rect(cursorX, cursorY, largest, hauteur);
            if(current_fill === true) {
                ctx.fill();
            }
            ctx.stroke();
            rect_line = false;
        }
    }

    /*CERCLE*/

    if(current === 'draw_circle') {
        if(circle_line === false) {
           cursorX = (event.pageX - this.offsetLeft);
           cursorY = (event.pageY - this.offsetTop);
           ctx.beginPath();
           circle_line = true;
       } else if (circle_line === true) {
        cursorX2 = (event.pageX - this.offsetLeft);
        cursorY2 = (event.pageY - this.offsetTop);
        var distanceX = cursorX2 - cursorX;
        var distanceY = cursorY2 - cursorY;
        var ray_circle = distanceX * distanceX + distanceY * distanceY;
        ctx.arc(cursorX, cursorY, Math.sqrt(ray_circle), 0, 5 * Math.PI, false);
        if(current_fill === true) {
            ctx.fill();
        }
        ctx.stroke();
        circle_line = false;
    }
}


    /*UPLOAD*/


    if (current === "insert_img") {
        if (upload_img === false) {
            cursorX = (event.pageX - this.offsetLeft);
            cursorY = (event.pageY - this.offsetTop);
            begininof_path = cursorX;
            endof_path = cursorY;
            ctx.beginPath();
            upload_img = true;
        } else if (upload_img === true) {
            var contexte = document.getElementById("canvas");
            var final_context = contexte.getContext("2d");
            var img = document.getElementById("img_user");
            cursorX2 = (event.pageX - this.offsetLeft);
            cursorY2 = (event.pageY - this.offsetTop);
           
            largest = cursorX2 - cursorX;
            hauteur = cursorY2 - cursorY;
            final_context.drawImage(img, cursorX, cursorY, largest, hauteur);
            upload_img = false;
        }
    }

});

document.addEventListener('mouseup', function() {
    'use strict';
    draw = false;
    beginin = false;
});

canvas.addEventListener('mousemove', function(e) {
    "use strict";
    if(draw) {
        cursorX = (e.pageX - this.offsetLeft) -2;
        cursorY = (e.pageY - this.offsetTop) -2;
        if(gomme === true) {
            ctx.clearRect(cursorX, cursorY, 10, 10);
        }
        else {
            drawR();
        }
    }
});

/*IMPORT DU CANVAS*/

save_work.addEventListener("click", function() {
    "use strict";
    var img = ctx.canvas.toDataURL("image/png");
    img = img.replace("image/png", "image/octet-stream");
    window.open(img);
});

/*REFRESH DU CANVAS*/

refresh.addEventListener("click", function() {
    "use strict";
    ctx.clearRect(0,0, canvas.width, canvas.height);
});


/*INDICE SUR L'OUTIL EN COURS D'UTILISATION*/
function callimg () {
    "use strict";
    var remove_width = document.getElementById("border_tools");
    if(remove_width !== null) {
        remove_width.id = "none_border";
    }
    this.id = "border_tools";
}

function img () {
    "use strict";

    var tools = document.getElementsByTagName("img");
    var i = 0;
    for(i = 0; i < tools.length; i += 1) {
        tools[i].addEventListener("click", callimg);
    }
}
img();

/*FONCTIONS DE REMPLISSAGE DU CANVAS ET DES FIGURES*/

var clear_rect = document.getElementById("gomme");
clear_rect.addEventListener('click', function() {
    "use strict";
    if(gomme === false) {
        gomme = true;
    } else {
        gomme = false;
    }
});

var fill_figure = document.getElementById("fill_figure");
fill_figure.addEventListener('click', function() {
    "use strict";
    if(current_fill === false) {
        current_fill = true;
    } else {
        current_fill = false;
    }
});

var fill_canvas = document.getElementById("fill_canvas");

fill_canvas.addEventListener('click', function() {
    "use strict";
    current = 'fill_canvas';
});



/*FONCTION PERMETTANT DE DESSINER AU CRAYON*/


var only_draw = document.getElementById("only_draw");

only_draw.addEventListener('click', function() {
    "use strict";
    current = 'only_draw';
});



/*FONCTION PERMETTANT DE TRACER DES LIGNES*/


var draw_line = document.getElementById("draw_line");

draw_line.addEventListener('click', function() {
    "use strict";
    current = 'draw_line';
});


/*FONCTION PERMETTANT DE TRACER DES RECTANGLES*/


var rectangle = document.getElementById("rectangle");

rectangle.addEventListener ('click', function() {
    "use strict";
    current = 'draw_rect';
});


/*FONCTION PERMETTANT DE TRACER UN CERCLE*/


var draw_circle = document.getElementById("draw_circle");

draw_circle.addEventListener('click', function() {
    "use strict";
    current = 'draw_circle';
});


/*FONCTION PERMETTANT L'UPLOAD D'IMAGES*/


var insert_img = document.getElementById("insert_img");

insert_img.addEventListener('click', function() {
    "use strict";
    current = 'insert_img';
});
