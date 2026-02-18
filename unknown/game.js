/* Getting the Canvas */
const cvs = document.getElementById("game");
const ctx = cvs.getContext("2d");

const cBASE_IMG_DIR = "images/"
const cSCREEN_WIDTH = 1600;
const cSCREEN_HEIGHT = 1200;

// const cTEXT_BOX_HEIGHT = 200;
// const cTEXT_START_X = 50;
// const cTEXT_START_Y = 50;
// const cCHARS_IN_LINE = 20;
// const cCHAR_SIZE = 50;
const cNAV_BTN_Y = cSCREEN_HEIGHT-(cSCREEN_HEIGHT*0.1);
const cNAV_BTN_SPACING = cSCREEN_WIDTH*0.02;
const cNAV_BTN_HEIGHT = cSCREEN_HEIGHT*0.05;
const cNAV_BTN_WIDTH = cSCREEN_WIDTH*0.225;
const cTEXT_BUBBLE_SIZE = cSCREEN_HEIGHT*0.07

// Resize stuff on window resize
function resizeCanvas() {
  const maxWidth = window.innerWidth * 0.8;
  const maxHeight = window.innerHeight * 0.8;

  let width = maxWidth;
  let height = width * (3/4);

  if (height > maxHeight) {
    height = maxHeight;
    width = height * (4/3);
  }

  cvs.style.width = width + "px";
  cvs.style.height = height + "px";
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);



/* Helper functions */
function randrange(minNum, maxNum){
  return Math.floor(Math.random() * (maxNum-minNum)) + minNum;
}

function int(floatVal){
  return Math.floor(floatVal);
}

function getRandomNPCType(){
    val = Math.random();
    if (val < 0.1){
        return "bh";
    } else if (val < 0.3){
        return "mnem";
    } else if (val < 0.5){
        return "kish";
    } else if (val < 0.7){
        return "mu";
    } else if (val < 0.9){
        return "plu";
    } else {
        return "osv";
    }
}

function getRandomTaskType(){
    val = Math.random();
    if (val < 0.3) {
        return "package delivery";
    } else if (val < 0.6) {
        return "letter delivery";
    } else {
        return "transportation ticket";
    }
}

/* Class definitions */
class Sprite {
  constructor(imgName, numImgs, framesPerUpdate, x, y, w, h) {
    this.imgFrames = [];
    this.currFrame = randrange(0, numImgs);
    this.numFrames = numImgs;
    this.framesSinceUpdate = 0;
    this.framesPerUpdate = framesPerUpdate;

    let tempImg;
    for (let i=1; i<=numImgs; i++){
      tempImg = new Image();
      tempImg.src = cBASE_IMG_DIR+imgName+"-"+i.toString()+".png";
      this.imgFrames.push(tempImg);
    }

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw(){
    if (this.numFrames != 1){
      this.framesSinceUpdate++;
      if (this.framesSinceUpdate >= this.framesPerUpdate){
        this.framesSinceUpdate = 0;
        this.currFrame++;
        if (this.currFrame >= this.numFrames) this.currFrame = 0;
      }
    }
    ctx.drawImage(this.imgFrames[this.currFrame], this.x, this.y, this.w, this.h);
  }

  collides_with(sprite2){
      if (this.x+parseInt(this.w/2) < sprite2.x+sprite2.w && this.x+parseInt(sprite2.w/2) > sprite2.x-sprite2.w){
          if (this.y+parseInt(this.h/2) < sprite2.y+sprite2.h && this.y+parseInt(this.h/2) > sprite2.y-sprite2.h){
              return true;
          }
      }
  }
}

class TextSpeechBubble {
  constructor(backgroundColor, textColor, text, x, y, h, maxWidth, charsPerFrame=3){
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
    this.text = text;
    this.textWords = text.split(" ");
    this.x = x;
    this.y = y;
    this.h = h;
    this.maxWidth = maxWidth;

    this.currentText = [""];
    this.charsPerFrame = charsPerFrame;
    this.frames = 0;
    this.lineIdx = 0;
    this.wordIdx = 0;
    this.currIdx = 0;
    this.padding = this.h*0.2;
    this.fontSize = parseInt(this.h-this.padding);
  }

  draw(){
    if (this.currIdx < this.text.length){
      if (this.text.slice(this.currIdx, this.currIdx+this.charsPerFrame).includes(" ")){
        this.wordIdx++;
      }
      this.currentText[this.lineIdx] += this.text.slice(this.currIdx, this.currIdx+this.charsPerFrame);
      this.currIdx += this.charsPerFrame;
    }

    ctx.font = this.fontSize.toString()+"px sans-serif";
    let textWidth = ctx.measureText(this.currentText[this.lineIdx]).width;
    let speechBubbleWidth = textWidth+(this.padding*2);

    if (ctx.measureText(this.currentText[this.lineIdx]+this.textWords[this.wordIdx]).width > this.maxWidth-this.h){
      // wrap
      this.currentText.push("");
      this.lineIdx++;
    }

    ctx.strokeStyle = this.backgroundColor;
    ctx.fillStyle = this.backgroundColor;
    ctx.beginPath();
    if (this.lineIdx == 0) {
      ctx.roundRect(this.x, this.y, speechBubbleWidth, this.h*(this.lineIdx+1), [this.h/2]);
    } else {
      ctx.roundRect(this.x, this.y, this.maxWidth, this.h*(this.lineIdx+1), [this.h/2]);
    }
    ctx.stroke();
    ctx.fill();
    
    ctx.fillStyle = this.textColor;
    for (let i=0; i <= this.lineIdx; i++){
      ctx.fillText(this.currentText[i], this.x+((speechBubbleWidth-textWidth)/2), this.y+(this.fontSize*(i+1)));
    }

    this.frames++;
  }
}

class Button {
  constructor(defaultColor, hoverColor, clickedColor, textColor, text, x, y, w, h, oneClick=true){
    this.defaultColor = defaultColor;
    this.hoverColor = hoverColor;
    this.clickedColor = clickedColor;
    this.textColor = textColor;
    this.text = text;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.clickedOn = false;
    this.hovering = false;
    this.oneClick = oneClick;

    this.padding = this.w*0.02;
  }

  is_clicked(mouseX, mouseY){
    if (this.x < mouseX && this.x+this.w > mouseX){
      if (this.y < mouseY && this.y+this.h > mouseY){
        this.clickedOn = true;
        return true;
      }
    }
    this.clickedOn = false;
    return false;
  }

  mouse_up(){
    if (this.clickedOn){
      this.clickedOn = false;
    }
  }

  is_hovering(mouseX, mouseY){
    if (this.x < mouseX && this.x+this.w > mouseX){
      if (this.y < mouseY && this.y+this.h > mouseY){
        this.hovering = true;
        return true;
      }
    }
    this.hovering = false;
    return false;
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
      ctx.strokeStyle = this.clickedColor;
      ctx.fillStyle = this.clickedColor;
    } else if (this.hovering){
      ctx.strokeStyle = this.hoverColor;
      ctx.fillStyle = this.hoverColor;
    } else {
      ctx.strokeStyle = this.defaultColor;
      ctx.fillStyle = this.defaultColor;
    }
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.w, this.h, [this.h/2]);
    ctx.stroke();
    ctx.fill();

    let maxHeight = this.h-(this.padding*2);
    let maxWidth = this.w-(this.padding*2);

    ctx.font = maxHeight.toString()+"px sans-serif";
    let textWidth = ctx.measureText(this.text).width;
    let scalar = maxWidth/textWidth;
    let fontSize = scalar*maxHeight;
    if (fontSize > maxHeight){
      fontSize = maxHeight;
    }
    
    ctx.font = fontSize.toString()+"px sans-serif";
    textWidth = ctx.measureText(this.text).width;
    ctx.fillStyle = this.textColor;
    ctx.fillText(this.text, this.x+((this.w-textWidth)/2), this.y+fontSize, this.w);
  }
}

// Preset stuff
// const bhMessages = {
//     "hello":"present, enclose-left, good, you, enclose-right",
//     "thank you":"present, enclose-left, good, you, enclose-right",
//     "goodbye":"future, enclose-left, good, you, enclose-right",
//     "package delivery":"present, enclose-left, want, big, thing, move, enclose-right",
//     "letter delivery":"present, enclose-left, want, small, thing, move, enclose-right",
//     "transportation ticket":"present, enclose-left, want, me, move, [], enclose-right",
// }

// const osvMessages = {
//     "hello":"hello",
//     "thank you":"thanks",
//     "goodbye":"hello",
//     "package delivery":"you, big, object, move, question",
//     "letter delivery":"you, paper, move, question",
//     "transportation ticket":""
// }

// const muMessages = {
//   "package delivery":"thanks, move, object",
//   "letter delivery":"move, paper, object",
//   "transportation ticket":"you, give, me, move, paper, thanks"
// }

// const pluMessages = {
//   "package delivery":"me, want, you, move, object",
//   "letter delivery":"me, want, you, move, paper",
//   "transportation ticket":"me, want, move, paper"
// }

// Images


/* Game functionality */
let mousePos = {
    x:-1,
    y:-1
};
let mouseDown = false;
let keyPress = "";
let shiftPress = false;

let scene = "";


// Task generation
let npclanguageType = "";
let npcMood = "";
let npcVariation = 0;
let taskType = "";
let taskHandlingType = "";
let message = "";//osvMessages["package delivery"];

// buttons
let all_buttons = [];

let notebook = new Button("#ffd182", "#ffbe56", "#b76e00", "#000", "Notebook", cNAV_BTN_SPACING, cNAV_BTN_Y, cNAV_BTN_WIDTH, cNAV_BTN_HEIGHT);
all_buttons.push(notebook);
let mainAreaBtn = new Button("#8de390", "#3ad63a", "#008a05", "#000", "Main Area", (cNAV_BTN_SPACING*2)+(cNAV_BTN_WIDTH), cNAV_BTN_Y, cNAV_BTN_WIDTH, cNAV_BTN_HEIGHT);
all_buttons.push(mainAreaBtn);
let deliverySortingBtn = new Button("#82aeff", "#569dff", "#004aba", "#000", "Delivery Sorting", (cNAV_BTN_SPACING*3)+(cNAV_BTN_WIDTH*2), cNAV_BTN_Y, cNAV_BTN_WIDTH, cNAV_BTN_HEIGHT);
all_buttons.push(deliverySortingBtn);
let catalogBtn = new Button("#ff82ff", "#e660db", "#9e00ba", "#000", "Cat-a-log", (cNAV_BTN_SPACING*4)+(cNAV_BTN_WIDTH*3), cNAV_BTN_Y, cNAV_BTN_WIDTH, cNAV_BTN_HEIGHT);
all_buttons.push(catalogBtn);

// sprites
let all_sprites = [];

temp = new Sprite("guy", 1, 1, cSCREEN_WIDTH-750, cNAV_BTN_Y-750, 750, 750);
all_sprites.push(temp);

// text bubble
textBubble = new TextSpeechBubble("#FFF", "#000", "Ello whats up how are you doing? Can I help ya out? Is this text too long? Idk weebooweebooweebooweebooweeboo", 50, 50, cTEXT_BUBBLE_SIZE, cSCREEN_WIDTH-100, 2);
all_sprites.push(textBubble);

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
  xScale = cvs.width/cvs.getBoundingClientRect().width;
  yScale = cvs.height/cvs.getBoundingClientRect().height;
  mousePos.x = (e.x-cvs.getBoundingClientRect().left) * xScale;
  mousePos.y = (e.y-cvs.getBoundingClientRect().top) * yScale;

  all_buttons.forEach((item) => {
    item.is_hovering(mousePos.x, mousePos.y);
  });
});

document.addEventListener("mousedown", function(e) { 
  xScale = cvs.width/cvs.getBoundingClientRect().width;
  yScale = cvs.height/cvs.getBoundingClientRect().height;
  mousePos.x = (e.x-cvs.getBoundingClientRect().left) * xScale;
  mousePos.y = (e.y-cvs.getBoundingClientRect().top) * yScale;

  mouseDown = true;
  all_buttons.forEach((item) => {
    item.is_clicked(mousePos.x, mousePos.y);
  });
});

document.addEventListener("touchstart", function(e) { 
  xScale = cvs.width/cvs.getBoundingClientRect().width;
  yScale = cvs.height/cvs.getBoundingClientRect().height;
  mousePos.x = (e.x-cvs.getBoundingClientRect().left) * xScale;
  mousePos.y = (e.y-cvs.getBoundingClientRect().top) * yScale;
  
  mouseDown = true;
  all_buttons.forEach((item) => {
    item.is_clicked(mousePos.x, mousePos.y);
  });
});

document.addEventListener("mouseup", function(e) {
  mouseDown = false;
  all_buttons.forEach((item) => {
    item.mouse_up();
  });
});

document.addEventListener("touchend", function(e) { 
  mouseDown = false;
  all_buttons.forEach((item) => {
    item.mouse_up();
  });
});



function draw(){
    ctx.fillStyle = "#1c1c32";
    ctx.fillRect(0, 0, cSCREEN_WIDTH, cSCREEN_HEIGHT);
    // ctx.fillStyle = "#dedee7";
    // ctx.fillRect(0, 0, cSCREEN_WIDTH, cTEXT_BOX_HEIGHT);
    
    // let i = 0;
    // if (npcType === ""){
    //     // new npc
    //     npcType = getRandomNPCType();
    //     taskType = getRandomTaskType();
    // }
    // for (const word of message.split(", ")) {
    //     if (word === "[]") {
            
    //     } else {
    //         const img = new Image();
    //         img.src = "./images/languages/"+languagePrefix+"-"+word+".png";
    //         ctx.drawImage(img, cTEXT_START_X+((i%cCHARS_IN_LINE)*cCHAR_SIZE), cTEXT_START_Y+(int(i/cCHARS_IN_LINE)*cCHAR_SIZE), cCHAR_SIZE, cCHAR_SIZE);
    //     }
    //     i++;
    // }

    all_buttons.forEach((item) => {
      item.draw();
    });
    
    all_sprites.forEach((item) => {
      item.draw();
    })
}

let game = setInterval(draw, 100);