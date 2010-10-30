var canvas;
var ctx;
var canvasW;
var canvasH;
var centerX;
var centerY;
var mouseX;
var mouseY;
var mouseEffectRange = 30;
var amount = 500;
var particles = [];
var startSmooth = 60;
var loopSmooth = 16;
var endAngle = Math.PI * 2;
var isMouseDown = false;

init();

function init () {
	canvas = document.getElementById('world');
	canvasW = canvas.width;
	canvasH = canvas.height;
	centerX = canvasW / 2;
	centerY = canvasH / 2;
	smooth = startSmooth;
	if (canvas.getContext) {
		setup();
		setInterval(loop, 1000/60);
	}
}

function setup () {
	ctx = canvas.getContext('2d');

	var i = amount;
	while (i--) {
		var p = new Particle();
		p.degree = Math.floor( Math.random() * 360 );
		p.radius = Math.floor( Math.random() * canvasW * 0.5 );
		p.x = p.distX = Math.floor( Math.random() * canvasW );
		p.y = p.distY = Math.floor( Math.random() * canvasH );
		p.size = 1 + Math.floor( Math.random() * ( p.radius * 0.045 ) );
		particles[i] = p;
	}

	canvas.onmousemove = mousemove;
	canvas.onmousedown = mousedown;
	canvas.onmouseup = mouseup;

	var itvl = setInterval(function () {
		smooth--;
		if (smooth === loopSmooth) clearInterval(itvl);
	}, 1000/8);
}

function loop () {
	ctx.globalCompositeOperation = 'source-over';
	ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
	ctx.fillRect(0, 0, canvasW, canvasH);
	ctx.globalCompositeOperation = 'lighter';

	var mx = mouseX || null;
	var my = mouseY || null;
	var range = mouseEffectRange;
	if (isMouseDown) {
		range = mouseEffectRange * 2;
	}
	var i = amount;
	while (i--) {
		var p = particles[i];
		var radian = Math.PI / 180 * p.degree;
		p.distX = centerX + p.radius * Math.cos(radian);
		p.distY = centerY + p.radius * Math.sin(radian) * 0.4;
		if ( mx && my ) {
			var rebound = Math.floor( (range * 0.5) + Math.random() * (range * 0.9) );
			if ( p.distX - mx > 0 && p.distX - mx < range && p.distY - my > 0 && p.distY - my < range ) {
				p.distX += rebound;
				p.distY += rebound;
			} else if ( p.distX - mx > 0 && p.distX - mx < range && p.distY - my < 0 && p.distY - my > -range ) {
				p.distX += rebound;
				p.distY -= rebound;
			} else if ( p.distX - mx < 0 && p.distX - mx > -range && p.distY - my > 0 && p.distY - my < range ) {
				p.distX -= rebound;
				p.distY += rebound;
			} else if ( p.distX - mx < 0 && p.distX - mx > -range && p.distY - my < 0 && p.distY - my > -range ) {
				p.distY -= rebound;
				p.distY -= rebound;
			}
		}
		p.x += ( (p.distX - p.x) / smooth );
		p.y += ( (p.distY - p.y) / smooth );
		var x = p.x;
		var y = p.y;
		var size =  p.size * ( p.y * 1.5 / canvasH );
		if (size < 0.1) {
			size = 0;
		}
		ctx.beginPath();
		ctx.fillStyle = p.color;
		ctx.arc(x, y, size, 0, endAngle, true);
		ctx.fill();
		ctx.closePath();
		
		var addDegree;
		if ( p.size < 2 ) {
			addDegree = 4;
		} else if ( p.size < 3 ) {
			addDegree = 3;
		} else if ( p.size < 4 ) {
			addDegree = 2;
		} else {
			addDegree = 1;
		}
		addDegree *= ( p.y / ( canvasH * 0.8 ) );
		p.degree += addDegree;
		p.degree = p.degree % 360;
	}

    /*
	 * ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
	 * if (mx && my) {
	 *     ctx.fillRect(mx-range, my-range, range*2, range*2);
	 * }
     */

}

function mousemove (e) {
	var p = getPosition(e.target);
	var scrollX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
	var scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
	mouseX = e.clientX - p.x + scrollX;
	mouseY = e.clientY - p.y + scrollY;
}

function mousedown (e) {
	isMouseDown = true;
}

function mouseup (e) {
	isMouseDown = false;
}

function Particle () {
	this.degree = 0;
	this.radius = 0;
	this.x = 0;
	this.y = 0;
	this.distX = 0;
	this.distY = 0;
	this.color = 'rgb(' + Math.floor( Math.random() * 127 ) + ',' + Math.floor( Math.random() * 127 ) + ',' + Math.floor( Math.random() * 127 ) + ')';
	this.size;
}

function getPosition (element) {
	var obj = {};
	obj.x = element.offsetLeft || 0;
	obj.y = element.offsetTop || 0;
	while (element.offsetParent) {
		element = element.offsetParent;
		obj.x += element.offsetLeft;
		obj.y += element.offsetTop;
	}
	return obj;
}
