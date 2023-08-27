(function () {
	'use strict';

	var cvs, ctx, mousePos;

	// var mid_x_pro = 30, mid_y_pro = 30;
	var lens_trs = 0.35

	var mid_x, mid_y;

	function init() {
		cvs = document.getElementById("flare");
		ctx = cvs.getContext("2d");
		cvs.width = window.innerWidth;
		cvs.height = window.innerHeight;
		var fire = new Flare();
		fire.update({ x: cvs.width * 7 / 10, y: cvs.height * 6 / 10 });
		window.addEventListener("mousemove", function (a) {
			mousePos = getMousePos(cvs, a);
			fire.update(mousePos);
		});
	}

	function Flare() {
		this.discs = [];
		this.discNum = 9;
		this.t = 0;
		this.draw = function (obj) {
			ctx.globalCompositeOperation = "screen";

			var dist = 1 -
				0.5 * Math.sqrt(Math.pow((obj.x - mid_x), 2) + Math.pow((obj.y - mid_y), 2)) /
				Math.sqrt(Math.pow((cvs.width / 2), 2) + Math.pow((cvs.height / 2), 2));
			// console.log(dist);

			for (var i = 0; i < this.discs.length; i++) {
				ctx.beginPath();
				var hue = this.discs[i].hue;
				var grad = ctx.createRadialGradient(this.discs[i].x, this.discs[i].y, 0, this.discs[i].x, this.discs[i].y, this.discs[i].dia);
				grad.addColorStop(0, "hsla(" + hue + ",100%,90%," + 0 * dist + ")");
				grad.addColorStop(0.9, "hsla(" + hue + ",100%,90%," + lens_trs * dist + ")");
				grad.addColorStop(1, "hsla(" + hue + ",100%,90%,0)");
				ctx.fillStyle = grad;
				ctx.arc(this.discs[i].x, this.discs[i].y, this.discs[i].dia, 0, Math.PI * 2);
				ctx.closePath();
				ctx.fill();
				if (i == 0) {
					ctx.beginPath();
					var grad = ctx.createRadialGradient(this.discs[i].x, this.discs[i].y, 0, this.discs[i].x, this.discs[i].y, this.discs[i].dia * 2);
					grad.addColorStop(0, "rgba(200,220,255," + 0.2 * dist + ")");
					grad.addColorStop(1, "rgba(200,220,255,0)");
					ctx.fillStyle = grad;
					ctx.arc(this.discs[i].x, this.discs[i].y, this.discs[i].dia * 2, 0, Math.PI * 2);
					ctx.closePath();
					ctx.fill();

					ctx.beginPath();
					var ease = function (a, b, t) {
						return (b - a) * (1 - Math.pow(t - 1, 2)) + a;
					}
					var spec = ease((this.discs[i].dia / 2.5) / 2, (this.discs[i].dia / 2.5), dist);
					var sdist = (1 - Math.pow(Math.abs(dist - 1), 3))
					var grad = ctx.createRadialGradient(this.discs[i].x, this.discs[i].y, 0, this.discs[i].x, this.discs[i].y, spec);
					grad.addColorStop(0.2 * sdist, "rgba(196,196,196," + sdist + ")");
					grad.addColorStop(0.6, "hsla(" + this.discs[i].hue + ",100%,75%," + .3 * sdist + ")");
					grad.addColorStop(1, "hsla(" + this.discs[i].hue + ",100%,40%,0)");
					ctx.fillStyle = grad;
					ctx.arc(this.discs[i].x, this.discs[i].y, this.discs[i].dia / 2.5, 0, Math.PI * 2);
					ctx.closePath();
					ctx.fill();

					ctx.beginPath();
					var grad = ctx.createLinearGradient(
						this.discs[i].x - this.discs[i].dia * 1.5, this.discs[i].y,
						this.discs[i].x + this.discs[i].dia * 1.5, this.discs[i].y);
					grad.addColorStop(0, "rgba(240,250,255,0)");
					grad.addColorStop(.5, "rgba(240,250,255," + .4 * dist * dist * dist + ")");
					grad.addColorStop(1, "rgba(240,250,255,0)");
					ctx.fillStyle = grad;
					ctx.fillRect(
						this.discs[i].x - this.discs[i].dia * 1.5, this.discs[i].y - 2,
						this.discs[i].dia * 3, 4);
					ctx.closePath();
					ctx.fill();

					ctx.beginPath();
					var grad = ctx.createLinearGradient(
						this.discs[i].x, this.discs[i].y - this.discs[i].dia * 1.5,
						this.discs[i].x, this.discs[i].y + this.discs[i].dia * 1.5);
					grad.addColorStop(0, "rgba(240,250,255,0)");
					grad.addColorStop(.5, "rgba(240,250,255," + .4 * dist * dist * dist + ")");
					grad.addColorStop(1, "rgba(240,250,255,0)");
					ctx.fillStyle = grad;
					ctx.fillRect(
						this.discs[i].x - 2, this.discs[i].y - this.discs[i].dia * 1.5,
						4, this.discs[i].dia * 3);
					ctx.closePath();
					ctx.fill();

				}
				if (i == this.discs.length - 1){
					ctx.beginPath();
					var hue = 0;
					var grad = ctx.createRadialGradient(mid_x, mid_y, 0, mid_x, mid_y, 50);
					grad.addColorStop(0, "rgba(255,255,255,1)");
					grad.addColorStop(0.25, "rgba(255,255,255,0.9)");
					grad.addColorStop(0.5, "rgba(255,255,255,0.8)");
					grad.addColorStop(0.75, "rgba(255,255,255,0.3)");
					grad.addColorStop(1, "rgba(255,255,255,0)");
					ctx.fillStyle = grad;
					ctx.arc(mid_x, mid_y, 50, 0, Math.PI * 2);
					ctx.closePath();
					ctx.fill();
				}
			}
		};

		this.update = function (obj) {
			ctx.clearRect(0, 0, cvs.width, cvs.height);
			mid_x = mid_x_pro * cvs.width / 100;
			mid_y = mid_y_pro * cvs.height / 100;
			for (var i = 0; i <= this.discNum; i++) {
				var temp = {};
				var j = i * 0.9 - this.discNum;
				temp.x = (mid_x - obj.x) * (j / this.discNum * 1) + mid_x;
				temp.y = (mid_y - obj.y) * (j / this.discNum * 1) + mid_y;
				if (this.t == 0) {
					temp.dia = (Math.pow(Math.abs(7 * (j / this.discNum)), 2) * 3) + (Math.random() * 20 + 10);
					temp.hue = Math.round(Math.random() * 360);
					this.discs[i] = temp;
				}
				else {
					this.discs[i].x = temp.x;
					this.discs[i].y = temp.y;
				}
			}
			this.t += 1;
			this.draw(obj);
		}
	}

	function getMousePos(cvs, evt) {
		var rect = cvs.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}

	document.addEventListener('DOMContentLoaded', init, false);
})();