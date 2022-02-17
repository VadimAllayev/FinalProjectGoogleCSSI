// Be sure to name any p5.js functions we use in the global so Glitch can recognize them.
// Add to this list as you consult the p5.js documentation for other functions. 
/* global createCanvas, colorMode, HSB, width, height, random, background, fill, color, random,
          rect, ellipse, stroke, image, loadImage, collideCircleCircle, collideRectCircle, text, 
          mouseX, mouseY, strokeWeight, line, mouseIsPressed, windowWidth, windowHeight, noStroke, 
          noFill, keyCode, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, textSize, floor,
          textAlign, LEFT, RIGHT, CENTER, BASELINE, circle, collideRectRect, collidePointRect, sqrt,
          triangle, atan, sin, frameCount, loadSound,soundFormats,clear, abs*/

let time;
let tileTimer;
let hero;
let bX, bY; //backgroundX, backgroundY, scrolling background
let map; //game-selection, adventure, platformer, survival, etc.
let backgroundImage, adventureImage,tilesImage; //background image
let gameIsOver; //boolean that knows when the (mini)game is over
//dialogue: a JSON of 1. an array of all of the text for a certain interaction and 2. the current index
//cutscene: boolean
//friends: an array of Friend objects (NPCs)
//doors: an array of portals that transport you to other locations (ie. trials/mini-games)
//buttons: array of buttons
//step: integer that represents which screen or process you're currently on
//helper: helper variable (int) to help execute certain processes
//barriers: places you are unable to go
let dialogue, cutscene, friends, doors, buttons, step, helper, barriers;
//platformer stuff
let platforms, enemies, platformImages;
//survival stuff
let lasers, lava;
//archery stuff
let targets;
let spawnY1 = [25, 125, 225];
let spawnY2 = [75, 175, 275];
let score = 0;
let timer = 60;
let targetImg, arrowImg;
//tiles stuff
let tiles, texts;
let secondsPerBeat;
let spawnTileX = [150, 225, 300, 375];
let song;

//general help
let firstTime = [true, true, true, true];
let highScores = [0, 0, 0, 0];
let tutorial = false;
let characterSelect = false;

function preload() {}

function setup() {
  createCanvas(600, 500);
  
  time = 0;
  
  bX = 0;
  bY = 0;
  
  map = 'Menu';
  backgroundImage = loadImage("https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fforest-background-menu-screen.png?v=1628100319733");
  adventureImage = loadImage("https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fofficial-forest-background.png?v=1627929932601");
  tilesImage = loadImage("https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fmusic-background.jpg?v=1628174666590");
  
  hero = new Hero("knight-m");
  
  buttons = [];
  //should initially be:
  buttons = [new Button(width/2, height/3*2-20, 250, 70, "START")];
  step = 0;
  helper = 0;
  
  dialogue = {
    text: [],
    index: 0,
    cooldown: 0,
    cooldownDuration: 20
  }
  cutscene = false;
  gameIsOver = false;
  
  //should initially be (for character selection):
  friends = [
    new Friend(width-210-24, 100, "knight-m"),
    new Friend(width-210-24, 100, "knight-f"),
    new Friend(width-210-24, 100, "elf-m"),
    new Friend(width-210-24, 100, "elf-f"),
    new Friend(width-210-24, 100, "lizard-m"),
    new Friend(width-210-24, 100, "lizard-f"),
    new Friend(width-210-24, 100, "mage-m"),
    new Friend(width-210-24, 100, "mage-f"),
  ];
  
  doors = [
    new Door(476 + bX, 702 + bY, 20, 32, color('blue'), 'Platformer'),
    new Door(430 + bX, 1300 + bY, 20, 32, color('green'), 'Survival'),
    new Door(1672 + bX, 1346 + bY, 20, 32, color('red'), 'Archery'),
    new Door(1672 + bX, 748 + bY, 20, 32, color('yellow'), 'Tiles'),
    new Door(568 + bX, 1806, 20, 32, color('purple'), 'Select')
  ];
  
  platforms = [];
  
  platformImages = [
    loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fsmall-platform.png?v=1628103919213'), //SMALL
    loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fmedium-platform.png?v=1628103923196'), //MEDIUM
    loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flarge-platform.png?v=1628110230989'), //LARGE
    loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fextra-large-platform.png?v=1628103932427'), //EXTRA LARGE
    loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flong-platform.png?v=1628112994790'), //LONG
    loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Ftall-platform.png?v=1628103935621'), //TALL
  ];
  
  enemies = [];
  lasers = [];
  lava = [];
  targets = [];
  tiles = [];
  texts = [];
  
  
  targetImg = loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2FTarget.png?v=1628098296035');
  arrowImg = loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Farrow.png?v=1628006572798');
  
  let bpm = 113;
  let bps = bpm / 60;
  secondsPerBeat = 1/bps;
  
  soundFormats('mp3');
  song = loadSound('https://cdn.glitch.com/ae1db07c-844e-4f1b-ace5-51e778b333e9%2FRick%20Astley%20-%20Never%20Gonna%20Give%20You%20Up%20(Official%20Music%20Video).mp3?v=1627958777983');

  
  console.log('Look at you, checking the console of our game :)');
  console.log('Trying to spot us debugging, eh?');
  console.log("You're a clever one, I'll give you that...");
  console.log("Alright, you deserve a cookie C:");
  console.log('Here you go, one freshly-baked cookie: 🍪');
  console.log('Enjoy!');
}

function draw() {
  background(220);
  time++;
  if(map === "Adventure") {
    hero.act();
    image(adventureImage, bX, bY, 2030, 2456);
    
    if(characterSelect) {
      drawCharacterSelection();
    }
    else {
      for(let door of doors) {
        door.drawSelf();
      }

      for(let friend of friends) {
        friend.drawSelf();
      }
      
      hero.drawSelf();
      
      //for(let plat of platforms)
      //  plat.drawSelf();

      if(cutscene) {
        cutsceneText();
      }
      hero.drawUI();
    }
  }
  else if(map === "Menu") {
    background(21, 24, 38);
    image(backgroundImage, hero.x, hero.y, 1920, 1080);
    
    //I'm using the boolean variables of Hero because I really don't want to make new variables
    //scrolling the background around to display the entire image
    if(hero.right) {
      hero.x--;
      if(hero.x <= -1256) {
        hero.x = -1256;
        hero.right = false;
      }
    } else {
      hero.x++;
      if(hero.x >= 0) {
        hero.x = 0;
        hero.right = true;
      }
    }
    if(hero.down) {
      hero.y--;
      if(hero.y <= -318) {
        hero.y = -318;
        hero.down = false;
      }
    } else {
      hero.y++;
      if(hero.y >= 0) {
        hero.y = 0;
        hero.down = true;
      }
    }
    
    textAlign(CENTER);
    if(step==0) {
      stroke(0);
      fill(245);
      textSize(50);
      text("CSSI: Ardent Adventure", width/2, height/3);
      textSize(28);
      text("By: Vadim Allayev & Mohamed Muflahi", width/2, height/3 + 50);
    } else if(step==2) {
      drawCharacterSelection();
    }

    textSize(12);
  }
  else if(map === "Survival") {
    background(33, 30, 39);
    image(backgroundImage, -100 + bX, -210 + bY, 800, 920);
    //rect(-105 + bX, -105 + bY, width + 210, height + 210);
    
    
    if(cutscene) {
      friends[0].drawSelf();
      cutsceneText();
    }
    else {
      timer++;
    }
    
    //ending the game
    if(!gameIsOver && hero.health == 0) {
      gameIsOver = true;
      if(score > highScores[0])
        highScores[0] = score;
      buttons = [
        new Button(width/3, 350, width/4, 70, 'Play Again'),
        new Button(width/3*2, 350, width/4, 70, 'Exit')
      ];      
    }
    
    //Game is Over
    if (gameIsOver) {
      for(let curLava of lava)
        curLava.drawSelf();
      for(let laser of lasers)
        laser.drawSelf();
      for(let enemy of enemies)
        enemy.drawSelf();
      
      stroke(0);
      fill(255,255,255);
      rect(100,75,400,350);
      
      fill(0);
      noStroke();
      textAlign(CENTER);
      textSize(16)
      text(`High Score: ${highScores[0]}`, width/2, 180)
      textSize(12)
      text(`You reached Wave`,width/2, 210);
      textSize(48);
      text(score, width/2, 275);
      textSize(48);
      text("GAME OVER", width/2, 150);
      textSize(22);
      textAlign(LEFT);
    }
    else {
      //survival gets progressively more intense and difficult
      let intensity = floor(timer / 360);
      let wave = floor((intensity+1)/2);
      score = wave;
      let hazardSpeed = 60 - wave;
      let moreLava = floor(wave/5); //an additional lava pool may spawn every 5 turns
      let moreLasers = floor(wave/7); //an additional laser may spawn every 7 turns

      //6 seconds passed --> spawn new stuff
      if(timer % 360 == 0) {
        if(step <= 0) {
          lava = [];

          let newStep = floor(random(1, 4)); //1, 2, 3

          if(wave >= 8) {
            newStep += 3; //4, 5, 6
          }

          //to avoid repetition
          while(newStep == -step) {
            newStep = floor(random(1, 4)); //1, 2, 3
            if(wave >= 10) {
              newStep += 3; //4, 5, 6
            }
          }

          step = newStep;

          //to spawn lava if needed
          if(step==3 || step==5 || step==6) {
            let rand = floor(random(2, 4 + moreLava));
            for(let i = 0; i < rand; i++) {
              let randX = random(-50, 600);
              let randY = random(-160, 560);
              while(distanceFromHero(randX + 25 + bX, randY + 25 + bY) < 125) {
                randX = random(-50, 600);
                randY = random(-160, 560);
              }
              lava.push(new Lava(randX, randY));
            }
          }
        } else {
          timer += 120; //4 seconds of break time
          step *= -1; //in order to make sure we won't repeat
        }
      }

      //which hazards are currently in play
      let hazards = '';

      //spawning hazards based on the step
      if(step <= 0) {
        hazards = '---';
      }
      if(step == 1) {
        if(timer % hazardSpeed == 0) { //goblins
          let randX = random(-100, 670);
          let randY = random(-210, 600);
          while(distanceFromHero(randX + bX + 24, randY + 24 + bY) < 125) {
            randX = random(-100, 670);
            randY = random(-210, 600);
          }
          enemies.push(new Enemy(null, randX, randY));
        }
        hazards = 'Goblins';
      } else if(step == 2) {
        if(timer % hazardSpeed == 0) { //lasers
          let rand = floor(random(1, 2 + moreLasers));
          for(let i = 0; i < rand; i++) {
            lasers.push(new Laser());
          }
        }
        hazards = 'Lasers';
      } else if(step == 3) { //lava
        if(timer % hazardSpeed == 0) {
          for(let i = lava.length - 1; i >= 0; i--) {
            lava[i].spread();
          }
        }
        hazards = 'Lava';
      } else if(step == 4) {
        if(timer % hazardSpeed == 0) { //goblins
          let randX = random(-100, 670);
          let randY = random(-210, 600);
          while(distanceFromHero(randX + bX + 24, randY + 24 + bY) < 125) {
            randX = random(-100, 670);
            randY = random(-210, 600);
          }
          enemies.push(new Enemy(null, randX, randY));
        }
        if(timer % hazardSpeed == 0) { //lasers
          let rand = floor(random(1, 2 + moreLasers));
          for(let i = 0; i < rand; i++) { 
            lasers.push(new Laser());
          }
        }
        hazards = 'Goblins & Lasers';
      } else if(step == 5) {
        if(timer % hazardSpeed == 0) { //goblins
          let randX = random(-100, 670);
          let randY = random(-210, 600);
          while(distanceFromHero(randX + bX + 24, randY + 24 + bY) < 125) {
            randX = random(-100, 670);
            randY = random(-210, 600);
          }
          enemies.push(new Enemy(null, randX, randY));
        }
        if(timer % hazardSpeed == 0) { //lava
          for(let i = lava.length - 1; i >= 0; i--) {
            lava[i].spread();
          }
        }
        hazards = 'Goblins & Lava';
      } else if(step == 6) {
        if(timer % hazardSpeed == 0) { //lasers
          let rand = floor(random(1, 2 + moreLasers));
          for(let i = 0; i < rand; i++) {
            lasers.push(new Laser());
          }
        }
        if(timer % hazardSpeed == 0) { //lava
          for(let i = lava.length - 1; i >= 0; i--) {
            lava[i].spread();
          }
        }
        hazards = 'Lava & Lasers';
      }


      //Lava
      for(let i = lava.length - 1; i >= 0; i--) {
        //delete lava from array when energy is 0
        if(step <= 0 && timer % hazardSpeed == 0) {
          lava[i].energy--;
        }

        if(lava[i].energy == 0) {
          lava.splice(i, 1);
        } else {
          lava[i].drawSelf();
        }
      }

      //Lasers
      for(let i = 0; i < lasers.length; i++) {
        let laser = lasers[i];
        if(laser.finished) {
          lasers.splice(i, 1);
          i--;
        } else {
          laser.act();
          laser.drawSelf();
        }
      }

      //Dealing with the enemies
      for(let i = 0; i < enemies.length; i++) {
        let e = enemies[i];
        let defeated = e.takeDamage(hero.weapon);
        if(defeated) {
          enemies.splice(i, 1);
          i--;
        }
        else {
          e.actSurvival();
          e.drawSelf();
        }
      }

      hero.act();
      hero.drawSelf();
      if(cutscene & dialogue.index == 3) {
        fill(215, 183, 64);
        stroke(0);
        circle(hero.x + hero.w/2, hero.y + hero.h/3*2, 7);
      }
      hero.drawUI();

      fill(255);
      textAlign(RIGHT);
      textSize(18);
      text(`Wave ${wave}`, width - 25, 30);
      text(hazards, width - 25, 50);
      textAlign(LEFT);
    }
  }
  else if(map === "Platformer") {
    background(241, 242, 215);
    let imagesPassed = floor((hero.x - bX) / 2048);
    //three images will be drawn, they will keep moving to the right
    // as the player moves rightwards
    let x1 = 6144 * floor((imagesPassed+1)/3);
    let x2 = 6144 * floor((imagesPassed)/3);
    let x3 = 6144 * floor((imagesPassed-1)/3);
    if(x2 < 0)
      x2 = 0;
    if (x3 < 0)
      x3 = 0;
    image(backgroundImage, bX + x1, -524 + bY, 2048, 1024);
    image(backgroundImage, 2048 + bX + x2, -524 + bY, 2048, 1024);
    image(backgroundImage, 4096 + bX + x3, -524 + bY, 2048, 1024);
    
    if(gameIsOver) {
      for(let plat of platforms)
        plat.drawSelf();
      for(let enemy of enemies)
        enemy.drawSelf();
      
      stroke(0);
      fill(255,255,255);
      rect(100,75,400,350);
      
      fill(0);
      noStroke();
      textAlign(CENTER);
      textSize(16)
      text(`High Score: ${highScores[1]}%`, width/2, 180)
      textSize(12)
      text(`Your map completion rate is`,width/2, 210);
      textSize(48);
      text(`${score}%`, width/2, 275);
      textSize(48);
      if(score < 100) {
        text("GAME OVER", width/2, 150);
      } else {
        text("YOU WIN!", width/2, 150);
      }
      textSize(22);
      textAlign(LEFT);
    }
    else {
      for(let plat of platforms) {
        plat.drawSelf();
      }
      for(let i = 0; i < enemies.length; i++) {
        let e = enemies[i];
        let defeated = e.takeDamage(hero.weapon);
        if(defeated) {
          enemies.splice(i, 1);
          i--;
        }
        else {
          e.actPlatformer();
          e.drawSelf();
        }
      }

      if(cutscene) {
        friends[0].drawSelf();
        cutsceneText();
      } else {
        hero.act();
      }

      hero.drawSelf();
      hero.drawUI();
      
      let percentCompleted = floor((hero.x + hero.w/2 - bX) * 100 / 12500);
      if(percentCompleted > score)
        score = percentCompleted;
      
      textAlign(RIGHT);
      textSize(22);
      noStroke();
      fill(0);
      text(`Percent Completed: ${score}%`, width-20, 30);
      textAlign(LEFT);
      
      //ending the game
      if(percentCompleted >= 100 || hero.health == 0) {
        gameIsOver = true;
        if(score > highScores[1])
          highScores[1] = score;
        buttons = [
          new Button(width/3, 350, width/4, 70, 'Play Again'),
          new Button(width/3*2, 350, width/4, 70, 'Exit')
        ];      
      }
    }
  } else if(map === "Archery") {
    background(201, 129, 57);
    image(backgroundImage, -108, 0);
    
    //lines
    fill(255,255,255);
    stroke(0);
    line(0, 50, 600, 50);
    line(0, 100, 600, 100);
    line(0, 150, 600, 150);
    line(0, 200, 600, 200);
    line(0, 250, 600, 250);
    line(0, 300, 600, 300);
    
    //Game is Over
    if (gameIsOver) {
      for (let plat of platforms) {
        plat.drawSelf();
      }
      for(let bullet of hero.bullets) {
        bullet.show();
      }
      for(let target of targets) {
        target.show();
      }

      image(helper, hero.x, hero.y);
      
      //background(220);
      fill(255,255,255);
      rect(100,75,400,350);

      fill(0);
      noStroke();
      textAlign(CENTER);
      textSize(16)
      text(`High Score: ${highScores[3]}`, width/2, 180)
      textSize(12)
      text(`You got a score of`,width/2, 210);
      textSize(48);
      text(score, width/2, 275);
      textSize(48);
      text("GAME OVER", width/2, 150);
      textSize(22);
      textAlign(LEFT);
    } 
    //Game Is Ongoing
    else {
      //Platforms for aesthetics
      for (let plat of platforms) {
        plat.drawSelf();
      }
      
      //Managing hero's bullets
      for (let i = 0; i < hero.bullets.length; i++) {
        hero.bullets[i].show();
        hero.bullets[i].move();
        if(hero.bullets[i].y + hero.bullets[i].r < 0) {
          hero.bullets.splice(i, 1);
          i--;
        }
      }
      
      //Managing targets
      for (let i = 0; i < targets.length; i++) {
        targets[i].show();
        targets[i].move();
        //returns true if an arrow hit the target
        // arrow gets deleted and score increases accordingly in the method
        if(targets[i].collision()) {
          targets.splice(i,1);
          i--;
        }
      }
      
      if(cutscene) {
        friends[0].drawSelf();
        cutsceneText();
      }
      else {
        //Spawning new targets
        if (frameCount % 440 == 0) {
          targets.push(new Target(590, random(spawnY1), 30));
        }
        if (frameCount % 80 == 0) {
          targets.push(new Target(10, random(spawnY2), 30));
        }

        //Timer
        if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
          timer--;
          if(timer == 0) {
            gameIsOver = true;
            helper = hero.acquireImage(); 

            if(score > highScores[3]) {
              highScores[3] = score;
            }

            buttons = [
              new Button(width/3, 350, width/4, 70, 'Play Again'),
              new Button(width/3*2, 350, width/4, 70, 'Exit')
            ];
          }
        }
      }
      
      fill(245);
      stroke(0);
      textSize(22);
      text(`Score: ${score}`,20, 30);
      textAlign(RIGHT);
      text(`Time Remaining: ${timer}`, width - 20, 30);
      textAlign(LEFT);
      
      hero.drawSelf();
      hero.archeryMovement();
    }
    
  } else if(map === "Tiles") {
    timer++;
    image(tilesImage, -140, -470, 960, 1440);
    
    // these next lines create the borders
    noFill();
    stroke(0);
    line(150,0,150,600);
    line(225,0,225,600);
    line(300,0,300,600);
    line(375,0,375,600);
    line(450,0,450,600);
    line(150,50,450,50);
    line(150,400,450,400);
    line(150,475,450,475);
    
    if (gameIsOver) {
      for(let text of texts)
        text.show();
      for(let tile of tiles)
        tile.show();
      
      stroke(0);
      fill(255,255,255);
      rect(100,75,400,350);

      fill(0);
      noStroke();
      textAlign(CENTER);
      textSize(16)
      text(`High Score: ${highScores[2]}`, width/2, 180)
      textSize(12)
      text('You got a score of',width/2, 210);
      textSize(48);
      text(score, width/2, 275);
      textSize(48);
      text("GAME OVER", width/2, 150);
      textSize(22);
      textAlign(LEFT);
    } 
    else {
      // these next lines create the borders
      noFill();
      stroke(0);
      line(150,0,150,600);
      line(225,0,225,600);
      line(300,0,300,600);
      line(375,0,375,600);
      line(450,0,450,600);
      line(150,50,450,50);
      line(150,400,450,400);
      line(150,475,450,475);
      
      //displaying and managing all text
      for(let i = 0; i < texts.length; i++) {
       texts[i].show();
       if(texts[i].finished) {
         texts.splice(i, 1);
         i--;
       }
      }

      //displaying and managing all tiles
      for (let i = 0; i < tiles.length; i++) {
        let currentTile = tiles[i];
        currentTile.show();
        currentTile.move();
        if(currentTile.clicked) { //tile was clicked
          let difY = abs(currentTile.y - 400);
          if(difY <= 8) {
            texts.push(new Text('Perfect')); 
            score += 20;
          }
          else if(difY <= 20) {
            texts.push(new Text('Great'));
            score += 10;
          }
          else {
            texts.push(new Text('Good'));
            score += 5;
          }
          tiles.splice(i, 1);
          i--;

          } else if(tiles[i].y > height) { //tile went off screen
          tiles.splice(i, 1);
          i--;
          if(score > 0)
            score--;
          texts.push(new Text('Miss'));
         }
      }
      
      //text
      fill(0);
      noStroke();
      textSize(22);//150, 225, 300, 375
      textAlign(CENTER);
      text('D', 187, 495);
      text('F', 262, 495);
      text('J', 337, 495);
      text('K', 412, 495);
      textAlign(RIGHT);
      text(`Time Remaining: ${tileTimer}`, width-30, 30);
      textAlign(LEFT);
      text(`Score: ${score}`, 30, 30);

      if(cutscene) {
        friends[0].drawSelf();
        cutsceneText();
        timer = 0;
      }
      else {
        if(timer >= secondsPerBeat * 60) {
          timer -= secondsPerBeat * 60;
          let randX = random(spawnTileX);
          tiles.push(new Tile(randX));
          if(random() < 0.1) {
            let otherRandX = random(spawnTileX);
            while(randX == otherRandX)
              otherRandX = random(spawnTileX);
            tiles.push(new Tile(otherRandX));
          }
          if(random() < 0.1) {
            let randX = random(spawnTileX);
            let tileOffBeat = new Tile(randX);
            tileOffBeat.y -= (secondsPerBeat*30*5);
            tiles.push(tileOffBeat);
          }
        }
        if (frameCount % 60 == 0 && tileTimer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
          tileTimer--;
          if(tileTimer == 0) {
            gameIsOver = true;
            song.stop();

            if(score > highScores[2]) {
              highScores[2] = score;
            }

            buttons = [
              new Button(width/3, 350, width/4, 70, 'Play Again'),
              new Button(width/3*2, 350, width/4, 70, 'Exit')
            ];
          }
        }
      }
    }
  }
  
  //drawing all of the buttons
  for(let button of buttons) {
    button.drawSelf();
  }
  
  //textAlign(RIGHT);
  //fill(0);
  //text(getTime(), width - 20, 20);
  //textAlign(LEFT);
  //text(`Map: ${map}`, 20, 20);
  //text(`Key Code: ${keyCode}`, 20, 20);
}

function drawCharacterSelection() {
  //CHARACTER SELECTION
  stroke(0);
  fill(160);
  rect(50, 50, width-100, height-100);
  fill(200);
  rect(width-280, 80, 200, 110); //upper right box
  rect(width-280, 200, 200, 80); //middle right box
  rect(width-280, 290, 200, 130); //lower right box
  noFill();
  line(width-140, 80, width-140, 190); //vertical
  line(width-140, 116, width-80, 116); //horizontal 1
  line(width-140, 152, width-80, 152); //horizontal 2

  friends[helper].drawSelfIgnoreBackground();
  //every 3 seconds change from idle --> move --> idle...
  if(time % 180 == 0) {
    friends[helper].right = !friends[helper].right;
  }

  fill(0);
  noStroke();
  textSize(32);
  textAlign(LEFT, CENTER);
  if(helper <= 1) { //knight
    text('→', 60, buttons[0].y + buttons[0].h/2);
    textSize(24);
    textAlign(CENTER, BASELINE);
    text('Knight', width-210, 110);
    textAlign(LEFT, CENTER);
    textSize(16);
    text('3 ❤️', width-128, 100);
    text('3 💨', width-128, 136);
    text('3 🗡️', width-128, 172);
    textAlign(CENTER);
    textSize(20);
    text("Sword Proficiency", width-180, 228);
    textSize(14);
    text("Faster Attack Speed", width-180, 258);
    textAlign(LEFT);
    text("The Knight is a brave and", width-270, 310);
    text("honorable fighter.", width-270, 330);
    text("Knights enjoy balanced stats.", width-270, 370);
  } else if(helper <= 3) { //elf
    text('→', 60, buttons[1].y + buttons[1].h/2);
    textSize(24);
    textAlign(CENTER, BASELINE);
    text('Elf', width-210, 110);
    textAlign(LEFT, CENTER);
    textSize(16);
    text('2 ❤️', width-128, 100);
    text('4 💨', width-128, 136);
    text('3 🗡️', width-128, 172);
    textAlign(CENTER);
    textSize(20);
    text("Elven Grace", width-180, 228);
    textSize(14);
    text("Increased Jump Height", width-180, 258);
    textAlign(LEFT);
    text("The Elf is a mysterious and", width-270, 310);
    text("elegant creature of folklore.", width-270, 330);
    text("Elves enjoy nimble move-", width-270, 370);
    text("ment but are more fragile.", width-270, 390);
  } else if(helper <= 5) { //lizard
    text('→', 60, buttons[2].y + buttons[2].h/2);
    textSize(24);
    textAlign(CENTER, BASELINE);
    text('Lizard', width-210, 110);
    textAlign(LEFT, CENTER);
    textSize(16);
    text('5 ❤️', width-128, 100);
    text('2 💨', width-128, 136);
    text('4 🗡️', width-128, 172);
    textAlign(CENTER);
    textSize(20);
    text("Climbing Affinity", width-180, 228);
    textSize(14);
    text("+1 Additional Wall Jump", width-180, 258);
    textAlign(LEFT);
    text("The Lizard is a savage and", width-270, 310);
    text("cunning predator.", width-270, 330);
    text("Lizards enjoy vitality and", width-270, 370);
    text("toughness but move slowly.", width-270, 390);
  } else { //mage:
    text('→', 60, buttons[3].y + buttons[3].h/2);
    textSize(24);
    textAlign(CENTER, BASELINE);
    text('Mage', width-210, 110);
    textAlign(LEFT, CENTER);
    textSize(16);
    text('3 ❤️', width-128, 100);
    text('3 💨', width-128, 136);
    text('3 🗡️', width-128, 172);
    textAlign(CENTER);
    textSize(20);
    text("Levitation", width-180, 228);
    textSize(14);
    text("Increased Sprinting Duration", width-180, 258);
    textAlign(LEFT);
    text("The Mage is an intelligent", width-270, 310);
    text("practitioner of magic.", width-270, 330);
    text("Mages enjoy balanced stats.", width-270, 370);
    //text("wisdom, don't hit hard.", width-270, 390);
  }
  textSize(32);
  textAlign(LEFT, CENTER);
  if(helper%2 == 0) { //male
    text('→', width/5*2 - 70, buttons[4].y + buttons[4].h/2);
  } else { //female
    text('→', width/5*2 - 70, buttons[5].y + buttons[5].h/2);
  }
  textSize(12);
  textAlign(LEFT, BASELINE);
}

//distance formula (math)
function distanceFromHero(centerX, centerY) {
  //calculates distance of center of Hero from center of Friend 
  //center of Hero and Friend is a little lower than y+h/2
  //(that's just how the sprites are drawn, there's extra space on top)
  let deltaY = (hero.y + hero.h/3*2) - (centerX);
  let deltaX = (hero.x + hero.w/2) - (centerY);
  return sqrt(deltaY**2 + deltaX**2);
}

function cutsceneText() {
  let speaker;
  if(helper != -1)
    speaker = friends[helper];

  //NPC is on the top half of the screen
  if (helper !=-1 && speaker.y + speaker.h/3*2 + bY < height/2) {
    //speech bubble
    fill(255);
    stroke(0);
    //triangle(speaker.x + speaker.w/2 + bX, speaker.y + speaker.h + bY + 20, width/7*3, height/3*2, width/7*4, height/3*2);
    rect(80, height/3*2, width - 160, height/4);

    //text
    fill(0);
    textSize(22);
    noStroke();
    if(dialogue.cooldown > 0)
        dialogue.cooldown--;
    let sentence = dialogue.text[dialogue.index];
    let dividerLocation = sentence.indexOf('%');
    let posY = height/3*2 + 32;
    //every time a '%' is spotted, start writing on the next line
    while(dividerLocation != -1) {
      text(sentence.substring(0, dividerLocation), 100, posY);
      sentence = sentence.substring(dividerLocation + 1);
      posY += 35;
      dividerLocation = sentence.indexOf('%');
    }
    text(sentence, 100, posY);
    textSize(12);
  }
  //NPC is on the bottom half of the screen
  else {
    //speech bubble
    fill(255);
    stroke(0);
    //triangle(speaker.x + speaker.w/2 + bX, speaker.y + speaker.h/3 + bY - 20, width/7*3, height/3, width/7*4, height/3);
    rect(80, height/12, width - 160, height/4);

    //text
    fill(0);
    textSize(22);
    noStroke();
    if(dialogue.cooldown > 0)
        dialogue.cooldown--;
    let sentence = dialogue.text[dialogue.index];
    let dividerLocation = sentence.indexOf('%');
    let posY = height/12 + 32;
    //every time a '%' is spotted, start writing on the next line
    while(dividerLocation != -1) {
      text(sentence.substring(0, dividerLocation), 100, posY);
      sentence = sentence.substring(dividerLocation + 1);
      posY += 35;
      dividerLocation = sentence.indexOf('%');
    }
    text(sentence, 100, posY);
    textSize(12);
  }
}

function getTime() {
  let minutes = (floor(time/3600));
  let seconds = (floor(time/60))%60;
  let frames = floor(time%60);
  if(seconds < 10)
    seconds = "0" + seconds;
  if(frames < 10)
    frames = "0" + frames;
  return minutes + ":" + seconds + ":" + frames;
}

class Hero {
  constructor(type) {
    this.w = 16 * 3;
    this.h = 28 * 3;
    // this.x = width - 210 - this.w/2;
    // this.y = 100;
    this.x = width/2 - this.w/2;
    this.y = height - this.h - 20;
    this.type = type; //knight male, elf female...
    
    //When you enter a mini-game, the hero's and background's coordinates
    // will change. Before starting the game, the coordinates are stored here.
    // After the game, we can revert the coordinates back to the correct places.
    this.prevX = 0;
    this.prevY = 0;
    this.prevBX = 0;
    this.prevBY = 0;
    
    //stores images of hero (and weapon)
    this.idle = [];
    this.move = [];
    this.idleLeft = [];
    this.moveLeft = [];
    this.weaponImages = [];
    //will create images based on hero type
    this.createHero();
    
    this.weapon = {
      x: this.x + this.w,
      y: this.y + this.h/3,
      w: 25*2,
      h: 28*2,
      active: false //weapon is "active" and therefore danagerous to enemies on certain frames of the animation
    }
    
    this.animTime = 0;
    this.animSpeed = 6; //duration (in frames) of each image of animation
    
    this.facingRight = true;
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    
    this.sprinting = false;
    this.sprintTime = 0;
    this.sprintDuration = 20; //how many frames sprint lasts
    this.sprintCooldown = this.sprintDuration * 2.5; //how long until you can sprint again
    
    this.attacking = false;
    this.attackTime = 0;
    this.attackSpeed = 6; //duration (in frames) of each image of animation
    
    //FOR PLATFORMER
    this.initialVY = 0;
    this.jumping = false;
    this.jumpTime = 0;
    this.jumpStrength = 7;
    this.wallJumps = 0;
    this.totalWallJumps = 1;
    
    //FOR ARCHERY
    this.bullets = [];
    this.maxBullets = 2;
    
    //stats
    if(helper <= 1) { //knight
      this.speed = 3;
      this.maxHealth = 3;
      this.health = this.maxHealth;
      this.power = 3;
      this.attackSpeed = 4;
    } else if(helper <= 3) { //elf
      this.speed = 3.5;
      this.maxHealth = 2;
      this.health = this.maxHealth;
      this.power = 3;
      this.jumpStrength = 8;
    } else if(helper <= 5) { //lizard
      this.speed = 2.5;
      this.maxHealth = 5;
      this.health = this.maxHealth;
      this.power = 4;
      this.totalWallJumps = 2;
    } else { //mage
      this.speed = 3;
      this.maxHealth = 3;
      this.health = this.maxHealth;
      this.power = 3;
      this.sprintDuration = 26;
    }
  }
  
  createHero() {
    //contains both right and left facing attack
    this.weaponImages = [
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fsword-right-0.png?v=1627694332304'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fsword-right-1.png?v=1627694332304'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fsword-right-2.png?v=1627694332304'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fsword-right-3.png?v=1627694332303'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fsword-right-4.png?v=1627694332304'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fsword-left-0.png?v=1627702833700'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fsword-left-1.png?v=1627702833740'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fsword-left-2.png?v=1627702833763'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fsword-left-3.png?v=1627702833781'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fsword-left-4.png?v=1627702833700')
    ];
    
    if(this.type === 'knight-m') {
      this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-0.png?v=1627694792529'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-1.png?v=1627694792529'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-2.png?v=1627694792529'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-3.png?v=1627694792687')      
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-L0.png?v=1627694792728'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-L1.png?v=1627694792814'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-L2.png?v=1627694793130'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-L3.png?v=1627694793175')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-0.png?v=1627694793270'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-1.png?v=1627694793319'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-2.png?v=1627694792529'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-3.png?v=1627694793407')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-L0.png?v=1627694793436'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-L1.png?v=1627694793493'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-L2.png?v=1627694792528'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-L3.png?v=1627694792529')
      ];
    } else if(this.type === 'knight-f') {
       this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-0.png?v=1627701318260'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-1.png?v=1627701318205'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-2.png?v=1627701318220'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-3.png?v=1627701318286')
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-L0.png?v=1627701318374'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-L1.png?v=1627701318389'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-L2.png?v=1627701318410'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-L3.png?v=1627701318487')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-0.png?v=1627701317955'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-1.png?v=1627701317955'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-2.png?v=1627701318511'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-3.png?v=1627701317955')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-L0.png?v=1627701317955'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-L1.png?v=1627701317955'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-L2.png?v=1627701318095'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-L3.png?v=1627701318236')
      ]; 
    } else if(this.type === 'elf-m') {
       this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-0.png?v=1627701348958'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-1.png?v=1627701349073'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-2.png?v=1627701349103'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-3.png?v=1627701349153')
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-L0.png?v=1627701349189'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-L1.png?v=1627701349392'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-L2.png?v=1627701349441'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-L3.png?v=1627701349557')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-0.png?v=1627701349579'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-1.png?v=1627701348743'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-2.png?v=1627701349598'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-3.png?v=1627701348743')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-L0.png?v=1627701348742'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-L1.png?v=1627701348818'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-L2.png?v=1627701348851'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-L3.png?v=1627701348940')
      ]; 
    } else if(this.type === 'elf-f') {
       this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-0.png?v=1627695447062'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-1.png?v=1627695447125'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-2.png?v=1627695447257'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-3.png?v=1627695447272')
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-L0.png?v=1627695447309'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-L1.png?v=1627695447110'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-L2.png?v=1627695447438'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-L3.png?v=1627695447511')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-0.png?v=1627695447626'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-1.png?v=1627695447601'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-2.png?v=1627695446881'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-3.png?v=1627695446881')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-L0.png?v=1627695446881'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-L1.png?v=1627695446881'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-L2.png?v=1627695446972'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-L3.png?v=1627695447088')
      ]; 
    } else if(this.type === 'lizard-m') {
       this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-0.png?v=1627699878432'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-1.png?v=1627699877662'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-2.png?v=1627699877930'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-3.png?v=1627699877662')
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-L0.png?v=1627699877662'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-L1.png?v=1627699877662'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-L2.png?v=1627699878078'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-L3.png?v=1627699878181')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-0.png?v=1627699878118'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-1.png?v=1627699878278'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-2.png?v=1627699878307'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-3.png?v=1627699877887')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-L0.png?v=1627699877748'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-L1.png?v=1627699878404'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-L2.png?v=1627699878009'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-L3.png?v=1627699877662')
      ]; 
    } else if(this.type === 'lizard-f') {
       this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-0.png?v=1627702213729'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-1.png?v=1627702213855'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-2.png?v=1627702213832'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-3.png?v=1627702213941')
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-L0.png?v=1627702213885'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-L1.png?v=1627702214074'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-L2.png?v=1627702214092'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-L3.png?v=1627702213556')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-0.png?v=1627702213556'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-1.png?v=1627702214123'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-2.png?v=1627702214175'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-3.png?v=1627702213556')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-L0.png?v=1627702213556'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-L1.png?v=1627702213556'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-L2.png?v=1627702213556'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-L3.png?v=1627702213556')
      ]; 
    } else if(this.type === 'mage-m') {
       this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-0.png?v=1627702225894'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-1.png?v=1627702225894'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-2.png?v=1627702225987'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-3.png?v=1627702226029')
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-L0.png?v=1627702226087'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-L1.png?v=1627702226129'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-L2.png?v=1627702226240'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-L3.png?v=1627702226302')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-0.png?v=1627702226365'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-1.png?v=1627702226541'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-2.png?v=1627702226556'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-3.png?v=1627702225945')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-L0.png?v=1627702226582'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-L1.png?v=1627702226649'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-L2.png?v=1627702226681'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-L3.png?v=1627702226417')
      ]; 
    } else if(this.type === 'mage-f') {
       this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-0.png?v=1627700428334'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-1.png?v=1627700428334'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-2.png?v=1627700428451'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-3.png?v=1627700428559')
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-L0.png?v=1627700428575'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-L1.png?v=1627700428610'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-L2.png?v=1627700428674'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-L3.png?v=1627700428797')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-0.png?v=1627700428781'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-1.png?v=1627700428898'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-2.png?v=1627700428968'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-3.png?v=1627700428334')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-L0.png?v=1627700428334'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-L1.png?v=1627700429001'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-L2.png?v=1627700429056'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-L3.png?v=1627700429091')
      ]; 
    }
  }
  
  shoot() {
    if(this.bullets.length < this.maxBullets) {
      this.bullets.push(new Bullet(this.x + this.w, this.y));
    }
  }
  
  //iterates through enemies array, takes damage if there is a collision
  takeDamageEnemies() {
    for(let i = 0; i < enemies.length; i++) {
      let e = enemies[i];
      //checks center of hero with enemy to give leeway
      if(!e.stunned && collidePointRect(this.x + this.w/2, this.y+this.h/3*2, e.x + bX, e.y + bY, e.w, e.h)) {
        this.health--;
        e.stun();
        // if(this.health == 0)
        //   gameIsOver = true;
        break;
      }
    }
  }
  
  //iterates through lasers array, takes damage if there is a collision
  takeDamageLasers() {
    for(let i = 0; i < lasers.length; i++) {
      let laser = lasers[i];
      //checks center of hero with enemy to give leeway
      if(laser.active && collidePointRect(this.x + this.w/2, this.y+this.h/3*2, laser.x + bX, laser.y + bY, laser.w, laser.h)) {
        this.health--;
        laser.active = false;
        break;
      }
    }
  }
  
  //iterates through lasers array, takes damage if there is a collision
  takeDamageLava() {
    for(let i = 0; i < lava.length; i++) {
      let curLava = lava[i];
      //checks center of hero with enemy to give leeway
      if(curLava.active && collidePointRect(this.x + this.w/2, this.y+this.h/3*2, curLava.x + bX, curLava.y + bY, curLava.w, curLava.h)) {
        this.health--;
        curLava.active = false;
        break;
      }
    }
  }
  
  drawSelf() {
    if(this.animTime + this.animSpeed*4 <= time)
      this.animTime = time;
  
    //drawing the hero
    image(this.acquireImage(), this.x, this.y, this.w, this.h);
    //drawing ideal hitbox
    /*noFill();
    stroke('green');
    rect(this.x, this.y + this.h/3, this.w, this.h/3*2);
    noStroke();*/
    
    //ATTACKING - DRAWING WEAPON
    if(this.attacking) {
      let imageIndex = floor((time - this.attackTime)/this.attackSpeed);
      
      //establishing whether weapon is dangerous or not
        if(imageIndex == 3) 
          this.weapon.active = true;
        else
          this.weapon.active = false;
      
      //fixing weapon y coordinate
      this.weapon.y = this.y + this.h/4;
      
      if(this.facingRight) {
        //fixing weapon x coordinate
        this.weapon.x = this.x + this.w;
        
        //drawing the weapon
        image(this.weaponImages[imageIndex], this.weapon.x, this.weapon.y, this.weapon.w, this.weapon.h);
      }
      else {
        //fixing weapon x coordinate
        this.weapon.x = this.x - this.weapon.w;
        
        //drawing the weapon
        image(this.weaponImages[imageIndex + 5], this.weapon.x, this.weapon.y, this.weapon.w, this.weapon.h);
      }
    }
  }
  
  drawUI() {
    //drawing lives remaining
    textSize(24);
    //drawing from right to left for overlapping effect
    let furthestX = 10 + (this.maxHealth-1) * 20;
    let healthLost = this.maxHealth - this.health;
    noStroke();
    for(let i = 0; i < this.maxHealth; i++) {
      if(healthLost > 0) { //I want to draw empty hearts first
        text('🤍', furthestX - i*20, 30);
        healthLost--;
      } else {
        text('❤️', furthestX - i*20, 30);
      }
    }
    
    //drawing sprinting bar
    text('💨', 10, height-10);
    const max = this.sprintDuration * 4; //pixels
    stroke(0);
    noFill();
    rect(50, height-23, max, 10);
    let remaining;
    if(this.sprinting) {
      remaining = (this.sprintTime / this.sprintDuration) * max;
      fill('green');
      
    } else {
      if(this.sprintTime == 0) {
        remaining = max;
        fill('green');
      } else {
        remaining = max - ((this.sprintTime / this.sprintCooldown) * max);
        fill('yellow');
      }
    }
    rect(50, height-23, remaining, 10);
    
    textSize(12);
  }
  
  acquireImage() {
    let imageIndex = floor((time - this.animTime)/this.animSpeed);
    if(this.up || this.down || this.left || this.right) {
      if(this.facingRight) {
        return this.move[imageIndex];
      } else {
        return this.moveLeft[imageIndex];
      }
    }
    else {
      if(this.facingRight) {
        return this.idle[imageIndex];
      } else {
        return this.idleLeft[imageIndex];
      }
    }
  }
  
  act() {
    if(map === "Adventure") {
      this.adventureMovement();
    } else if(map === "Survival") {
      this.survivalMovement();
    } else if(map === "Platformer") {
      this.platformerMovement();
    }
  }
  
  //--- ARCHERY METHODS ---
  archeryMovement() {
    if (this.left) {
      this.x -= 3.2;
      if(this.x < 0) {
        this.x = 0;
      }
    }
    if (this.right) {
      this.x += 3.2;
      if(this.x + this.w > width) {
        this.x = width - this.w;
      }
    }
  }
  
  //--- PLATFORMER METHODS ---
  platformerMovement() {
    //sprinting stuff (duration, cooldown)
    if(this.sprintTime > 0) {
      this.sprintTime--;
      if(this.sprintTime == 0 && this.sprinting) {
        this.sprinting = false;
        if(this.isAirborne() == null) { //airborne when sprint ends
          this.fall(); //don't carry over previous velocity/momentum
          //this.wallJumps = this.totalWallJumps; //NVM THIS IS OP //resets wall jumps for extra mobility
        }
        this.sprintTime = this.sprintCooldown; //cooldown
      }
    }
    
    //attacking stuff (duration, cooldown)
    if(this.attacking) {
      if(this.attackTime + this.attackSpeed*5 <= time) {
        this.attacking = false;
        if(!this.jumping) {
          if(this.right)
            this.facingRight = true;
          else if(this.left)
            this.facingRight = false;
        }
        this.attackTime = this.attackSpeed; //cooldown
      }
    } else {
      if(this.attackTime > 0)
        this.attackTime--;
    }
  
    //movement while sprinting
    if(this.sprinting) {
      //constantly moving during the sprint
      if(this.facingRight) {
        if(this.x + this.w > width/3*2) {
          bX -= this.speed * 2;
        } else {
          this.x += this.speed * 2;
        }
      } 
      else {
        if(this.x < width/3 && bX < 0) {
          bX += this.speed * 2;
          if(bX > 0) //shouldn't go past left screen
            bX = 0;
        } else { 
          this.x -= this.speed * 2;
          if(this.x < 0) //shouldn't go past left screen
            this.x = 0;
        }
      }
    } 
    //regular movement
    else {
      if(this.left) {
        if(this.x < width/3 && bX < 0) {
          bX += this.speed;
          if(bX > 0) //shouldn't go past left screen
            bX = 0;
        } else { 
          this.x -= this.speed;
          if(this.x < 0) //shouldn't go past left screen
            this.x = 0;
        }
      }
      if(this.right) {
        if(this.x + this.w > width/3*2) {
          bX -= this.speed;
        } else {
          this.x += this.speed;
        }
      }
    }
    
    //jumping stuff
    if(this.up && !this.sprinting) {
      this.up = false;
      //normal jump (on the ground, jump)
      if(!this.jumping) {
        this.jumping = true;
        this.jumpTime = 0;
        this.initialVY = -this.jumpStrength;
        this.y += this.initialVY;
      }
      else if(this.wallJumps > 0 && this.isAgainstWall()) {
        this.jumpTime = 0;
        this.initialVY = -this.jumpStrength;
        this.y += this.initialVY;
        this.wallJumps--;
      }
    }
    
    //If still currently in the air...
    if(this.jumping) {
      //gravity only applies when you're not sprinting lol
      // I don't use logic operator && because then code will go
      // to the else statement and that's unecessary (not optimal)
      if(!this.sprinting) {
        //timer that affects jumping/falling speed
        this.jumpTime++;
        let vY = this.initialVY + (this.jumpTime)/4;
        if(this.y < height/3 && vY < 0) {
          bY -= vY;
        } 
        else if(this.y + this.h > height/3*2 && vY > 0 && bY > 0) {
          bY -= vY;
          if(bY < 0) {
            bY = 0;
          }
        } 
        else {
          this.y += vY;
        }

        //fell off of the bottom, immediate death
        if(this.y > height) {
          this.health = 0;
        }
        
        //If falling downwards...
        if(vY >= 0) {
        //If the user is on a platform, stop jumping/falling
        // and correct y-coordinate so you're not inside the platform.
          let plat = this.isAirborne();
          if(plat != null) {
            this.jumping = false;
            
            //this.moveTime = this.moveFrames/2; //to get a specific image when landing
            this.y = plat.y - this.h + bY;
            this.wallJumps = this.totalWallJumps;
            
            if(!this.attacking) {
              if(this.right) {
                this.facingRight = true;
              } else if(this.left) {
                this.facingRight = false;
              }
            }
          }
        }
      }
    }
    //User is on the ground (but check if they fell off a platform)
    else {
      //Falling
      if(this.isAirborne() == null) {
        this.fall();
      }
    }
    
    //checks if collided with enemy, if so lose health
    this.takeDamageEnemies();
  }
  
  fall() {
    this.jumping = true;
    this.jumpTime = 0;
    this.initialVY = 0;
  }
  
  //Rather than returning true/false, I return the platform the user lands on
  // in order to correct y-coordinate upon landing. If the user is still airborne,
  // the method returns null.
  isAirborne() {
    for(let plat of platforms) {
      //This compares the bottom of the user with a small part of the top of the platform.
      // (comparing entire user with entire platform leads to logic error)
      // (12 is an arbitrary number used to represent a small portion of the top of the platform)
      if(collideRectRect(this.x, this.y+this.h/3*2, this.w, this.h/3+1, plat.x + bX, plat.y + bY, plat.w, 3))
        return plat;
    }
    return null;
  }
  
  //Returns true/false. Checks if hero is overlapping with a wall of a platform.
  // used to determine if eligible for a WALL JUMP!
  isAgainstWall() {
    for(let plat of platforms) {
      //This compares the bottom of the user with a small part of the top of the platform.
      // (comparing entire user with entire platform leads to logic error)
      // (12 is an arbitrary number used to represent a small portion of the top of the platform)
      if(collideRectRect(this.x, this.y+this.h/3*2, this.w, this.h/3, plat.x + bX, plat.y + bY, plat.w, plat.h))
        return true;
    }
    return false;
  }
  
  
  //--- SURVIVAL METHODS ---
  survivalMovement() {
    //very similar to adventureMovement() but with no boundaries
    //shouldn't be able to move during a cutscene
    if(!cutscene) {
      //sprinting stuff (duration, cooldown)
      if(this.sprintTime > 0) {
        this.sprintTime--;
        if(this.sprintTime == 0 && this.sprinting) {
          this.sprinting = false;
          this.sprintTime = this.sprintCooldown; //cooldown
        }
      }

      let curSpeed = this.speed;
      if(this.sprinting)
        curSpeed *= 2;
      if(this.up && this.ableToMove(0, -curSpeed)) {
          if(this.y < height/4) {
            bY += curSpeed;
          } else {
            this.y -= curSpeed;
          }
      }
      if(this.down && this.ableToMove(0, curSpeed)) {
        if(this.y + this.h > height/4*3) {
          bY -= curSpeed;
        } else {
          this.y += curSpeed;
        }
      }
      if(this.left && this.ableToMove(-curSpeed, 0)) {
        if(this.x < width/4) { 
          bX += curSpeed;
        } else {
          this.x -= curSpeed;
        }
      }
      if(this.right && this.ableToMove(curSpeed, 0)) {
        if(this.x + this.w > width/4*3) {
          bX -= curSpeed;
        } else {
          this.x += curSpeed;
        }
      }
    }
    
    //attacking stuff (duration, cooldown)
    if(this.attacking) {
      if(this.attackTime + this.attackSpeed*5 <= time) {
        this.attacking = false;
        if(!this.jumping) {
          if(this.right)
            this.facingRight = true;
          else if(this.left)
            this.facingRight = false;
        }
        this.attackTime = this.attackSpeed; //cooldown
      }
    } else {
      if(this.attackTime > 0)
        this.attackTime--;
    }
    
    //checks if collided with enemy, if so lose health
    this.takeDamageEnemies();
    //check if collided with laser, if so lose health
    this.takeDamageLasers();
    //check if collided with lava, if so lose health
    this.takeDamageLava();
  }
  
  adventureMovement() {
    //shouldn't be able to move during a cutscene
    if(!cutscene) {
      //sprinting stuff (duration, cooldown)
      if(this.sprintTime > 0) {
        this.sprintTime--;
        if(this.sprintTime == 0 && this.sprinting) {
          this.sprinting = false;
          this.sprintTime = this.sprintCooldown; //cooldown
        }
      }

      //every character has same movement speed in Adventure Mode
      let curSpeed = 3.2; 
      if(this.sprinting)
        curSpeed *= 2;
      if(this.up && this.ableToMove(0, -curSpeed)) {
          if(this.y < height/4 && bY < 0) {
            bY += curSpeed;
            if(bY > 0)
              bY = 0;
          } else {
            this.y -= curSpeed;
            if(this.y < 0)
              this.y = 0;
          }
      }
      if(this.down && this.ableToMove(0, curSpeed)) {
        if(this.y + this.h > height/4*3 && bY > -1956) {
          bY -= curSpeed;
          if(bY < -1956) 
            bY = -1956;
        } else {
          this.y += curSpeed;
          if(this.y + this.h > height)
            this.y = height - this.h;
        }
      }
      if(this.left && this.ableToMove(-curSpeed, 0)) {
        if(this.x < width/4) { 
          bX += curSpeed;
        } else {
          this.x -= curSpeed;
        }
      }
      if(this.right && this.ableToMove(curSpeed, 0)) {
        if(this.x + this.w > width/4*3 && bX > -1430) {
          bX -= curSpeed;
          if(bX < -1430)
            bX = -1430;
        } else {
          this.x += curSpeed;
          if(this.x + this.w > width)
            this.x = width - this.w;
        }
      }
      
    }
  }
  
  ableToMove(changeX, changeY) {
    for(let plat of platforms) {
      if(collideRectRect(hero.x +hero.w/5 + changeX, hero.y + hero.h/4*3 + changeY, hero.w/5*3, hero.h/4 + 5, plat.x + bX, plat.y + bY, plat.w, plat.h)) {
        return false;
      }
    }
    return true;
  }
}

//INIT() METHODS
function initTiles() {
  bX = 0;
  bY = 0;
  tileTimer = 45;
  score = 0;
  timer = 0;
  tiles = [];
  texts = [];
  song.setVolume(0.2);
  song.play();
}

function initArchery() {
  score = 0;
  timer = 45;
  hero.x = width/2 - hero.w/2;
  hero.y = height - hero.h - 40;
  bX = 0;
  bY = 0;
  hero.bullets = [];
  targets = [];
  let posY = hero.y + hero.h;
  platforms = [
    new Platform(-10, posY, 320, 64, 4),
    new Platform(295, posY, 320, 64, 4),
  ];
  
  backgroundImage = loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fparallax-forest-full-resize.png?v=1628138586514');
}

function initAdventure() {
  map = "Adventure";
  bX = -758;
  bY = -1956;
  
  let type = "";
  if(helper <= 1) { //knight
    type += "knight";
  } else if(helper <= 3) { //elf
    type += "elf";
  } else if(helper <= 5) { //lizard
    type += "lizard";
  } else { //mage
    type += "mage";
  }

  if(helper%2 == 0) { //male
    type += "-m";
  } else { //female
    type += "-f";
  }

  hero = new Hero(type);

  helper = -1;
  cutscene = true;
  dialogue.text = [
    "Welcome, adventurer. The controls to the %game are as follows: %(Press any key to continue...)",
    "• WASD / Arrow Keys → Move %• Space Bar → Sprint %• J → Interact / Attack"
  ];
  dialogue.cooldown = dialogue.cooldownDuration * 2; //so players won't immediately skip first text
  
  initAdventureArrays();
}

function initAdventureArrays() {
  buttons = [];
  
  friends = [
    new Friend(1060, 1850, "elf-f"), //Katelyn
    new Friend(632, 1300, "lizard-m"), //Erdal
    new Friend(530, 792, "elf-m"), //Robert
    new Friend(1570, 747, "mage-f"), //Sasyashmini
    new Friend(1550, 1340, "knight-m"), //Michael
    new Friend(485, 318, "lizard-f"), //Student 1
    new Friend(1610, 470, "knight-f"), //Student 2
    new Friend(815, 1250, "mage-m") //High-Score Teller
  ];
  friends[0].facingRight = false;
  friends[2].facingRight = false;
  friends[3].facingRight = false;
  friends[4].facingRight = false;
 
  platforms = [
    //ponds
    new Platform(692, 2226, 320, 156),
    new Platform(1110, 2226, 320, 156),
    //left side
    new Platform(658, 2178, 10, 278),
    new Platform(198, 368, 10, 1340),
    new Platform(436, 2120, 186, 10),
    new Platform(612, 2120, 10, 55),
    new Platform(612, 2166, 56, 10),
    new Platform(390, 2074, 48, 48),
    new Platform(382, 1802, 10, 274),
    new Platform(206, 1706, 48, 48),
    //new Platform(250, 1754, 48, 48), //tree covers so it's unecessary
    new Platform(280, 1728, 90, 72), //tree
    new Platform(298, 1802, 84, 10), //under the tree
    new Platform(206, 322, 48, 48),
    new Platform(251, 314, 141, 10),
    new Platform(382, 230, 10, 94),
    
    //right side
    new Platform(1452, 2166, 10, 290),
    new Platform(1462, 2166, 82, 10),
    new Platform(1822, 368, 10, 1340), 
    new Platform(1592, 2074, 48, 48),
    new Platform(1544, 2122, 48, 48),
    new Platform(1638, 1802, 10, 274), 
    new Platform(1776, 1706, 48, 48),
    new Platform(1732, 1754, 48, 48),
    new Platform(1648, 1802, 84, 10),
    new Platform(1776, 322, 48, 48),
    new Platform(1638, 314, 141, 10), 
    new Platform(1638, 230, 10, 94),
    
    //top
    new Platform(390, 222, 1248, 10),
    
    //TREEHOUSES / TREES
    new Platform(372,1108,128,223),
    new Platform(509,1615,137,224),
    new Platform(417,513,135,221),
    new Platform(1609,560,146,220),
    new Platform(1611,1155,141,223),
    //bushes
    new Platform(1292,2094,87,93),
    new Platform(1524,1912,84,86),
    new Platform(1570,1636,83,88),
    new Platform(1705,1545,89,86),
    new Platform(1296,947,80,86),
    new Platform(1702,898,95,130),
    new Platform(1698,486,99,89),
    new Platform(1613,350,88,86),
    new Platform(1478,258,86,85),
    new Platform(738,2094,93,93),
    new Platform(514,2003,82,91),
    new Platform(326,1589,85,130),
    new Platform(233,946,88,88),
    new Platform(281,762,87,87),
    new Platform(232,441,90,130),
    new Platform(370,347,89,91),
    new Platform(556,255,88,89),
    new Platform(735,990,94,130),
    
    // Big tree
    new Platform(964,941,176,251),
    new Platform(673,225,733,706),
    new Platform(604,395,69,464),
    new Platform(1407,365,81,494),
    
    
    //entrance to big tree
    new Platform(761, 1392, 276, 37),
    new Platform(1084, 1392, 276, 37),
    new Platform(760, 1203, 30, 203),
    new Platform(1330, 1203, 30, 203),
  ];
}

function initPlatformer() {
  score = 0;
  step = 0; //0 --> instructions/tutorial, 1 --> gameplay
  hero.x = 220;
  hero.y = 224;
  hero.fall();
  hero.sprintDuration = 15;
  hero.sprintCooldown = hero.sprintDuration * 4;
  if(hero.type.indexOf('mage')!=-1)
    hero.sprintDuration = 20;
  bX = 0;
  bY = 0;
  
  backgroundImage = loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fhills-background-full.png?v=1627921913243');
  
  platforms = [
    new Platform(0, height-192, 320, 192, 3),
    new Platform(445, height-192, 192, 64, 1),
    new Platform(762, height-192, 192, 192, 2), 
    new Platform(1144, height-252, 192, 192, 2),
    new Platform(1436, height-352, 192, 64, 1), //enemy
    new Platform(1828, height-242, 192, 64, 1), 
    new Platform(2170, height-332, 192, 64, 1), //enemy
    new Platform(2557, height-402, 192, 64, 1), 
    new Platform(2949, height-502, 320, 192, 3), //enemy
    new Platform(3369, height-808, 64, 256, 5),
    new Platform(3533, height-562, 192, 192, 2), //10
    new Platform(3850, height-532, 320, 64, 4), //enemy
    new Platform(4370, height-632, 64, 64, 0),
    new Platform(4640, height-592, 64, 64, 0),
    new Platform(4910, height-632, 64, 64, 0),
    new Platform(4352, height-400, 320, 64, 4), //enemies
    new Platform(4672, height-400, 320, 64, 4), //enemies
    new Platform(5200, height-500, 192, 64, 1),
    new Platform(5500, height-300, 192, 64, 1),
    new Platform(5850, height-400, 64, 64, 0), 
    new Platform(6100, height-500, 64, 64, 0), //enemy //20
    new Platform(6600, height-500, 64, 64, 0), //enemy
    new Platform(6850, height-400, 64, 64, 0), 
    new Platform(5930, height-250, 320, 64, 4), //enemies
    new Platform(6350, height-600, 64, 256, 5),
    new Platform(6514, height-250, 320, 64, 4), //enemies
    new Platform(7100, height-300, 64, 64, 0), 
    new Platform(7350, height-200, 64, 64, 0), 
    new Platform(7350, height-598, 64, 256, 5),
    new Platform(7500, height-392, 64, 256, 5),
    new Platform(7500, height-804, 64, 256, 5), //30
    new Platform(7860, height-700, 192, 64, 1), //enemy
    new Platform(8310, height-620, 192, 64, 1), //enemy
    new Platform(8770, height-540, 192, 64, 1), //enemy
    new Platform(9230, height-460, 320, 192, 3),
    new Platform(9700, height-640, 64, 64, 0),
    new Platform(9700, height-360, 64, 64, 0),
    new Platform(9900, height-740, 320, 64, 4), //enemies
    new Platform(10220, height-740, 320, 64, 4), //enemies
    new Platform(9900, height-260, 320, 64, 4),
    new Platform(10450, height-599, 64, 64, 0), //40
    new Platform(10450, height-458, 64, 256, 5),
    new Platform(10450, height-1040, 64, 256, 5),
    new Platform(10920, height-460, 320, 64, 4),
    new Platform(11160, height-760, 64, 256, 5),
    new Platform(11720, height-160, 320, 64, 4),
    new Platform(12340, height-192, 320, 192, 3),
  ];

  enemies = [
    new Enemy(platforms[4]),
    new Enemy(platforms[6]),
    new Enemy(platforms[8]),
    new Enemy(platforms[11]),
    new Enemy(platforms[15]),
    new Enemy(platforms[15]),
    new Enemy(platforms[15]),
    new Enemy(platforms[16]),
    new Enemy(platforms[16]),
    new Enemy(platforms[16]),
    new Enemy(platforms[20]),
    new Enemy(platforms[21]),
    new Enemy(platforms[23]),
    new Enemy(platforms[23]),
    new Enemy(platforms[23]),
    new Enemy(platforms[25]),
    new Enemy(platforms[25]),
    new Enemy(platforms[25]),
    new Enemy(platforms[31]),
    new Enemy(platforms[32]),
    new Enemy(platforms[33]),
    new Enemy(platforms[37]),
    new Enemy(platforms[37]),
    new Enemy(platforms[37]),
    new Enemy(platforms[38]),
    new Enemy(platforms[38]),
  ];
  
}

function initSurvival() {
  score = 0;
  hero.x = width/2 - hero.w/2;
  hero.y = height/2 - hero.h/2;
  bX = 0;
  bY = 0;
  step = 0;
  timer = 120;
  
  //in Survival, platforms function as barriers
  // so the hero can't go out of bounds
  platforms = [
    new Platform(-105, -210, 10, 850),
    new Platform(695, -210, 10, 850),
    new Platform(-100, -210, 800, 10),
    new Platform(-100, 640, 800, 10),
  ];
  
  enemies = [];
  lasers = [];
  lava = [];
  
  backgroundImage = loadImage("https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fdungeon-floor.png?v=1627876754754");
}

function keyPressed() {
  //text(keyCode, 100, 100);
  
  //during a cutscene... press any key to see next text
  if(cutscene) {
    if(dialogue.cooldown == 0) {
      dialogue.index++; //go to next text
      dialogue.cooldown = dialogue.cooldownDuration; //can't go to next text before this many frames
      if(dialogue.text.length == dialogue.index) {
        cutscene = false;
      }
    }
  }
  else {
    //W, up arrow
    if(keyCode==87 || keyCode==38) {
      hero.up = true;
    }
    //S, down arrow
    else if(keyCode==83 || keyCode==40) {
      hero.down = true;
    }
    //A, left arrow
    else if(keyCode==65 || keyCode==37) {
      hero.left = true;
      if(!hero.jumping && !hero.attacking)
        hero.facingRight = false;
    }
    //D, right arrow
    else if(keyCode==68 || keyCode==39) {
      hero.right = true;
      if(!hero.jumping && !hero.attacking)
        hero.facingRight = true;
    }
    //space-bar, dash
    else if(keyCode==32) {
      if(map === "Archery") {
        hero.shoot();
      } 
      else {
        if(!hero.sprinting && hero.sprintTime == 0) {
          if(hero.right) {
            hero.facingRight = true;
          } else if(hero.left) {
            hero.facingRight = false;
          }
          hero.sprinting = true;
          hero.sprintTime = hero.sprintDuration;
        }
      }
    }
    //J, interact or attack
    else if(keyCode==74) {
      //interact
      if(map==="Adventure" && !cutscene) {
        for(let i = 0; i < friends.length; i++) {
          let friend = friends[i];
          if(friend.distanceFrom(hero) < 75) {
            cutscene = true;
            dialogue.index = 0;
            dialogue.cooldown = dialogue.cooldownDuration;
            dialogue.text = friend.dialogue;
            helper = i; //stores index in array of which friend is speaking
            if(hero.x < friend.x + bX) {
              friend.facingRight = false;
              hero.facingRight = true;
            } else {
              friend.facingRight = true;
              hero.facingRight = false;
            }
            hero.up = false;
            hero.down = false;
            hero.left = false;
            hero.right = false;
          }
        }
        
        for(let door of doors) {
          if(collideRectRect(hero.x, hero.y+hero.h/3, hero.w, hero.h/3*2, door.x+bX, door.y+bY, door.w, door.h)) {
            //Select a New Character to Play
            if(door.destination === "Select") {
              characterSelect = true;
              helper = 0;
              
              buttons = [
                new Button(width/4-25, height/5, 50, 50, "⚔️", 24),
                new Button(width/4-25, height/5*2, 50, 50, "🧝", 24),
                new Button(width/4-25, height/5*3, 50, 50, "🦎", 24),
                new Button(width/4-25, height/5*4, 50, 50, "🧙", 24),
                new Button(width/5*2, height/3, 50, 50, "♂️", 24),
                new Button(width/5*2, height/3*2, 50, 50, "♀️", 24),
                new Button(25, height-25, 30, 30, "←", 24),
                new Button(width-35, height-25, 60, 30, "Play", 18)
              ];

              friends = [
                new Friend(width-210-24, 100, "knight-m"),
                new Friend(width-210-24, 100, "knight-f"),
                new Friend(width-210-24, 100, "elf-m"),
                new Friend(width-210-24, 100, "elf-f"),
                new Friend(width-210-24, 100, "lizard-m"),
                new Friend(width-210-24, 100, "lizard-f"),
                new Friend(width-210-24, 100, "mage-m"),
                new Friend(width-210-24, 100, "mage-f"),
              ];
              
            }
            //Takes you to a New Mini-Game
            else {
              map = door.destination;
              hero.prevX = hero.x;
              hero.prevY = hero.y;
              hero.prevBX = bX;
              hero.prevBY = bY;
              
              if(map === "Platformer") {
                initPlatformer();
                if(firstTime[0]) {
                  cutscene = true;
                  firstTime[0] = false;
                  helper = 0;
                  friends = [new Friend(50, hero.y, 'elf-m')];
                  hero.facingRight = false;
                  dialogue.index = 0;
                  dialogue.cooldown = dialogue.cooldownDuration;
                  dialogue.text = [
                    'Welcome to Platformer! %The objective is to reach the furthest %distance, ideally completing the full map.',
                    'Get to the end of the map by utilizing your %toolkit. You can move, sprint, attack, jump, %and wall jump. ',
                    'You can perform a wall jump when you %jump while overlapping with the wall of a %platform. Wall jumps reset when you land.',
                    'It is important to use all of these abilties in %synergy to succeed. Best of luck! %Controls:',
                    '• Move with WASD or the Arrow Keys %•Jump/Wall Jump with Space Bar %• Attack with J'
                  ];
                }
              } else if(map === "Survival") {
                initSurvival();
                if(firstTime[1]) {
                  cutscene = true;
                  firstTime[1] = false;
                  helper = 0;
                  friends = [new Friend(hero.x, hero.y, 'lizard-m')];
                  friends[0].facingRight = false;
                  hero.x -= 100;
                  hero.y += 50;
                  hero.facingRight = true;
                  dialogue.index = 0;
                  dialogue.cooldown = dialogue.cooldownDuration;
                  dialogue.text = [
                    'Welcome to Dungeon! %The objective of this game is survive for %as long as possible.',
                    'This game is played in waves, with new %hazards spawning after each new wave.',
                    'Among the hazards, you will find: %Goblins, Lasers, and Lava.',
                    'These hazards can only harm you if they %interact with your hitbox, as you can see %on your hero now.',
                    'There is also some down time in between %waves where no hazards will spawn. %Take this time to reposition yourself.',
                    'You must avoid the hazards that spawn to %survive. Tip = You can attack Goblins. %Controls:',
                    '• Move with WASD or the Arrow Keys %• Sprint with Space Bar %• Attack with J'
                  ];
                }
              } else if(map === "Archery") {
                initArchery();
                if(firstTime[2]) {
                  cutscene = true;
                  firstTime[2] = false;
                  helper = 0;
                  friends = [new Friend(width - 60, hero.y, 'knight-m')];
                  friends[0].facingRight = false;
                  hero.facingRight = true;
                  dialogue.index = 0;
                  dialogue.cooldown = dialogue.cooldownDuration;
                  dialogue.text = [
                    'Welcome to Archery! %The objective of this game is to obtain the %highest score in 45 seconds.',
                    'You earn points by shooting arrows at the %targets that will appear. Targets that are %further away grant more points.',
                    `There can be a maximum of ${hero.maxBullets} arrows on %the screen at a time. This means going for %targets that are farther away are riskier.`,
                    'Controls: %• Move with WASD or the Arrow Keys %• Shoot with J or Space Bar'
                  ];
                }
              } else if(map === "Tiles") {
                initTiles();
                if(firstTime[3]) {
                  cutscene = true;
                  firstTime[3] = false;
                  helper = 0;
                  friends = [new Friend(51, 395, 'mage-f')];
                  dialogue.index = 0;
                  dialogue.cooldown = dialogue.cooldownDuration;
                  dialogue.text = [
                    'Welcome to Tiles! %The objective of this game is to obtain the %highest score in 45 seconds.',
                    'You earn points by tapping the %D, F, J, and K keys when a tile appears %in their respective lanes.',
                    'More points are rewarded to those who %hit the tiles to the beat of the music!',
                    'Controls: %• Hit the tiles with D, F, J, and K'
                  ];
                }
              }
            }
          }
        }
      }
      //attack
      else if((map==="Platformer" || map === "Survival") && !hero.attacking && hero.attackTime == 0) {
        hero.attacking = true;
        hero.attackTime = time;
      }
      else if(map==="Archery") {
        hero.shoot();
      }
    }
  }
  
  if(map === 'Tiles') {
    if(keyCode == 68) { // 68 is for 'D' key
      for(let i = 0; i < tiles.length; i++) {
        let tile = tiles[i];
        //checking if in correct lane and if in correct area
        if(tile.goodPosition(150)) {
          tiles[i].clicked = true;
          break;
        }
      }   
    }
    if(keyCode == 70) { // 70 is for 'F' key
      for(let i = 0; i < tiles.length; i++) {
        let tile = tiles[i];
        //checking if in correct lane and if in correct area
        if(tile.x == 225 && tile.y >= 400 - tile.h/3*2 && tile.y <= 400 + tile.h/3*2) {
          tiles[i].clicked = true;
          break;
        }
      }   

    }
    if(keyCode == 74){ // 74 is for 'J' key

      for(let i = 0; i < tiles.length; i++) {
        let tile = tiles[i];
        //checking if in correct lane and if in correct area
        if(tile.x == 300 && tile.y >= 400 - tile.h/3*2 && tile.y <= 400 + tile.h/3*2) {
          tiles[i].clicked = true;
          break;
        }
      }   

    }
    if(keyCode == 75){ // 75 is for 'K' key
      for(let i = 0; i < tiles.length; i++) {
        let tile = tiles[i];
        //checking if in correct lane and if in correct area
        if(tile.x == 375 && tile.y >= 400 - tile.h/3*2 && tile.y <= 400 + tile.h/3*2) {
          tiles[i].clicked = true;
          break;
        }
      }   

    }
  }
}

function keyReleased() {
  //W, up arrow
  if(keyCode==87 || keyCode==38) {
    hero.up = false;
  }
  //S, down arrow
  else if(keyCode==83 || keyCode==40) {
    hero.down = false;
  }
  //A, left arrow
  else if(keyCode==65 || keyCode==37) {
    hero.left = false;
  }
  //D, right arrow
  else if(keyCode==68 || keyCode==39) {
    hero.right = false;
  } 
  
}

function mousePressed() {
  for(let button of buttons) {
    if(button.pressed) {
      button.action();
    }
  }
}

//--- OTHER CLASSES ---
class Button {
  //if image is defined, button will draw the image inside of itself
  constructor(centerX, centerY, w, h, text, textSize) {
    this.w = w;
    this.h = h;
    this.x = centerX - this.w/2;
    this.y = centerY - this.h/2;
    this.text = text;
    this.textSize = textSize || this.w*this.h/500;
    this.pressed = false;
  }
  
  action() {
    if(map === "Menu") {
      if(step === 0) {
        step++;
        buttons = [
          new Button(25, height-25, 30, 30, "←", 24),
          //new Button(width/3, height/2, width/4, 70, "Adventure"),
          //new Button(width/3*2, height/2, width/4, 70, "Arcade")
          new Button(width/2, height/2, width/4, 70, "Adventure"),
        ];
      } else if(step === 1) {
        if(this.text === "←") {
          step--;
          buttons = [new Button(width/2, height/3*2-20, 250, 70, "START")];
        } else {
          step++;
           // if(this.text === "Adventure") {} 
          buttons = [
            new Button(width/4-25, height/5, 50, 50, "⚔️", 24),
            new Button(width/4-25, height/5*2, 50, 50, "🧝", 24),
            new Button(width/4-25, height/5*3, 50, 50, "🦎", 24),
            new Button(width/4-25, height/5*4, 50, 50, "🧙", 24),
            new Button(width/5*2, height/3, 50, 50, "♂️", 24),
            new Button(width/5*2, height/3*2, 50, 50, "♀️", 24),
            new Button(25, height-25, 30, 30, "←", 24),
            new Button(width-35, height-25, 60, 30, "Play", 18)
          ];
        }
      } else if(step === 2) {
        //CHARACTER SELECTION
        if(this.text === "♂️" && helper%2 != 0) { //male denoted by 0, 2, 4, 6
          helper--;
        } else if(this.text === "♀️" && helper%2 == 0) { //female denoted by 1, 3, 5, 7
          helper++;
        } else if(this.text === "⚔️" && helper >= 2) {
          if(helper%2==0) { //male
            helper = 0;
          } else { //female
            helper = 1;
          }
        } else if(this.text === "🧝" && (helper <= 1 || helper >= 4)) {
          if(helper%2==0) { //male
            helper = 2;
          } else { //female
            helper = 3;
          }
        } else if(this.text === "🦎" && (helper <= 3 || helper >= 6)) {
          if(helper%2==0) { //male
            helper = 4;
          } else { //female
            helper = 5;
          }
        } else if(this.text === "🧙" && helper <= 5) {
          if(helper%2==0) { //male
            helper = 6;
          } else { //female
            helper = 7;
          }
        } else if(this.text === "←") {
          step--;
          buttons = [
          new Button(25, height-25, 30, 30, "←", 24),
            //new Button(width/3, height/2, width/4, 70, "Adventure"),
            //new Button(width/3*2, height/2, width/4, 70, "Arcade")
            new Button(width/2, height/2, width/4, 70, "Adventure"),
          ];
        } else if(this.text === "Play") {
          initAdventure();
        }
      }
    } else if(map === "Adventure" && characterSelect) {
      //CHARACTER SELECTION
        if(this.text === "♂️" && helper%2 != 0) { //male denoted by 0, 2, 4, 6
          helper--;
        } else if(this.text === "♀️" && helper%2 == 0) { //female denoted by 1, 3, 5, 7
          helper++;
        } else if(this.text === "⚔️" && helper >= 2) {
          if(helper%2==0) { //male
            helper = 0;
          } else { //female
            helper = 1;
          }
        } else if(this.text === "🧝" && (helper <= 1 || helper >= 4)) {
          if(helper%2==0) { //male
            helper = 2;
          } else { //female
            helper = 3;
          }
        } else if(this.text === "🦎" && (helper <= 3 || helper >= 6)) {
          if(helper%2==0) { //male
            helper = 4;
          } else { //female
            helper = 5;
          }
        } else if(this.text === "🧙" && helper <= 5) {
          if(helper%2==0) { //male
            helper = 6;
          } else { //female
            helper = 7;
          }
        } else if(this.text === "←" || this.text === "Play") {
          //get out of character selection
          characterSelect = false;
          
          //A different hero was chosen
          if(this.text === "Play") {
            let type = "";
            if(helper <= 1) { //knight
              type += "knight";
            } else if(helper <= 3) { //elf
              type += "elf";
            } else if(helper <= 5) { //lizard
              type += "lizard";
            } else { //mage
              type += "mage";
            }

            if(helper%2 == 0) { //male
              type += "-m";
            } else { //female
              type += "-f";
            }
            
            let curX = hero.x;
            let curY = hero.y;
            hero = new Hero(type);
            hero.x = curX;
            hero.y = curY;
          }

          buttons = [];
          friends = [
            new Friend(1060, 1850, "elf-f"), //Katelyn
            new Friend(632, 1300, "lizard-m"), //Erdal
            new Friend(530, 792, "elf-m"), //Robert
            new Friend(1570, 747, "mage-f"), //Sasyashmini
            new Friend(1550, 1340, "knight-m"), //Michael
            new Friend(485, 318, "lizard-f"), //Student 1
          ];
          friends[0].facingRight = false;
          friends[2].facingRight = false;
          friends[3].facingRight = false;
          friends[4].facingRight = false;

          platforms = [
            //ponds
            new Platform(692, 2226, 320, 156),
            new Platform(1110, 2226, 320, 156),
            //left side
            new Platform(658, 2178, 10, 278),
            new Platform(198, 368, 10, 1340),
            new Platform(436, 2120, 186, 10),
            new Platform(612, 2120, 10, 55),
            new Platform(612, 2166, 56, 10),
            new Platform(390, 2074, 48, 48),
            new Platform(382, 1802, 10, 274),
            new Platform(206, 1706, 48, 48),
            //new Platform(250, 1754, 48, 48), //tree covers so it's unecessary
            new Platform(280, 1728, 90, 72), //tree
            new Platform(298, 1802, 84, 10), //under the tree
            new Platform(206, 322, 48, 48),
            new Platform(251, 314, 141, 10),
            new Platform(382, 230, 10, 94),

            //right side
            new Platform(1452, 2166, 10, 290),
            new Platform(1462, 2166, 82, 10),
            new Platform(1822, 368, 10, 1340), 
            new Platform(1592, 2074, 48, 48),
            new Platform(1544, 2122, 48, 48),
            new Platform(1638, 1802, 10, 274), 
            new Platform(1776, 1706, 48, 48),
            new Platform(1732, 1754, 48, 48),
            new Platform(1648, 1802, 84, 10),
            new Platform(1776, 322, 48, 48),
            new Platform(1638, 314, 141, 10), 
            new Platform(1638, 230, 10, 94),

            //top
            new Platform(390, 222, 1248, 10),

            //TREEHOUSES / TREES
            new Platform(372,1108,128,223),
            new Platform(509,1615,137,224),
            new Platform(417,513,135,221),
            new Platform(1609,560,146,220),
            new Platform(1611,1155,141,223),

            //entrance to big tree
            new Platform(761, 1392, 276, 37),
            new Platform(1084, 1392, 276, 37),
          ];
        }
     } else {
       if(this.text === 'Play Again') {
         if(map === 'Archery') {
           initArchery();
         } else if(map === 'Tiles') {
           initTiles();
         } else if(map === 'Platformer') {
           initPlatformer();
         } else if(map === 'Survival') {
           initSurvival();
         }
         buttons = [];
         hero.health = hero.maxHealth;
         gameIsOver = false;
       } else if(this.text === 'Exit') {
         map = 'Adventure';
         initAdventureArrays();
         
         gameIsOver = false;
         hero.health = hero.maxHealth;
         hero.jumping = false;
         hero.attacking = false;
         hero.sprintDuration = 20;
         hero.sprintCooldown = hero.sprintDuration * 2.5;
         if(hero.type.indexOf('mage')!=-1)
           hero.sprintDuration = 26;
         hero.x = hero.prevX;
         hero.y = hero.prevY;
         bX = hero.prevBX;
         bY = hero.prevBY;
       }
     }
  }
  
  drawSelf() {
    if(collidePointRect(mouseX, mouseY, this.x, this.y, this.w, this.h)) {
      fill(190);
      this.pressed = true;
    } else {
      fill(210);
      this.pressed = false;
    }
    
    stroke(0);
    rect(this.x, this.y, this.w, this.h);
    
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(this.textSize);
    noStroke(0);
    text(this.text, this.x+this.w/2, this.y+this.h/2);
    textAlign(LEFT, BASELINE);
    textSize(12);
    stroke(0);
  }
}

//ADVENTURE CLASSES
//Portals to different games
class Door {
  constructor(x, y, w, h, color, destination) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.destination = destination;
  }
  
  drawSelf() {
    // fill(this.color);
    // rect(this.x + bX, this.y + bY, this.w, this.h);
    
    if(collideRectRect(hero.x, hero.y+hero.h/3, hero.w, hero.h/3*2, this.x+bX, this.y+bY, this.w, this.h) && !cutscene) {
      fill(255);
      circle(this.x + this.w/2 + bX, this.y - 17 + bY, 25);
      
      fill(0);
      noStroke();
      textAlign(CENTER);
      textSize(20);
      text("J", this.x + this.w/2 + bX, this.y - 10 + bY);
      textAlign(LEFT);
      textSize(12);
      
    }
  }
}

//NPCs
class Friend {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.w = 16 * 3;
    this.h = 28 * 3;
    this.type = type;
    
    this.idle = [];
    this.idleLeft = [];
    this.move = [];
    this.moveLeft = [];
    this.createFriend();
    
    this.up = false;
    this.down = false;
    this.left = false;
    this.right = false;
    this.facingRight = true;
    
    this.animTime = 0;
    this.animSpeed = 6;
    
    if(this.type == 'elf-f') { //Katelyn - Elf
      this.dialogue = [
        "Hi there! My name's Katelyn. %Welcome to the game!",
        "On this island, there are four < Trials > to %beat. They're each a different genre, and %will challenge all your game-playing skills.",
        "Them, of course, being: %Erdal's Dungeon, Robert's Platforms, %Saya's Tiles, and Mike's Archery.",
        "Feel free to move around and explore %the map. You might even find some %Easter Eggs :)",
        "You may play the trials in any order. %You can also select a new character at %the Treehouse to the left.",
        "Have fun, and good luck!"
      ];
    } else if(this.type == 'mage-f') { //Sayashmini - Mage
      this.dialogue = [
        "♪ I used to ruuule the woorld~ %Seas would rise when I gave the wo- ♪",
        "Wait... is someone there? %I can't really see you... your camera's off... %Lemme see your FACE.",
        "Hi there! I'm Sayashmini, Cohort Advisor %and summoner of the Hawaiian mangoes.",
        "Looking to play something musical, eh? %WELL LOOK NO FURTHER! %Play this game here. It's fun :))",
      ];
    } else if(this.type == 'lizard-m') { //Erdal - Lizard
      this.dialogue = [
        "Hello. My name is Erdal, and I'm the %Google Lead Instructor at CSSI.",
        "I have cool cat and I'm... from Canada. %(POV: the Game Devs aren't creative)",
        "This game is probably the most difficult. %Avoid the hazards and surivive for as long %as possible. Enter at your own risk."
      ];
    } else if(this.type == 'elf-m') { //Robert - Elf
      this.dialogue = [
        "Hey, my name's Robert. %I'm one of the QC Lead Instructors. %I also have a really cool last name.",
        "Feel free to play this Platformer game. Let %me know your highscore! I think you'll like %this game. I personally really enjoy pl-",
        "...O-o-h s-sorry I'm b-break-ing up. M-my %wifi i-s a... b-it spott--- I-'ll joi-n b-back on %m---yphone--"
      ];
    } else if(this.type == 'knight-m') { //Mike - Knight
      this.dialogue = [ 
        "Hi, my name is Mike (the Knight). %I'm a QC Lead Instructor at CSSI.",
        "Today, I brushed my teeth AND took a %shower. You know, I'm proud of that. %Yeah.",
        "You ever wonder why math is SO much %better than physics? %What do you mean I'm biased?",
        "OH right, the game. This is Archery. %Shoot down as many targets as you can %in the time given. Good luck!"
      ];
    } else if(this.type == 'lizard-f') {
      this.dialogue = [
        "Did you know that the attack stat is %completely irrelevant? It literally does %nothing.",
        "PLUS, two of the four games on this %island completely ignore what stats you %have! Interesting design choice..."
      ];
    } else if(this.type == 'knight-f') {
      this.dialogue = [
        "Fun Fact #1: The movement speeds of %every hero in Adventure Mode are all the %same!",
        "Fun Fact #2: I was almost chosen as the %character that would've been used to %represent Katelyn!",
        "Fun Fact #3: It is basically impossible %for the Knight to fully complete Platformer! %(Well this one's not so fun of a fact.)",
        "Fun Fact #4: The Mage sprints for the %longest time but has the same sprinting %cooldown as the rest of the heroes!",
        "Fun Fact #5: We couldn't think of a better %game title!",
        "Oh, looks like I'm out of fun facts..."
      ];
    } else if(this.type == 'mage-m') {
      this.dialogue = [
        "Greetings! I'm the High Score Teller. %I keep track of all of your high scores. %Well, here they are:",
        "High Scores (Page 1) %• Erdal's Dungeon: Wave "+highScores[0]+" %• Robert's Platforms: "+highScores[1]+" percent",
        "High Scores (Page 2) %• Sayashmini's Tiles: "+highScores[2]+" points %• Michael's Archery: "+highScores[3]+" points"
      ];
    }
  }
  
  drawSelf() {
    if(this.animTime + this.animSpeed*4 <= time)
      this.animTime = time;
  
    //drawing the friend
    image(this.acquireImage(), this.x + bX, this.y + bY, this.w, this.h);
    //drawing ideal hitbox
    /*noFill();
    stroke('green');
    rect(this.x + bX, this.y + this.h/3 + bY, this.w, this.h/3*2);
    noStroke();*/
    
    if(this.distanceFrom(hero) < 75 && !cutscene) {
      fill(255);
      circle(this.x + this.w/2 + bX, this.y + this.h/3 - 17 + bY, 25);
      
      fill(0);
      noStroke();
      textAlign(CENTER);
      textSize(20);
      text("J", this.x + this.w/2 + bX, this.y + this.h/3 - 10 + bY);
      textAlign(LEFT);
      textSize(12);
    }
  }
  
  drawSelfIgnoreBackground() {
    if(this.animTime + this.animSpeed*4 <= time)
      this.animTime = time;
  
    //drawing the friend
    image(this.acquireImage(), this.x, this.y, this.w, this.h);
  }
  
  acquireImage() {
    let imageIndex = floor((time - this.animTime)/this.animSpeed);
    if(this.up || this.down || this.left || this.right) {
      if(this.facingRight) {
        return this.move[imageIndex];
      } else {
        return this.moveLeft[imageIndex];
      }
    }
    else {
      if(this.facingRight) {
        return this.idle[imageIndex];
      } else {
        return this.idleLeft[imageIndex];
      }
    }
  }
  
  //distance formula (math)
  distanceFrom(hero) {
    //calculates distance of center of Hero from center of Friend 
    //center of Hero and Friend is a little lower than y+h/2
    //(that's just how the sprites are drawn, there's extra space on top)
    let deltaY = (hero.y + hero.h/3*2) - (this.y + bY + this.h/3*2);
    let deltaX = (hero.x + hero.w/2) - (this.x + bX + this.w/2);
    return sqrt(deltaY**2 + deltaX**2);
  }
  
  createFriend() {
     if(this.type === 'knight-m') {
      this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-0.png?v=1627694792529'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-1.png?v=1627694792529'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-2.png?v=1627694792529'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-3.png?v=1627694792687')      
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-L0.png?v=1627694792728'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-L1.png?v=1627694792814'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-L2.png?v=1627694793130'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-i-L3.png?v=1627694793175')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-0.png?v=1627694793270'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-1.png?v=1627694793319'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-2.png?v=1627694792529'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-3.png?v=1627694793407')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-L0.png?v=1627694793436'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-L1.png?v=1627694793493'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-L2.png?v=1627694792528'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-m-m-L3.png?v=1627694792529')
      ];
    } else if(this.type === 'knight-f') {
       this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-0.png?v=1627701318260'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-1.png?v=1627701318205'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-2.png?v=1627701318220'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-3.png?v=1627701318286')
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-L0.png?v=1627701318374'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-L1.png?v=1627701318389'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-L2.png?v=1627701318410'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-i-L3.png?v=1627701318487')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-0.png?v=1627701317955'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-1.png?v=1627701317955'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-2.png?v=1627701318511'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-3.png?v=1627701317955')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-L0.png?v=1627701317955'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-L1.png?v=1627701317955'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-L2.png?v=1627701318095'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fknight-f-m-L3.png?v=1627701318236')
      ]; 
    } else if(this.type === 'elf-m') {
       this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-0.png?v=1627701348958'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-1.png?v=1627701349073'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-2.png?v=1627701349103'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-3.png?v=1627701349153')
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-L0.png?v=1627701349189'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-L1.png?v=1627701349392'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-L2.png?v=1627701349441'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-i-L3.png?v=1627701349557')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-0.png?v=1627701349579'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-1.png?v=1627701348743'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-2.png?v=1627701349598'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-3.png?v=1627701348743')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-L0.png?v=1627701348742'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-L1.png?v=1627701348818'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-L2.png?v=1627701348851'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-m-m-L3.png?v=1627701348940')
      ]; 
    } else if(this.type === 'elf-f') {
       this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-0.png?v=1627695447062'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-1.png?v=1627695447125'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-2.png?v=1627695447257'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-3.png?v=1627695447272')
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-L0.png?v=1627695447309'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-L1.png?v=1627695447110'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-L2.png?v=1627695447438'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-i-L3.png?v=1627695447511')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-0.png?v=1627695447626'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-1.png?v=1627695447601'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-2.png?v=1627695446881'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-3.png?v=1627695446881')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-L0.png?v=1627695446881'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-L1.png?v=1627695446881'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-L2.png?v=1627695446972'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Felf-f-m-L3.png?v=1627695447088')
      ]; 
    } else if(this.type === 'lizard-m') {
       this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-0.png?v=1627699878432'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-1.png?v=1627699877662'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-2.png?v=1627699877930'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-3.png?v=1627699877662')
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-L0.png?v=1627699877662'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-L1.png?v=1627699877662'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-L2.png?v=1627699878078'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-i-L3.png?v=1627699878181')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-0.png?v=1627699878118'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-1.png?v=1627699878278'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-2.png?v=1627699878307'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-3.png?v=1627699877887')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-L0.png?v=1627699877748'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-L1.png?v=1627699878404'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-L2.png?v=1627699878009'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-m-m-L3.png?v=1627699877662')
      ]; 
    } else if(this.type === 'lizard-f') {
       this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-0.png?v=1627702213729'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-1.png?v=1627702213855'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-2.png?v=1627702213832'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-3.png?v=1627702213941')
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-L0.png?v=1627702213885'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-L1.png?v=1627702214074'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-L2.png?v=1627702214092'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-i-L3.png?v=1627702213556')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-0.png?v=1627702213556'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-1.png?v=1627702214123'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-2.png?v=1627702214175'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-3.png?v=1627702213556')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-L0.png?v=1627702213556'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-L1.png?v=1627702213556'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-L2.png?v=1627702213556'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Flizard-f-m-L3.png?v=1627702213556')
      ]; 
    } else if(this.type === 'mage-m') {
       this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-0.png?v=1627702225894'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-1.png?v=1627702225894'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-2.png?v=1627702225987'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-3.png?v=1627702226029')
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-L0.png?v=1627702226087'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-L1.png?v=1627702226129'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-L2.png?v=1627702226240'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-i-L3.png?v=1627702226302')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-0.png?v=1627702226365'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-1.png?v=1627702226541'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-2.png?v=1627702226556'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-3.png?v=1627702225945')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-L0.png?v=1627702226582'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-L1.png?v=1627702226649'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-L2.png?v=1627702226681'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-m-m-L3.png?v=1627702226417')
      ]; 
    } else if(this.type === 'mage-f') {
       this.idle = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-0.png?v=1627700428334'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-1.png?v=1627700428334'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-2.png?v=1627700428451'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-3.png?v=1627700428559')
       ];
      this.idleLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-L0.png?v=1627700428575'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-L1.png?v=1627700428610'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-L2.png?v=1627700428674'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-i-L3.png?v=1627700428797')
      ];
      this.move = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-0.png?v=1627700428781'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-1.png?v=1627700428898'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-2.png?v=1627700428968'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-3.png?v=1627700428334')
      ];
      this.moveLeft = [
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-L0.png?v=1627700428334'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-L1.png?v=1627700429001'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-L2.png?v=1627700429056'),
        loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fwizzard-f-m-L3.png?v=1627700429091')
      ]; 
    }
  }
}

//PLATFORMER CLASSES
class Platform {
  constructor(x, y, w, h, index) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.index = index;
  }
  
  drawSelf() {
    //fill(125, 100, 75);
    //rect(this.x + bX, this.y + bY, this.w, this.h);
    
    image(platformImages[this.index], this.x + bX, this.y + bY, this.w, this.h);
    
  }
}

class Enemy {
  constructor(platform, x, y) {
    this.plat = platform || null; //= platform if Platformer; = null if Other
    this.w = 48;
    this.h = 48;
    //Other Modes, given specific coordinates
    if(this.plat == null) {
      this.x = x;
      this.y = y;
    } else {
      this.x = platform.x + random(platform.w - this.w);
      this.y = platform.y - this.h;
    }
    this.facingRight = true;
    this.moving = false;
    this.speed = 1.5;
    
    this.stunned = false;
    this.stunTime = 0;
    
    this.idle = [];
    this.idleLeft = [];
    this.move = [];
    this.moveLeft = [];
    this.createEnemy();
    
    this.animTime = 0;
    this.animSpeed = 6;
  }
  
  actSurvival() {
    //stunned (just attacked hero)
    if(this.stunned) {
      this.moving = false;
      this.stunTime--;
      if(this.stunTime == 0) {
        this.stunned = false;
      }
    } else {
      this.moving = true;

      //using angles to achieve smooth movement
      let distX = hero.x + hero.w/2 - (this.x + this.w/2 + bX);
      let distY = hero.y + hero.h/3*2 - (this.y + this.h/2 + bY);
      let angle = atan(distY/distX);

      //hypotenuse of triangle created
      let distH = distY / sin(angle);

      //this.speed is the max/master velocity
      //getting velocity x and y components
      let vX = (distX/distH) * this.speed;
      let vY = (distY/distH) * this.speed;
      if(distX < 0) {
        vX *= -1;
        vY *= -1;
      }

      if(vX > 0) 
        this.facingRight = true;
      else
        this.facingRight = false;

      this.x += vX;
      this.y += vY;
    }
  }
  
  actPlatformer() {
    //stunned (just attacked hero)
    if(this.stunned) {
      this.moving = false;
      this.stunTime--;
      if(this.stunTime == 0) {
        this.stunned = false;
      }
    } else {
      this.moving = true;

      if(this.facingRight) {
        if(this.x + this.w + this.speed <= this.plat.x + this.plat.w) {
          this.x += this.speed;
        } else {
          this.facingRight = false;
        }
      } else {
        if(this.x - this.speed >= this.plat.x) {
          this.x -= this.speed;
        } else {
          this.facingRight = true;
        }
      }
    }
  }
  
  stun() {
    this.stunned = true;
    this.stunTime = 120;
  }
  
  drawSelf() {
    if(this.animTime + this.animSpeed*4 <= time)
      this.animTime = time;
  
    //drawing the enemy
    image(this.acquireImage(), this.x + bX, this.y + bY, this.w, this.h);
  }
  
  //returns true if defeated, false if still alive
  takeDamage(weapon) {
    if(weapon.active) {
      if(collideRectRect(this.x + bX, this.y + bY, this.w, this.h, weapon.x, weapon.y, weapon.w, weapon.h)) {
        return true;
      }
    }
    return false;
  }
  
  acquireImage() {
    let imageIndex = floor((time - this.animTime)/this.animSpeed);
    if(this.moving) {
      if(this.facingRight) {
        return this.move[imageIndex];
      } else {
        return this.moveLeft[imageIndex];
      }
    }
    else {
      if(this.facingRight) {
        return this.idle[imageIndex];
      } else {
        return this.idleLeft[imageIndex];
      }
    }
  }
  
  createEnemy() {
    this.idle = [
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-i-0.png?v=1627877217337'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-i-1.png?v=1627877217361'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-i-2.png?v=1627877217455'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-i-3.png?v=1627877217558')      
     ];
    this.idleLeft = [
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-i-L0.png?v=1627877217604'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-i-L1.png?v=1627877217688'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-i-L2.png?v=1627877217776'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-i-L3.png?v=1627877217949')
    ];
    this.move = [
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-m-0.png?v=1627877217993'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-m-1.png?v=1627877218101'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-m-2.png?v=1627877217794'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-m-3.png?v=1627877217908')
    ];
    this.moveLeft = [
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-m-L0.png?v=1627877217199'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-m-L1.png?v=1627877217200'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-m-L2.png?v=1627877217200'),
      loadImage('https://cdn.glitch.com/d618e616-d347-48a7-8975-d85669ff5388%2Fgoblin-m-L3.png?v=1627877217200')
    ];
  }
}

//SURVIVAL CLASSES
class Lava {
  //image(backgroundImage, -100 + bX, -210 + bY, 800, 920);
  constructor(x, y, size) {
    this.w = size || 50;
    this.h = size || 50;
    this.x = x || random(-50, 650 - this.w);
    this.y = y || random(-160, 610 - this.h);
    
    this.energy = 4; //amount of 'cycles' able to stay alive for
    this.expired = false;
    this.active = true;
  }
  
  spread() {
    if(!this.expired) {
      //Pick a random direction (right, up, left, down)
      //See if it's valid to place a new lava there
      //If so, place a new one down
      //If not, pick a new direction
      //If all directions are occupied, this lava becomes expired/stale
      // and won't be checked anymore
      let direction = floor(random(0, 4)); //0, 1, 2, 3
      let found = false;
      for(let i = 0; i < 4 && !found; i++) {
        if(direction == 0) { //right
          if(this.x + this.w*2 <= 650 && this.isAvailable(this.x + this.w, this.y, this.w)) {
            lava.push(new Lava(this.x + this.w, this.y, this.w, this.h));
            found = true;
          }
        } else if(direction == 1) { //up
          if(this.y - this.h >= -160) {
            lava.push(new Lava(this.x, this.y - this.h, this.w, this.h));
            found = true;
          }
        } else if(direction == 2){ //left
          if(this.x - this.w >= -50) {
            lava.push(new Lava(this.x - this.w, this.y, this.w, this.h));
            found = true;
          }
        } else { //down
          if(this.y + this.h*2 <= 610) {
            lava.push(new Lava(this.x, this.y + this.h, this.w, this.h));
            found = true;
          }
        }

        direction++;
        if(direction == 4)
          direction = 0;
        //console.log(`Iterations: ${i} | Direction: ${direction}`);
      }
      
      //only reproduces once
      this.expired = true;
    }
    
    this.energy--;
  }
  
  //compares theoretical position with all lava in lava array
  isAvailable(x, y, w, h) {
    for(let i = 0; i < lava.length; i++) {
      let cur = lava[i];
      if(collideRectRect(x,y,w,h,cur.x,cur.y,cur.w,cur.h))
        return false;
    }
    return true;
  }
  
  drawSelf() {
    fill('red');
    rect(this.x + bX, this.y + bY, this.w, this.h);
    
    //image(platformImages[this.index], this.x + bX, this.y + bY, this.w, this.h);
    
  }
}


class Laser {
  //image(backgroundImage, -100 + bX, -210 + bY, 800, 920);
  constructor() {
    let rand = floor(random(0, 2));
    if(rand==0) {
      this.x = random(-100, 670); 
      this.y = -210;
      this.w = 30;
      this.h = 920;
      this.vertical = true;
    }
    else {
      this.x = -100;
      this.y = random(-210, 630);
      this.w = 800;
      this.h = 30;
      this.vertical = false;
    }
    //laser will broadcast where it will shoot for this many frames
    this.warningTime = 80;
    //whether or not hero can be hurt by this laser
    this.active = false; 
  }
  
  drawSelf() {
    //draw warning
    if(this.warningTime > 0) {
      stroke('red');
      if(this.vertical) {
        line(this.x + this.w/2 + bX, this.y + bY, this.x + this.w/2 + bX, this.y + this.h + bY);
      } else {
        line(this.x + bX, this.y + this.h/2 + bY, this.x + this.w + bX, this.y + this.h/2 + bY);
      }
    } 
    //draw actual laser
    else {
      noStroke();
      fill('red');
      rect(this.x + bX, this.y + bY, this.w, this.h);
    }
  }
  
  act() {
    if(this.warningTime > 0) {
      this.warningTime--;
      if(this.warningTime === 0)
        this.active = true;
    }
    else {
      if(this.vertical) {
        this.w-=2;
        this.x+=1;
        if(this.w == 0)
          this.finished = true;
      } else {
        this.h-=2;
        this.y+=1;
        if(this.h == 0)
          this.finished = true;
      }
    }
  }
}

//--- ARCHERY CLASSES ---
class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 10;
    this.bulletSpeed = 6;
  }
  
  show() {
    //ellipse(this.x, this.y, this.r);
    image(arrowImg, this.x-27.5, this.y, this.r*5 , this.r*5);
  }
  
  move() {
    this.y -= this.bulletSpeed;
  }
}

class Target {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.value = this.getValue();
  }
  
  show() {
    //ellipse(this.x, this.y, this.r);
    image(targetImg,this.x-15,this.y-15,this.r,this.r);
  }
  
  move() {
    if (this.y == 25 || this.y == 125 || this.y == 225) {
      this.x -= 1;
    } else {
      this.x += 1;
    }
  }
  
  getValue() {
    if(this.y == 25){
      return 100;
    } else if(this.y == 75){
      return 50;
    } else if(this.y == 125){
      return 25;
    } else if(this.y == 175){
      return 10;
    } else {
      return 5;
    }
  }
  
  collision() {
    for(let i = 0; i < hero.bullets.length; i++) {
      if (collideCircleCircle(this.x, this.y, this.r, hero.bullets[i].x, hero.bullets[i].y, hero.bullets[i].r)) {
        hero.bullets.splice(i, 1);
        score += this.value;
        return true;
      } 
    }
    return false;
  }
}  


//--- TILES CLASSES ---
function Tile(x, y) {
  this.w = 75;
  this.h = 75;
  this.x = x;
  this.y = -this.h;
  this.moveSpeed = 5;
  this.colorX = random(255);
  this.colorY = random(255);
  this.colorZ = random(255);
  this.clicked = false;

  this.show = function() {
    stroke(0);
    fill(this.colorX, this.colorY, this.colorZ);
    rect(this.x, this.y, this.w, this.h);
  }

  this.move = function() {
    this.y += this.moveSpeed;
  }
  
  this.goodPosition = function(xAlignment) {
    return this.x == xAlignment && this.y >= 400 - this.h/3*2 && this.y <= 400 + this.h/3*2;
  }
}



function Text(phrase, color) {
  this.x = random(30, width-30);
  this.y = random(30, height-30);
  this.duration = 30; //how many frames to appear for
  this.finished = false; //indiciates when to remove from array
  
  this.show = function() {
    noStroke();
    fill(0);
    textSize(22);
    text(`${phrase}`, this.x, this.y);
    if(this.duration > 0) {
      this.duration--;
    }
    else {
      this.finished = true;
    }
  }
}