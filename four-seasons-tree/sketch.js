let sentence = "X";
let len = 6;
let angle;

let wind = 0;

let isWinter = true;
let isSpring = false;
let isSummer = false;
let isFall = false;

//Seasons 
  // 0-15s = Winter
  // 15-30s = Spring
  // 30-45s = Summer
  // 45-60s = Fall

let seasonLength = 15;
let seasonProgress = 0;

// Season Amounnts (0-1)
let snowAmount = 0;
let snowfall = 0;
let leafAmount = 0;
let blossomAmount = 0;
let turnAmount = 0;
let dropAmount = 0;
let rainAmount = 0;
let sunAmount = 0;

let loudness = 0;

let leaves = [];
let leafIndex = 0;

let snowflakes = [];
let petals = [];
let fallingLeaves = [];

let winterSky, springSky, summerSky, fallSky, stormSky;
let dirtColor, springGrass, summerGrass, fallGrass;
let budColor, leafColor, blossomColor;
let fallColors;

let music;
let started = false;
let finished = false;

function setup() {
  createCanvas(600, 600);
  angle = radians(28);

  for (let i = 0; i < 4; i++) {
    generate();
  }

  // Sky
  winterSky = color(170, 185, 205);
  springSky = color(175, 215, 240);
  summerSky = color(95, 165, 235);
  fallSky = color(240, 180, 110);
  stormSky = color(110, 115, 125);

  // Ground
  dirtColor = color(105, 98, 88);
  springGrass = color(130, 190, 95);
  summerGrass = color(65, 135, 50);
  fallGrass = color(160, 125, 65);

  // Leaves
  budColor = color(170, 210, 100);
  leafColor = color(55, 120, 45);
  blossomColor = color(250, 190, 210);

  fallColors = [
    color(200, 60, 30),
    color(225, 115, 30),
    color(235, 180, 50),
    color(150, 70, 35),
  ];

  // One Leaf Per Branch Tip (X)
  let tips = 0;
  for (let c of sentence) {
    if (c === "X") {
      tips++;
    }
  }

  for (let i = 0; i < tips * 5; i++) {
    leaves.push(makeLeaf());
  }

  // Snowflakes
  for (let i = 0; i < 100; i++) {
    snowflakes.push(makeParticle(random(width), random(height)));
  }

  // Petals
  for (let i = 0; i < 40; i++) {
    petals.push(makeParticle(random(width / 2 - 200, width / 2 + 200), random(200, height - 60)));
  }

  // Falling Leaves
  for (let i = 0; i < 40; i++) {
    fallingLeaves.push(makeParticle(random(width / 2 - 200, width / 2 + 200), random(180, height - 60)));
  }

  // Music
  music = createAudio(["audio/four-seasons.mp3", "four-seasons.mp3"]);
  music.onended(songEnded);
}

function draw() {
  // Song stops before 60s
  let songTime = min(music.time(), seasonLength * 4 - 0.01);

  // Loudness
  let index = min(floor(songTime * 4), musicLoudness.length - 1);
  let target = musicLoudness[index] / 100;
  loudness = lerp(loudness, target, 0.15);

  // Tree Blows in Wind
  wind = sin(frameCount * 0.02) * (0.5 + loudness * 1.5);

  // Season
  let seasonNumber = floor(songTime / seasonLength);
  seasonProgress = (songTime % seasonLength) / seasonLength;

  isWinter = seasonNumber === 0;
  isSpring = seasonNumber === 1;
  isSummer = seasonNumber === 2;
  isFall = seasonNumber === 3;

  // Reset 
  snowAmount = 0;
  snowfall = 0;
  leafAmount = 0;
  blossomAmount = 0;
  turnAmount = 0;
  dropAmount = 0;
  rainAmount = 0;
  sunAmount = 0;

  if (isWinter === true) {
    drawWinter();
  } else if (isSpring === true) {
    drawSpring();
  } else if (isSummer === true) {
    drawSummer();
  } else if (isFall === true) {
    drawFall();
  }

  // Start
  if (started === false) {
    drawMessage("Click to start");
  }

  // End
  if (finished === true) {
    drawMessage("Press R to restart");
    noLoop();
  }
}

function mouseClicked() {
  if (started === false) {
    started = true;
    music.play();
  }
}

function songEnded() {
  finished = true;
}

function keyPressed() {
  // Reset
  if (key === "r" || key === "R") {
    loop();

    started = true;
    finished = false;

    music.time(0);
    music.play();
  }
}

function drawMessage(message) {
  push();
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  text(message, width / 2, 190);
  pop();
}

function drawWinter() {
  // Storm Clears --> Snow Builds Up
  snowAmount = map(seasonProgress, 0.1, 0.5, 0, 1, true);
  snowfall = map(seasonProgress, 0.05, 0.2, 0, 1, true);
  rainAmount = map(seasonProgress, 0, 0.15, 1, 0, true);

  // Sky
  background(lerpColor(winterSky, stormSky, rainAmount));
  drawClouds();

  // Ground
  noStroke();
  fill(dirtColor);
  rect(0, height - 60, width, 60);

  drawFence();
  drawTreeBase();
  drawGroundSnow();
  drawRain();
  drawSnow();
}

function drawSpring() {
  // Snow Melts --> Tree Blooms
  snowAmount = map(seasonProgress, 0, 0.2, 1, 0, true);
  snowfall = map(seasonProgress, 0, 0.1, 1, 0, true);
  leafAmount = map(seasonProgress, 0.1, 0.5, 0, 0.4, true);
  blossomAmount = map(seasonProgress, 0.15, 0.45, 0, 1, true);

  // Sky
  background(lerpColor(winterSky, springSky, map(seasonProgress, 0, 0.2, 0, 1, true)));

  // Ground
  noStroke();
  fill(lerpColor(dirtColor, springGrass, map(seasonProgress, 0.05, 0.25, 0, 1, true)));
  rect(0, height - 60, width, 60);

  drawFence();
  drawTreeBase();
  drawGroundSnow();
  drawPetals();
  drawSnow();
}

function drawSummer() {
  // Leaves Fill Out --> Sun Comes Out
  leafAmount = map(seasonProgress, 0, 0.3, 0.4, 1, true);
  blossomAmount = map(seasonProgress, 0, 0.15, 1, 0, true);
  sunAmount = map(seasonProgress, 0, 0.2, 0, 1, true);

  // Sky
  background(lerpColor(springSky, summerSky, map(seasonProgress, 0, 0.2, 0, 1, true)));
  drawSun();

  // Ground
  noStroke();
  fill(lerpColor(springGrass, summerGrass, map(seasonProgress, 0, 0.2, 0, 1, true)));
  rect(0, height - 60, width, 60);

  drawFence();
  drawTreeBase();
  drawPetals();
}

function drawFall() {
  // Leaves Turn --> Storm --> Leaves Fall
  leafAmount = 1;
  turnAmount = map(seasonProgress, 0, 0.4, 0, 1, true);
  dropAmount = map(seasonProgress, 0.65, 1, 0, 1, true);
  rainAmount = map(seasonProgress, 0.6, 0.8, 0, 1, true);
  sunAmount = map(seasonProgress, 0, 0.3, 1, 0, true);

  // Sky
  let sky = lerpColor(summerSky, fallSky, turnAmount);
  background(lerpColor(sky, stormSky, rainAmount));
  drawSun();
  drawClouds();

  // Ground
  let ground = lerpColor(summerGrass, fallGrass, turnAmount);
  noStroke();
  fill(lerpColor(ground, dirtColor, dropAmount));
  rect(0, height - 60, width, 60);

  drawFence();
  drawTreeBase();
  drawFallingLeaves();
  drawRain();
}

function generate() {
  let next = "";

  for (let c of sentence) {
    if (c === "X") {
      next += "F[+X][-X]FX";
    } else if (c === "F") {
      next += "FF";
    } else {
      next += c;
    }
  }

  sentence = next;
}

function drawTreeBase() {
  randomSeed(12);
  leafIndex = 0;

  push();
  translate(width / 2, height - 60);

  stroke(85, 75, 60);
  strokeCap(ROUND);

  // Tree sways in wind
  for (let i = 0; i < 8; i++) {
    strokeWeight(11 - i * 0.6);

    let trunkBend = sin(i * 0.8) * 3;
    let windBend = wind * 0.15;

    rotate(radians(trunkBend + windBend));

    line(0, 0, 0, -8);
    translate(0, -8);
  }

  drawLimb(-55, 0.85);
  drawLimb(-30, 1.05);
  drawLimb(-8, 1.25);
  drawLimb(22, 1.1);
  drawLimb(50, 0.9);

  pop();
}

function drawLimb(direction, size) {
  push();
  rotate(radians(direction));

  let branchLevel = 0;

  for (let c of sentence) {
    if (c === "F") {
      let branchLength = len * size;
      let branchWeight;
      let windBend;

      if (branchLevel === 0) {
        // Main limbs move a little.
        branchWeight = 4;
        windBend = wind * 0.12;

      } else if (branchLevel === 1) {
        branchWeight = 2;
        branchLength *= 0.75;
        windBend = wind * 0.3;

      } else {
        // Thin twigs bend more in the wind
        branchWeight = 0.8;
        branchLength *= 0.55;
        windBend = wind * 0.6;
      }

      rotate(radians(random(-4, 4) + windBend));

      strokeWeight(branchWeight);
      line(0, 0, 0, -branchLength);

      // Snow on Branch
      drawBranchSnow(branchLength, branchWeight);

      translate(0, -branchLength);

    } else if (c === "+") {
      rotate(angle);

    } else if (c === "-") {
      rotate(-angle);

    } else if (c === "[") {
      push();
      branchLevel++;

    } else if (c === "]") {
      pop();
      branchLevel--;

    } else if (c === "X") {
      // Leaf at Branch Tip
      drawLeaf(leaves[leafIndex]);
      leafIndex++;
    }
  }

  pop();
}

function makeLeaf() {
  let leaf = {
    growWait: random(0, 0.5),
    turnWait: random(0, 0.7),
    dropWait: random(0, 1),
    tilt: random(-50, 50),
    hasBlossom: random() < 0.35,
    fallColor: random(fallColors),
  };

  return leaf;
}

function drawLeaf(leaf) {
  // Fallen Leaf
  if (dropAmount > leaf.dropWait) {
    return;
  }

  // Leaves Grow, Turn + Bloom at Different Times
  let size = map(leafAmount, leaf.growWait, leaf.growWait + 0.5, 0, 1, true);
  let turn = map(turnAmount, leaf.turnWait, leaf.turnWait + 0.3, 0, 1, true);
  let bloom = map(blossomAmount, leaf.growWait, leaf.growWait + 0.5, 0, 1, true);

  // Leaf Color
  let currentColor = lerpColor(budColor, leafColor, size);
  currentColor = lerpColor(currentColor, leaf.fallColor, turn);

  push();
  noStroke();

  // Leaf
  if (size > 0) {
    rotate(radians(leaf.tilt));
    fill(currentColor);
    ellipse(0, -size * 6, size * 8, size * 12);
  }

  // Blossom
  if (leaf.hasBlossom === true && bloom > 0) {
    fill(blossomColor);
    circle(0, 0, bloom * 9);

    fill(255, 230, 120);
    circle(0, 0, bloom * 3);
  }

  pop();
}

function drawBranchSnow(branchLength, branchWeight) {
  // Branch Angle on Screen
  let m = drawingContext.getTransform();
  let screenAngle = atan2(m.b, m.a);

  // Flat Branches Hold More Snow
  let flatness = abs(sin(screenAngle));
  let snowDepth = snowAmount * flatness * (branchWeight + 1.5);

  if (snowDepth < 0.3) {
    return;
  }

  // Top Side of Branch
  let upSide;
  if (sin(screenAngle) < 0) {
    upSide = 1;
  } else {
    upSide = -1;
  }

  let offset = upSide * (branchWeight + snowDepth) * 0.4;

  // Snow
  push();
  stroke(250, 252, 255);
  strokeWeight(snowDepth);
  line(offset, 0, offset, -branchLength);
  pop();
}

function drawGroundSnow() {
  push();
  noStroke();

  // Snow Covers Ground
  let coverage = min(snowAmount * 3, 1);
  fill(245, 248, 250, coverage * 255);

  // Snow Drift
  let driftHeight = snowAmount * 18;

  beginShape();
  vertex(0, height);

  for (let x = 0; x <= width; x += 10) {
    let bump = noise(x * 0.01) * driftHeight;
    vertex(x, height - 60 - bump);
  }

  vertex(width, height);
  endShape(CLOSE);

  pop();
}

function makeParticle(x, y) {
  let particle = {
    position: createVector(x, y),
    velocity: createVector(0, 0),
    fallColor: random(fallColors),
  };

  return particle;
}

// Motion Vectors
function moveParticle(particle, gravityStrength, windStrength, dragStrength) {
  // Gravity + Wind
  let gravity = createVector(0, gravityStrength);
  let windForce = createVector(wind * windStrength, 0);

  // Drag
  let drag = particle.velocity.copy();
  drag.mult(-dragStrength);

  // Acceleration = Gravity + Wind + Drag
  let acceleration = createVector(0, 0);
  acceleration.add(gravity);
  acceleration.add(windForce);
  acceleration.add(drag);

  particle.velocity.add(acceleration);
  particle.position.add(particle.velocity);

  if (particle.position.x > width) {
    particle.position.x = 0;
  } else if (particle.position.x < 0) {
    particle.position.x = width;
  }
}

// Snow
function drawSnow() {
  push();

  noStroke();
  fill("white");

  // More Snow When Music Is Loud
  let flakeCount = 100 * snowfall * (0.3 + loudness * 0.7);

  for (let i = 0; i < flakeCount; i++) {
    let flake = snowflakes[i];

    moveParticle(flake, 0.1, 0.05, 0.05);
    circle(flake.position.x, flake.position.y, 5);

    // Back to Top
    if (flake.position.y > height - 60) {
      flake.position.y = 0;
    }
  }

  pop();
}

function drawRain() {
  push();

  randomSeed(30);
  stroke(200, 210, 225, 180);
  strokeWeight(1.5);

  // More Rain When Music Is Loud
  let dropCount = 120 * rainAmount * (0.3 + loudness * 0.7);

  for (let i = 0; i < dropCount; i++) {
    let rainX = random(width);
    let rainStart = random(height);
    let rainY = (rainStart + frameCount * 9) % height;

    // Slant With Wind
    line(rainX, rainY, rainX + wind * 3, rainY + 12);
  }

  pop();
}

function drawClouds() {
  push();

  randomSeed(40);
  noStroke();
  fill(95, 100, 110, rainAmount * 230);

  for (let i = 0; i < 6; i++) {
    let cloudStart = random(width + 200);
    let cloudY = random(30, 130);
    let cloudSize = random(80, 140);

    // Cloud Drift
    let cloudX = (cloudStart + frameCount * 0.3) % (width + 200) - 100;

    // Puffy Cloud
    ellipse(cloudX, cloudY, cloudSize, cloudSize * 0.6);
    ellipse(cloudX - cloudSize * 0.4, cloudY + 10, cloudSize * 0.7, cloudSize * 0.45);
    ellipse(cloudX + cloudSize * 0.4, cloudY + 10, cloudSize * 0.7, cloudSize * 0.45);
  }

  pop();
}

function drawFallingLeaves() {
  push();

  noStroke();

  // Leaves Fall in Waves + When Music Is Loud
  let leafCount = sin(dropAmount * PI) * 40 * (0.3 + loudness * 0.7);

  for (let i = 0; i < leafCount; i++) {
    let leaf = fallingLeaves[i];

    moveParticle(leaf, 0.05, 0.08, 0.04);

    // Flutter
    let flutter = sin(frameCount * 0.05 + i) * 15;

    fill(leaf.fallColor);
    ellipse(leaf.position.x + flutter, leaf.position.y, 6, 4);

    // Back to Tree
    if (leaf.position.y > height - 60) {
      leaf.position.y = 180;
    }
  }

  pop();
}

function drawPetals() {
  push();

  noStroke();
  fill(240, 150, 180);

  // More Petals When Music Is Loud
  let petalCount = 40 * blossomAmount * (0.3 + loudness * 0.7);

  for (let i = 0; i < petalCount; i++) {
    let petal = petals[i];

    moveParticle(petal, 0.04, 0.1, 0.05);

    // Flutter
    let flutter = sin(frameCount * 0.07 + i) * 10;

    ellipse(petal.position.x + flutter, petal.position.y, 8, 5);

    // Back to Tree
    if (petal.position.y > height - 60) {
      petal.position.y = 200;
    }
  }

  pop();
}

function drawSun() {
  push();

  noStroke();

  let sunX = width - 120;
  let sunY = 110;
  let sunSize = 70 + loudness * 30;

  // Sun Radiate
  for (let i = 3; i > 0; i--) {
    fill(255, 230, 150, sunAmount * 40);
    circle(sunX, sunY, sunSize + i * 25);
  }

  // Sun
  fill(255, 240, 180, sunAmount * 255);
  circle(sunX, sunY, sunSize);

  pop();
}

// Music Loudness
let musicLoudness = [
  // Winter
  4, 17, 31, 33, 28, 29, 41, 49, 43, 26, 16, 23, 23, 19, 23, 34, 37, 38, 50, 55,
  62, 64, 47, 24, 18, 24, 24, 35, 40, 41, 48, 51, 60, 59, 56, 53, 37, 21, 18, 26,
  26, 39, 59, 63, 82, 97, 95, 84, 66, 50, 37, 27, 16, 16, 18, 14, 14, 7, 0, 0,

  // Spring
  13, 44, 71, 75, 70, 68, 65, 71, 86, 81, 63, 58, 70, 79, 75, 67, 59, 62, 73, 72,
  63, 63, 79, 90, 88, 91, 93, 93, 89, 78, 67, 41, 11, 0, 6, 22, 29, 16, 15, 23,
  14, 2, 5, 13, 11, 9, 16, 19, 26, 26, 11, 3, 11, 18, 22, 32, 29, 11, 1, 0,

  // Summer
  13, 38, 48, 49, 48, 32, 11, 21, 62, 82, 77, 71, 50, 18, 20, 57, 82, 82, 78, 61,
  32, 21, 48, 76, 84, 88, 79, 71, 82, 96, 93, 67, 30, 6, 13, 50, 80, 84, 76, 67,
  52, 39, 50, 74, 82, 70, 46, 20, 21, 55, 80, 83, 83, 80, 65, 48, 42, 46, 37, 20,

  // Fall
  27, 43, 56, 59, 69, 81, 75, 67, 64, 64, 66, 69, 80, 91, 88, 77, 73, 76, 77, 74,
  70, 70, 61, 32, 7, 0, 4, 11, 12, 22, 39, 29, 8, 10, 19, 22, 23, 27, 37, 40,
  26, 22, 35, 47, 46, 40, 33, 22, 7, 0, 18, 53, 73, 80, 90, 96, 83, 56, 29, 9,
];

function drawFence() {
  push();
  noStroke();

  let fenceTop = height - 105;
  let groundY = height - 60;

  // Rails
  fill(130, 90, 55);
  rect(0, fenceTop + 12, width, 6);
  rect(0, fenceTop + 30, width, 6);

  // Snow on Rails
  fill(250, 252, 255);
  rect(0, fenceTop + 12 - snowAmount * 4, width, snowAmount * 4);
  rect(0, fenceTop + 30 - snowAmount * 4, width, snowAmount * 4);

  // Pickets
  fill(130, 90, 55);
  for (let x = 10; x < width; x += 30) {
    rect(x, fenceTop, 10, groundY - fenceTop);
    triangle(x, fenceTop, x + 10, fenceTop, x + 5, fenceTop - 8);
  }

  pop();
}