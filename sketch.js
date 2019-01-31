let time = 0;
let no;
let yes;
let ship;
var test;
let play_button;
let asteroids = [];
let dead = false;
let stage = 0;
let particles = [];
let counter = 1;	
let counter2 = 0;
let bullets = [];

function preload() {
  no = loadImage('rsz_38483.png');
  yes = loadImage('1rsz_38483.png');
  play_button = loadImage('Play_Button.png');
  test = loadImage('test.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight - 5);
  background(0);
  ship = new Ship;
  imageMode(CENTER);
  setInterval(function() {
      counter2 = 0;
  }, 3000);
  setInterval(function() {
    if (stage != 1 || dead) {
      return
    } else {
      time++;
      asteroids.push(new Asteroid(random(windowWidth), random(windowHeight)));
    }
  }, 1000);  
}
  
function draw() {
  background(255);
  switch(stage) {
  case 0:                                                     // main menu
  //image(play_button, width / 2, (height / 2) + 100);
  image(test, width / 2, (height / 2) + 100);
  textSize(width / 12.8);
  fill(255);
  text('Asteroid Dodge', width / 3.9, height / 2);
  break;

  case 1:                                                     // the game
    textSize(20);
    fill(255);
    strokeWeight(1);
    text(`Time survived: ${time} sec`, 20, 30);
    for (i = 0; i < asteroids.length; i++) {
      asteroids[i].update();
      asteroids[i].render();
    }
    for (j = 0; j < bullets.length; j++) {
      bullets[j].update();
      bullets[j].render();
      bullets[j].collision();
      if (bullets[j].pos.x < 0 || bullets[j].pos.x > width || bullets[j].pos.y < 0 || bullets[j].pos.y > height) {
        bullets.splice(j, 1);
      }
    }
    for (k = 0; k < particles.length; k++) {
      particles[k].update();
      particles[k].render();
      if (particles[k].life < 0) {
        particles.splice(k, 1);
      }
    }
    moving1();
    ship.show();
    ship.update();
    
    break;

  case 2:                                                           // game ended
    ship.death(1);
    textSize(width / 25);
    fill(255);
    strokeWeight(3);
    text(`You survived: ${time} sec`, width / 3, height / 2.7);
    textSize(width / 30);
    text('Restart', width / 2.245, height / 2);
    image(play_button, width / 2, (height / 2) + 130);
    for (i = 0; i < asteroids.length; i++) {
      asteroids[i].update();
      asteroids[i].render();
    }
    for (j = 0; j < particles.length; j++) {
      particles[j].update();
      particles[j].render();
      if (particles[j].life < 0) {
        particles.splice(j, 1);
      }
    }
    break;
  }
}

function Ship() {
  this.r = 4.2;
  this.img = no;
  this.pos = createVector(windowWidth / 2, windowHeight / 2);
  this.angle = 0;
  this.vel = createVector();
  this.update = function() {
    this.pos.add(this.vel); 
    if (this.pos.x > windowWidth) {
      this.pos.x = 0;
    }
    else if (this.pos.x < 0) {
      this.pos.x = windowWidth;
    }

    else if (this.pos.y > windowHeight) {
      this.pos.y = 0;
    }

    else if (this.pos.y < 0) {
      this.pos.y = windowHeight;
    }
  }
  this.show = function() {
  translate(this.pos.x, this.pos.y);
  rotate(this.angle);
  image(this.img, 0, 0);
  }
  this.shoot = function() {
    bullets.push(new Bullet(ship.pos.x, ship.pos.y));
  }
  this.death = function() {
    while(counter < 201) {
      particles.push(new Particle(this.pos.x, this.pos.y, 6, true));
      counter++;
    }
  }
}

function Asteroid(x, y) {
  this.spawn = Math.floor(random(0, 4));
  switch(this.spawn) {
    case 0:
      this.pos = createVector(0, random(0, height));               //left
      this.vel = createVector(random(0, 3), random(-3, 3));
    break;
      
    case 1:
      this.pos = createVector(width, random(0, height));           //right
      this.vel = createVector(random(-3, 3), random(-3, 0));
    break;
      
    case 2:
      this.pos = createVector(random(0, width), 0);                //top
      this.vel = createVector(random(-3, 3), random(0, 3));
    break;
      
    case 3:
      this.pos = createVector(random(0, width), height);           //bottom
      this.vel = createVector(random(-3, 3), random(0, -3));
    break;
  }
  this.d;
  this.velmag = Math.sqrt(Math.pow(this.vel.x, 2), Math.pow(this.vel.y, 2));
  this.angle = Math.atan2(this.vel.x, this.vel.y) / (Math.PI/180);
  this.r = random(6, 15);
  this.update = function() {
  this.d = dist(this.pos.x, this.pos.y, ship.pos.x, ship.pos.y);
  this.pos.add(this.vel);
    if (this.pos.x > windowWidth) {
      this.pos.x = 0;
    }
    else if (this.pos.x < 0) {
      this.pos.x = windowWidth;
    }

    else if (this.pos.y > windowHeight) {
      this.pos.y = 0;
    }

    else if (this.pos.y < 0) {
      this.pos.y = windowHeight;
    }
    else if (this.d < this.r * ship.r) {
    dead = true;
    stage = 2;
    }
  }
  this.render = function() {
    push();
    stroke(255);
    strokeWeight(2);
    noFill()
    translate(this.pos.x, this.pos.y);
    beginShape();
    for (var i = 0; i < 10; i++) {
      var angle = map(i, 0, 10, 0, TWO_PI);
      var x = (this.r * Math.PI) * cos(angle);
      var y = (this.r * Math.PI) * sin(angle);
      vertex(x, y);
    }
    endShape(CLOSE);
    pop();
    this.death = function() { 
    while(counter < 201) {
      particles.push(new Particle(this.pos.x, this.pos.y, 6, true));
      counter++;
    }
   }
  }
}

function Particle(x, y, life, vel) {
  this.pos = createVector(x, y);
  if (vel) {
    this.vel = p5.Vector.random2D();
    this.vel.mult(random(0.1, 3));
  } else {
    this.vel = 0;
  } 
  this.life = 255;
  this.update = function() {
    this.pos.add(this.vel);
    this.life -= life;
  }
  this.render = function() {
    fill(255);
    strokeWeight(3);
    stroke(255, this.life);
    point(this.pos.x, this.pos.y);
  }
}

function Bullet(x, y) {
  this.combo = 0;
  this.angle = ship.angle;
  this.pos = createVector(x, y);
  this.vel = createVector(Math.cos(this.angle) * 25, Math.sin(this.angle) * 25);
  this.update = function() {
    this.pos.add(this.vel);
  }
  this.render = function() {
    fill(255);
    strokeWeight(5);
    stroke(255);
    point(this.pos.x, this.pos.y);
    particles.push(new Particle(this.pos.x, this.pos.y, 15, false));
  }
  this.collision = function() {
    for (var i = 0; i < asteroids.length; i++) {
      if (dist(asteroids[i].pos.x, asteroids[i].pos.y, this.pos.x, this.pos.y) < ((asteroids[i].r + 0.5) * 3)) {
        for(var j = 0; j < 200; j++) {
          particles.push(new Particle(asteroids[i].pos.x, asteroids[i].pos.y, 6, true));
        }
        this.lastPos = createVector(asteroids[i].pos.x, asteroids[i].pos.y);
        asteroids.splice(i, 1);
        this.combo++;
        if (this.combo > 1) {
          time += 5;
          console.log('Combo');
        }
      }
    }
  }
}

function moving1() {
  if (dead) {
    return
  } else {
    if (keyIsDown(LEFT_ARROW)) {
      ship.angle -= 0.0872664626 / 3;
    }
  
    if (keyIsDown(RIGHT_ARROW)) {
      ship.angle += 0.0872664626 / 3;
    }

    if (keyIsDown(UP_ARROW)) {
      ship.img = yes;
      fx = Math.cos(ship.angle) * 0.1;
      fy = Math.sin(ship.angle) * 0.1;
      ship.vel.x = ship.vel.x + fx;
      ship.vel.y = ship.vel.y + fy;
    } else {
      ship.img = no;
    }
  }
}

function mouseClicked() {
  if ((mouseX < (width / 2) + 50 && mouseX > (width / 2) - 50 && mouseY < ((height / 2) + 100) + 50 && mouseY > ((height / 2) + 100) - 50) && (stage == 0 || stage == 2)) {
    counter = 1;
    stage = 1;
    dead = false;
    time = 0;
    asteroids = [];
    ship.pos = createVector(windowWidth / 2, windowHeight / 2);
    ship.angle = 0;
    ship.vel.x = 0;
    ship.vel.y = 0;
  } else {
    return;
  }
}

function keyPressed() {
  if (keyCode === 75) {
    stage = 2;
  } else if (keyCode === 13) {
    counter = 1;
    stage = 1;
    dead = false;
    time = 0;
    asteroids = [];
    ship.pos = createVector(windowWidth / 2, windowHeight / 2);
    ship.angle = 0;
    ship.vel.x = 0;
    ship.vel.y = 0;
  } else if (keyCode === 32) {
    while (counter2 == 0 && stage == 1) {
      ship.shoot();
      counter2 = 1;
    } 
  }
}



