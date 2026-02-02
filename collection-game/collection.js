/* Getting the Canvas */
const cvs = document.getElementById("game");
const ctx = cvs.getContext("2d");

const cDRAW_AREA = 200;
const cUPDATE_AREA = 144;
const cMAP_WIDTH = 500;
const cMAP_HEIGHT = 500;
const cTILE_SIZE = 32;
const cPLAYER_MOVE_SPEED = 10;

const cSCREEN_WIDTH = 288;
const cSCREEN_HEIGHT = 320;

/* Helper functions */
function randrange(minNum, maxNum){
  return Math.floor(Math.random() * (maxNum-minNum)) + minNum;
}

function int(floatVal){
  return Math.floor(floatVal);
}

/* Class definitions */
class AnimImgSet {
  constructor(imgName, numImgs, framesPerUpdate) {
    this.imgFrames = [];
    this.currFrame = randrange(0, numImgs);
    this.numFrames = numImgs;
    this.framesSinceUpdate = 0;
    this.framesPerUpdate = framesPerUpdate;

    let tempImg;
    for (let i=1; i<=numImgs; i++){
      tempImg = new Image();
      tempImg.src = imgName+"-"+i.toString()+".png";
      this.imgFrames.push(tempImg);
    }
  }

  // Updates and returns current frame
  getFrame(){
    if (this.numFrames != 1){
      this.framesSinceUpdate++
      if (this.framesSinceUpdate >= this.framesPerUpdate){
        this.framesSinceUpdate = 0;
        this.currFrame++;
        if (this.currFrame >= this.numFrames) this.currFrame = 0;
      }
    }

    return this.imgFrames[this.currFrame];
  }

  getWidth(){
    return this.imgFrames[0].width;
  }

  getHeight(){
    return this.imgFrames[0].height;
  }
}

class AnimatedSprite {
    constructor(animSet, x, y, alwaysUpdate=false){
        this.notes = notes;
        this.animSet = animSet;
        this.alwaysUpdate = alwaysUpdate;
        this.width = animSet.getWidth();
        this.height = animSet.getHeight();
        this.x = x;
        this.y = y;

    }

    draw(camX, camY){
      if (this.x > camX-cDRAW_AREA && this.x < camX+cDRAW_AREA){
        if (this.y > camY-cDRAW_AREA && this.y < camY+cDRAW_AREA){
          ctx.drawImage(this.images[this.animSet.getFrame()], (this.x-camX)+(cSCREEN_WIDTH/2), (this.y-camY)+(cSCREEN_HEIGHT/2));
        }
      }
    }

    collides_with(sprite2){
        if (this.x+parseInt(this.width/2) < sprite2.x+sprite2.width && this.x+parseInt(sprite2.width/2) > sprite2.x-sprite2.width){
            if (this.y+parseInt(this.height/2) < sprite2.y+sprite2.height && this.y+parseInt(this.height/2) > sprite2.y-sprite2.height){
                return true;
            }
        }
    }
}

class PlayerSprite {
    constructor(animSetL, animSetR, animSetU, animSetD, animSetDefault, x, y){
        this.animSetL = animSetL;
        this.animSetR = animSetR;
        this.animSetU = animSetU;
        this.animSetD = animSetD;
        this.animSetDefault = animSetDefault;
        
        this.width = animSetD.getWidth();
        this.height = animSetD.getHeight();

        this.x = x;
        this.y = y;

        this.dir = 0;
        // Directions:
        // 0: None
        // 1: Left
        // 2: Up
        // 3: Right
        // 4: Down
    }

    draw(){
      switch(this.dir){
        case 1:
          ctx.drawImage(this.animSetL.getFrame(), this.x, this.y);
          break;
        case 2:
          ctx.drawImage(this.animSetU.getFrame(), this.x, this.y);
          break;
        case 3:
          ctx.drawImage(this.animSetR.getFrame(), this.x, this.y);
          break;
        case 4:
          ctx.drawImage(this.animSetD.getFrame(), this.x, this.y);
          break;
        default:
          ctx.drawImage(this.animSetDefault.getFrame(), this.x, this.y);
      }
    }

    collides_with(sprite2){
        if (this.x+parseInt(this.width/2) < sprite2.x+sprite2.width && this.x+parseInt(sprite2.width/2) > sprite2.x-sprite2.width){
            if (this.y+parseInt(this.height/2) < sprite2.y+sprite2.height && this.y+parseInt(this.height/2) > sprite2.y-sprite2.height){
                return true;
            }
        }
    }
}

class SingleRandomSkinSprite {
    constructor(imgName, numImgs, x, y, alwaysUpdate=false){
      this.image = new Image();
      this.image.src = imgName+"-"+randrange(1, numImgs+1).toString()+".png";
      
      this.x = x;
      this.y = y;
      this.alwaysUpdate = alwaysUpdate;
    }

    draw(camX, camY){
      if (camX-cDRAW_AREA < this.x && this.x < camX+cDRAW_AREA){
        if (camY-cDRAW_AREA < this.y && this.y < camY+cDRAW_AREA){
          ctx.drawImage(this.image, (this.x-camX)+(cSCREEN_WIDTH/2), (this.y-camY)+(cSCREEN_HEIGHT/2),);
        }
      }
    }
}

class Button {
  constructor(image, hoverImg, clickedImg, x, y, oneClick=true){
    this.image = image;
    this.hoverImg = hoverImg;
    this.clickedImg = clickedImg;
    this.x = x;
    this.y = y;
    this.clickedOn = false;
    this.hovering = false;
    this.oneClick = oneClick;
  }

  is_clicked(mouseX, mouseY){
      if (this.x < mouseX && this.x+this.image.naturalWidth > mouseX){
        if (this.y < mouseY && this.y+this.image.naturalHeight > mouseY){
          this.clickedOn = true;
        }
      }
  }

  is_hovering(mouseX, mouseY){
      if (this.x < mouseX && this.x+this.image.naturalWidth > mouseX){
        if (this.y < mouseY && this.y+this.image.naturalHeight > mouseY){
          this.hovering = true;
        }
      }
  }

  is_down(){
    if (this.oneClick && this.clickedOn){
      this.clickedOn = false;
      return true;
    }

    return this.clickedOn;
  }

  draw(){
    if (this.clickedOn){
      ctx.drawImage(this.clickedImg, this.x, this.y);
      } else if (this.hovering){
      ctx.drawImage(this.hoverImg, this.x, this.y);
    } else {
      ctx.drawImage(this.image, this.x, this.y);
    }
  }
}

/* Constants definitions */
const cTILE_IMAGE_NAMES = {
    "M":"mountain",
    "G":"grass",
    "B":"beach",
    "W":"water",
    "X":"exit",
    "H":"house",
    "S":"shop",
    "F":"furniture-shop",
    "C":"clothes-shop"
}

/* Other definitions */
const playerFrameSpeed = 1;
const playerRight = new AnimImgSet("./images/player/char-walk-right", 6, playerFrameSpeed);
const playerLeft = new AnimImgSet("./images/player/char-walk-left", 6, playerFrameSpeed);
const playerUp = new AnimImgSet("./images/player/char-walk-up", 4, playerFrameSpeed);
const playerDown = new AnimImgSet("./images/player/char-walk-down", 4, playerFrameSpeed);
const playerDefault = new AnimImgSet("./images/player/main-char", 1, playerFrameSpeed);

let player = new PlayerSprite(playerLeft, playerRight, playerUp, playerDown, playerDefault, 120, 160);

/* Generate map */
const cMAX_BLOCK_RADIUS = int((cMAP_WIDTH + cMAP_HEIGHT)/20);
const cMAX_NUM_BLOCKS = 250;
let r;
let contMap = [];
for (let y = 0; y < cMAP_HEIGHT; y++){
  contMap.push([]);
  for (let x = 0; x < cMAP_HEIGHT; x++){
    contMap[y].push(0);
  }
}

// add circles
for (let c = 0; c < randrange(int(cMAX_NUM_BLOCKS/2), cMAX_NUM_BLOCKS); c++){
  r = randrange(int(cMAX_BLOCK_RADIUS/2), cMAX_BLOCK_RADIUS);
  startX = randrange(0, cMAP_WIDTH-cMAX_BLOCK_RADIUS);
  startY = randrange(0, cMAP_HEIGHT-cMAX_BLOCK_RADIUS);
  for (let y = startY-r; y < startX+r; y++){
    for (let x = startX-r; x < startX+r; x++){
      if (0 < x && x < cMAP_WIDTH && 0 < y && y < cMAP_HEIGHT){
        dist = ((x-startX)**2 + (y-startY)**2)**0.5;
        if (dist < r) {
          contMap[y][x]++;
        }
      }
    }
  }
}

// blur map
blurMap = []
let sumVal;
let count;
for (let y = 0; y < cMAP_HEIGHT; y++){
  blurMap.push([]);
  for (let x = 0; x < cMAP_HEIGHT; x++){
    sumVal = 0;
    count = 0;
    for (let dy = -10; dy < 10; dy++){
      if (0 < dy+y && dy+y < cMAP_HEIGHT){
        for (let dx = -10; dx < 10; dx++){
          if (0 < dx+x && dx+x < cMAP_WIDTH){
            sumVal += contMap[dy+y][dx+x]
            count++;
          }
        }
      }
    }

    blurMap[y].push(int(sumVal/count));
  }
}

// tile map
map = [];
mapTiles = [];
let letter;
for (let y = 0; y < cMAP_HEIGHT; y++){
  map.push([]);
  for (let x = 0; x < cMAP_HEIGHT; x++){
    if (blurMap[y][x] >= 5) letter = "M";
    else if (blurMap[y][x] >= 3) letter = "G";
    else if (blurMap[y][x] >= 2) letter = "B";
    else letter = "W";
    map[y].push(letter);
    mapTiles.push(new SingleRandomSkinSprite("./images/tiles/"+cTILE_IMAGE_NAMES[letter], 3, x*cTILE_SIZE, y*cTILE_SIZE));
  }
}

// render map TODO
const colors = {
  "W":[0, 70, 222], // water
  "B":[245, 228, 206], // beach
  "G":[13, 117, 13], // grass
  "M":[219, 251, 255], // mountian
}
const mapImgData = ctx.createImageData(cMAP_WIDTH, cMAP_HEIGHT);
const data = mapImgData.data;
for (let y = 0; y < cMAP_HEIGHT; y += 2){
  for (let x = 0; x < cMAP_WIDTH; x += 2){
    const i = ((y/2) * cMAP_WIDTH + (x/2)) * 4;

    data[i + 0] = colors[map[y][x]][0]; // R
    data[i + 1] = colors[map[y][x]][1]; // G
    data[i + 2] = colors[map[y][x]][2]; // B
    data[i + 3] = 255; // A
  }
}


/* Game functionality */
let mousePos = -1;
let mouseDown = false;
let keyPress = "";
let shiftPress = false;

let cameraX = 0;
let cameraY = 0;
let moveAmount = cPLAYER_MOVE_SPEED;

let gameScene = "main";
let gamePaused = false;
let menuOpen = false;

// Get Keys
document.addEventListener("keydown", function (e){
  console.log(e.key);
  if (e.key == "Shift"){
    shiftPress = true;
  } else {
    keyPress = e.key;
  }
});

document.addEventListener("keyup", function (e){
  if (e.key == "Shift"){
    shiftPress = false;
  } else {
    keyPress = "";
  }
});

// check mouse
document.addEventListener("mousemove", function(e) { 
  mousePos.x = e.x-cvs.getBoundingClientRect().left;
  mousePos.y = e.y-cvs.getBoundingClientRect().top;
});

document.addEventListener("mousedown", function(e) { 
  mousePos.x = e.x-cvs.getBoundingClientRect().left;
  mousePos.y = e.y-cvs.getBoundingClientRect().top;
  mouseDown = true;
});

document.addEventListener("touchstart", function(e) { 
  mousePos.x = e.touches[0].pageX-cvs.getBoundingClientRect().left;
  mousePos.y = e.touches[0].pageY-cvs.getBoundingClientRect().top;
  mouseDown = true;
});

document.addEventListener("mouseup", function(e) {
  mouseDown = false;
});

document.addEventListener("touchend", function(e) { 
  mouseDown = false;
});

function draw(){
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 288, 320);

  if (gamePaused){
    if (menuOpen){
      if (keyPress == "Escape"){
        keyPress = "";
        gamePaused = false;
        menuOpen = false;
      }
      ctx.putImageData(mapImgData, 0, 0);
    }
  } else {
    if (gameScene == "main"){
      for (let i = 0; i < mapTiles.length; i++){
        mapTiles[i].draw(cameraX, cameraY);
      }
    
      player.draw();
    
      /* Update */
      // Movement
      if (shiftPress){
        moveAmount = cPLAYER_MOVE_SPEED*2;
      } else {
        moveAmount = cPLAYER_MOVE_SPEED;
      }
      if (keyPress == "ArrowLeft"){
        // move left
        cameraX -= moveAmount;
        player.dir = 1;
      } else if (keyPress == "ArrowRight"){
        // move right
        cameraX += moveAmount;
        player.dir = 3;
      } else if (keyPress == "ArrowUp"){
        // move up
        cameraY -= moveAmount;
        player.dir = 2;
      } else if (keyPress == "ArrowDown"){
        // move down
        cameraY += moveAmount;
        player.dir = 4;
      } else if (keyPress == ""){
        player.dir = 0;
      }
    
      // Map
      if (keyPress == "Escape"){
        keyPress = "";
        gamePaused = true;
        menuOpen = true;
      }
    }
  }

  ctx.fillStyle = "#EEF";
  ctx.fillRect(0, 320, 288, 130);
}

let game = setInterval(draw, 100);