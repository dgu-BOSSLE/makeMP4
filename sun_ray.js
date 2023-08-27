var rays = new Object({
  canvas: false,
  context: false,
  offset: 0,
  offsets: [],
  opacity: 0,
  opacitys: [],
  speed: 0.005,
  animating: false,
  ray_color: '',

  // mid_x_pro: 30,
  // mid_y_pro: 30,

  mid_x: 0,
  mid_y: 0,
  diameter: 0,
  radius: 0,
  num_rays: 96,
  ray_angle: 0,
  ray_angle_pro: 2,
  sweep_angle: 0,

  init: function (id, ray_color) {
    this.canvas = document.getElementById(id);
    this.ray_color = ray_color;

    this.ray_angle = Math.PI / this.num_rays
    this.sweep_angle = this.ray_angle * 2;

    rays.mid_x = rays.canvas.width / 2;
    rays.mid_y = rays.canvas.height / 2;


    for (i = 0; i < rays.num_rays; i++) {
      this.offsets[i] = Math.random() * Math.PI * 2; // Random starting offset for each ray
    }

    this.resetCanvas();
    requestAnimationFrame(this.animate);
    this.draw();
    window.addEventListener('resize', this.resetCanvas);
  },
  animate: function () {
    if (!rays.animating) { // prevent calling too frequently if  animating
      rays.animating = true;
      rays.update();
      rays.draw();
      window.requestAnimationFrame(rays.animate);
    }
  },
  update: function () {
    rays.offset += rays.speed;
    for (i = 0; i < rays.num_rays; i++) {
      this.opacitys[i] = Math.abs(Math.sin(rays.offset + this.offsets[i])) * 0.8 + 0.2; // Random starting offset for each ray
    }
    // Update gradient opacity values
    this.opacity = Math.abs(Math.sin(rays.offset)) * 0.8 + 0.2; // Adjust the opacity range as needed
  },
  resetCanvas: function () {
    // Resize the canvas and reset context options
    rays.canvas.width = rays.canvas.offsetWidth;
    rays.canvas.height = rays.canvas.offsetHeight;
    rays.context = rays.canvas.getContext('2d');
    rays.context.fillStyle = rays.ray_color;

    // Update vars for drawing (based on the screen size)
    rays.mid_x = mid_x_pro * rays.canvas.width / 100;
    rays.mid_y = mid_y_pro * rays.canvas.height / 100;
    rays.diameter = Math.sqrt(Math.pow(rays.canvas.width, 2) + Math.pow(rays.canvas.height, 2));
    rays.radius = rays.diameter;
  },
  draw: function () {
    var c = this.canvas;

    this.context.clearRect(0, 0, c.width, c.height);

    for (i = 0; i < this.num_rays; i++) {
      this.context.beginPath();

      var gradient = this.context.createRadialGradient(this.mid_x, this.mid_y, 0, this.mid_x, this.mid_y, this.radius);
      var temp_opacity = this.opacitys[i];
      gradient.addColorStop(0, `rgba(255, 255, 255, ${temp_opacity * 1.0})`);
      gradient.addColorStop(0.1, `rgba(255, 255, 255, ${temp_opacity * 0.2})`);
      gradient.addColorStop(0.7, `rgba(255, 255, 255, ${temp_opacity * 0.01})`);
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      this.context.fillStyle = gradient;
      var start_angle = (this.sweep_angle * i); //+this.offset for spin
      var end_angle = start_angle + this.ray_angle * this.ray_angle_pro;

      this.context.moveTo(this.mid_x, this.mid_y);
      this.context.arc(this.mid_x, this.mid_y, this.radius, start_angle, end_angle, false);
      this.context.fill();
    }

    rays.animating = false;
  }
});

rays.init('ray', 'rgba(255,255,255,0.1)');