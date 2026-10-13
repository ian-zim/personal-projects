let x = 0;
let speed = 2;

let darkness = 0;
let SSP = 3.9; 
// SSP = Sky Switch Speed

let r = 135;
let g = 206;
let b = 235;

let stage = 0;
let presentsHere = false;

let hohoho;
let santaSoundPlayed = false;
let snowing = false;

// 0 = Daytime
// 1 = "Sunset"
// 2 = Night
// 3 = "Sunrise"

async function setup() {
  createCanvas(700, 500);
  noStroke();
  hohoho = await loadSound("hohoho.mp3");
}

function draw() {
  // "Sunset" (X-Mas Eve)
  if (stage === 1) {
    darkness = darkness + SSP;

    if (darkness >= 235) {
      darkness = 235;
      stage = 2;
      x = -180;
      presentsHere = false;
      santaSoundPlayed = false;
      snowing = false;
    }
  }

  // "Sunrise" (X-Mas Day)
  else if (stage === 3) {
    darkness = darkness - SSP;

    if (darkness <= 0) {
      darkness = 0;
      stage = 0;
      x = 0;

      // Stop Santa Sound
      if (hohoho.isPlaying()) {
        hohoho.stop();
      }

      santaSoundPlayed = false;
    }
  }

  // Sky
  r = 135 * (1 - darkness / 235);
  g = 206 * (1 - darkness / 235);
  b = 235 * (1 - darkness / 235);

  background(r, g, b);

  // Christmas Lights
  drawLights();

  // Snow On Ground
  fill("white");
  rect(0, 440, width, 60);

  // Houses
  drawHouse(60, 350, "crimson");
  drawHouse(220, 365, "darkgreen");

  // Snowman
  drawSnowman(400, 425);

  // X-Mas Tree
  fill("saddlebrown");
  rect(542, 415, 16, 55);

  fill("forestgreen");
  triangle(500, 430, 600, 430, 550, 330);
  triangle(510, 390, 590, 390, 550, 300);
  triangle(520, 350, 580, 350, 550, 275);

  // Ornaments
  fill("red");
  ellipse(530, 355, 8);
  ellipse(570, 385, 8);
  ellipse(525, 415, 8);

  fill("gold");
  ellipse(550, 320, 8);
  ellipse(550, 400, 8);
  ellipse(580, 420, 8);
  ellipse(550, 270, 12);

  fill("dodgerblue");
  ellipse(565, 345, 8);
  ellipse(540, 380, 8);

  // Day Time
  if (stage === 0) {
    // Sun
    fill("gold");
    ellipse(x, 100, 50);

    x = x + speed;

    // Sun Leaves
    if (x > width + 25) {
      // Reset 
      if (presentsHere === true) {
        noLoop();
      }

      // "Sunset"
      else {
        stage = 1;
        x = 0;
      }
    }
  }

  // Night Time
  else if (stage === 2) {
    // Stars
    randomSeed(frameCount / 20);
    fill("white");

    for (let i = 0; i < 100; i++) {
      let starX = random(width);
      let starY = random(height / 3);

      circle(starX, starY, 3);
    }

    // Moon
    fill("lightyellow");
    ellipse(x, 100, 50);
    fill(r, g, b);
    ellipse(x + 15, 92, 50);

    // Santa + Sleigh + Rudolph
    drawSantaSleigh(x, 220);

    // Santa "Ho Ho Ho"
    if (x > -150 && santaSoundPlayed === false) {
      hohoho.play();
      santaSoundPlayed = true;
    }

    // Move Santa + Moon
    x = x + speed;

    // Presents Appear
    if (x > width - 158 && presentsHere === false) {
      presentsHere = true;
    }

    // Santa Leaves
    if (x > width + 275) {
      stage = 3;
      x = 0;
      snowing = true;

      // Stop Santa "Ho Ho Ho"
      if (hohoho.isPlaying()) {
        hohoho.stop();
      }
    }
  }

  // Presents
  if (presentsHere === true) {
    drawPresents(475, 430, "red");
    drawPresents(535, 440, "green");
    drawPresents(595, 420, "blue");
  }

  // Falling Snow
  if (snowing === true) {
    drawSnow();
  }
}

function drawLights() {
  // Light String Up Top
  stroke("black");
  strokeWeight(2);
  line(0, 30, width, 30);
  noStroke();

  // Red Lights
  fill("red");
  ellipse(40, 35, 10);
  ellipse(160, 35, 10);
  ellipse(280, 35, 10);
  ellipse(400, 35, 10);
  ellipse(520, 35, 10);
  ellipse(640, 35, 10);

  // Green Lights
  fill("green");
  ellipse(80, 35, 10);
  ellipse(200, 35, 10);
  ellipse(320, 35, 10);
  ellipse(440, 35, 10);
  ellipse(560, 35, 10);

  // Gold Lights
  fill("gold");
  ellipse(120, 35, 10);
  ellipse(240, 35, 10);
  ellipse(360, 35, 10);
  ellipse(480, 35, 10);
  ellipse(600, 35, 10);
}

function drawHouse(x, y, houseColor) {
  // House
  fill(houseColor);
  rect(x, y, 100, 90);

  // Roof
  fill("saddlebrown");
  triangle(x - 10, y, x + 110, y, x + 50, y - 55);

  // Snow Roof
  fill("white");
  triangle(x, y - 5, x + 100, y - 5, x + 50, y - 48);

  // Door
  fill("saddlebrown");
  rect(x + 40, y + 50, 25, 40);

  // Windows
  fill("gold");
  rect(x + 12, y + 25, 20, 20);
  rect(x + 70, y + 25, 20, 20);

  // Wreath
  fill("forestgreen");
  ellipse(x + 52, y + 65, 18);

  fill("saddlebrown");
  ellipse(x + 52, y + 65, 9);

  fill("red");
  ellipse(x + 52, y + 55, 5);

  // House Lights
  fill("red");
  ellipse(x + 15, y + 5, 7);
  ellipse(x + 50, y + 5, 7);

  fill("green");
  ellipse(x + 32, y + 5, 7);
  ellipse(x + 68, y + 5, 7);

  fill("gold");
  ellipse(x + 85, y + 5, 7);
}

function drawSnowman(x, y) {
  // Body
  fill("white");
  ellipse(x, y, 55);
  ellipse(x, y - 45, 45);

  // Eyes
  fill("black");
  ellipse(x - 8, y - 50, 5);
  ellipse(x + 8, y - 50, 5);

  // Buttons
  ellipse(x, y - 5, 6);
  ellipse(x, y + 12, 6);

  // Nose
  fill("orange");
  triangle(x, y - 45, x, y - 38, x + 22, y - 42);

  // Hat
  fill("black");
  rect(x - 25, y - 75, 50, 8);
  rect(x - 17, y - 105, 34, 30);
}
//Santa + Sleigh + Rudolph
function drawSantaSleigh(x, y) {
  // Sleigh
  fill("red");
  rect(x - 45, y + 20, 90, 35);
  ellipse(x + 45, y + 20, 35, 35);

  // Sleigh Track
  fill("gold");
  rect(x - 50, y + 55, 110, 7);

  // Santa Body
  fill("red");
  ellipse(x - 10, y, 40, 50);

  // Santa Head
  fill("peachpuff");
  ellipse(x - 10, y - 30, 30);

  // Santa Beard
  fill("white");
  ellipse(x - 10, y - 20, 30, 22);

  // Santa Hat
  fill("red");
  triangle(x - 27, y - 38, x + 7, y - 38, x - 10, y - 68);
  fill("white");
  ellipse(x - 10, y - 68, 8);

  // Rudolph
  //Body
  fill("saddlebrown");
  ellipse(x + 120, y + 25, 70, 35);
  ellipse(x + 155, y, 30, 35);
  rect(x + 95, y + 35, 8, 25);
  rect(x + 135, y + 35, 8, 25);
  //Eye
  fill("black");
  ellipse(x + 160, y - 5, 5);
  //Nose
  fill("red");
  ellipse(x + 173, y, 10);
  //Antlers + Harness
  stroke("gold");
  strokeWeight(2);
  line(x + 150, y - 15, x + 145, y - 30);
  line(x + 160, y - 15, x + 165, y - 30);
  line(x + 40, y + 15, x + 145, y + 5);
  noStroke();
}

function drawPresents(x, y, boxColor) {
  // Box
  fill(boxColor);
  rect(x, y, 50, 40);

  // Ribbon
  fill("gold");
  rect(x + 20, y, 10, 40);
  rect(x, y + 15, 50, 10);
}

//Falling Snow
function drawSnow() {
  randomSeed(10);
  fill("white");

  for (let i = 0; i < 60; i++) {
    let snowX = random(width);
    let snowStart = random(height);
    let snowY = (snowStart + frameCount * 2) % height;

    circle(snowX, snowY, 5);
  }
}

function keyPressed() {
  // Reset
  if (key === "r" || key === "R") {
    loop();

    x = 0;
    darkness = 0;
    stage = 0;

    r = 135;
    g = 206;
    b = 235;

    presentsHere = false;
    snowing = false;
    santaSoundPlayed = false;

    if (hohoho.isPlaying()) {
      hohoho.stop();
    }
  }
}

function mousePressed() {
  userStartAudio();
}
