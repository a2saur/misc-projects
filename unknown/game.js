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
const cNAV_HEIGHT = cSCREEN_HEIGHT*0.1;
const cNAV_BTN_HEIGHT = cSCREEN_HEIGHT*0.05;
const cNAV_BTN_Y = (cSCREEN_HEIGHT-cNAV_HEIGHT)+((cNAV_HEIGHT-cNAV_BTN_HEIGHT)/2);
const cNAV_BTN_SPACING = cSCREEN_WIDTH*0.02;
const cNAV_BTN_WIDTH = cSCREEN_WIDTH*0.225;
const cTEXT_BUBBLE_SIZE = cSCREEN_HEIGHT*0.07;

const cDESK_HEIGHT = cSCREEN_HEIGHT*0.15;
const cDESK_Y_START = cSCREEN_HEIGHT-cDESK_HEIGHT-cNAV_HEIGHT;
const cCUST_SIZE = 700;
const cCUST_X_START = 50;
const cCUST_Y_START = cSCREEN_HEIGHT-cNAV_HEIGHT-cCUST_SIZE-(cDESK_HEIGHT/2);

const cNPC_TYPES = ["mnem", "plu", "mu", "osv", "eng", "kish"];
const cTASK_TYPES = ["package delivery", "letter delivery", "transportation ticket"];
const cNPC_MOODS = ["default", "grumpy", "chatty"];
const cTASK_HANDLING_TYPES = ["default", "default", "default", "error"];

const cPROFILE_Y_START = cCUST_Y_START*1.1;
const cPROFILE_WIDTH = (cSCREEN_WIDTH-cCUST_SIZE)-((cSCREEN_WIDTH-cCUST_SIZE)/4);
const cPROFILE_HEIGHT = cSCREEN_HEIGHT-cPROFILE_Y_START-cNAV_HEIGHT-(cDESK_HEIGHT/2);
const cPROFILE_PADDING = 25;

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

function getRandomChoice(arr){
  return arr[randrange(0, arr.length)];
}

function getRandomNPCName() {
  let vowel = (randrange(0, 2) == 0);
  let nameLen = randrange(3, 10);
  let npcName = "";
  for (let i=0; i < nameLen; i++){
    if (vowel){
      npcName += getRandomChoice(["a", "e", "i", "o", "u", "y"]);
    } else {
      npcName += getRandomChoice(["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"])
    }

    vowel = !vowel;
  }

  return npcName;
}

function getRandomNPCGlyphName(glyphs) {
  let nameLen = randrange(1, 5);
  let npcName = "";
  npcName += getRandomChoice(glyphs);
  npcName += " ";
  
  let newGlyph = "";
  let prevGlyph = "";
  for (let i=0; i < nameLen; i++){
    while (newGlyph == prevGlyph){
      newGlyph = getRandomChoice(glyphs);
    }
    npcName += newGlyph;
    npcName += " ";
    prevGlyph = newGlyph;
  }
  return npcName;
}


/* Class definitions */
class Sprite {
  constructor(imgName, numImgs, framesPerUpdate, x, y, w, h, showing=true, activeScene="") {
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
    this.showing = showing;
    this.activeScene = activeScene;
  }

  draw(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
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
    }
  }

  collides_with(sprite2){
      if (this.x+parseInt(this.w/2) < sprite2.x+sprite2.w && this.x+parseInt(sprite2.w/2) > sprite2.x-sprite2.w){
          if (this.y+parseInt(this.h/2) < sprite2.y+sprite2.h && this.y+parseInt(this.h/2) > sprite2.y-sprite2.h){
              return true;
          }
      }
  }

  show(){
    this.showing = true;
  }

  hide(){
    this.showing = false;
  }
}

class TextSpeechBubble {
  constructor(backgroundColor, textColor, text, x, y, h, maxWidth, framesPerChar=3){
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
    this.text = text;
    this.textWords = text.split(" ");
    this.x = x;
    this.y = y;
    this.h = h;
    this.maxWidth = maxWidth;

    this.running = false;
    this.currentText = [""];
    this.framesPerChar = framesPerChar;
    this.frames = 0;
    this.lineIdx = 0;
    this.wordIdx = 0;
    this.currIdx = 0;
    this.padding = this.h*0.2;
    this.fontSize = parseInt(this.h-this.padding);
  }

  startRunning(){
    this.running = true;
  }

  isDone(){
    return (!this.running) && this.currentText[0] != "";
  }

  checkNewLine(){
    ctx.font = this.fontSize.toString()+"px sans-serif";
    let textWidth = ctx.measureText(this.currentText[this.lineIdx]+this.textWords[this.wordIdx]).width;

    if (textWidth > this.maxWidth){
      // new line
      this.currentText.push("");
      this.lineIdx++;
    }
  }

  skip(){
    for (let i = this.currIdx; i < this.text.length; i++){
      this.checkNewLine();
      this.currentText[this.lineIdx] += this.text[i];
    }
    this.running = false;
  }

  draw(){
    if (this.running || this.currentText[0] != ""){
      if (this.running) {
        if (this.frames % this.framesPerChar == 0){
          if (this.currIdx < this.text.length){
            if (this.text[this.currIdx] == " "){
              this.wordIdx++;
            }
            this.currentText[this.lineIdx] += this.text[this.currIdx];
            this.currIdx++;
          } else {
            this.running = false;
          }
        }
      }

      ctx.font = this.fontSize.toString()+"px sans-serif";
      let textWidth = ctx.measureText(this.currentText[this.lineIdx]).width;
      let speechBubbleWidth = textWidth+(this.padding*2);
      this.checkNewLine();

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
}

class MultiTextSpeechBubble {
  constructor(backgroundColor, textColor, texts, startX, startY, h, maxWidth, activeScene="", framesPerChar=3){
    this.textBubbles = [];
    
    this.currX = startX;
    this.currY = startY;
    this.currTextBubble = 0;

    let textBubble;
    for (let i = 0; i < texts.length; i++){
      textBubble = new TextSpeechBubble(backgroundColor, textColor, texts[i], this.currX, this.currY, h, maxWidth, framesPerChar);
      this.textBubbles.push(textBubble);
    }

    this.padding = h/4;

    this.activeScene = activeScene;
    this.started = false;
    this.finished = false;
  }
  
  startRunning(){
    this.started = true;
    this.finished = false;
    this.textBubbles[this.currTextBubble].startRunning();
  }

  skip(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.started && !this.finished){
        this.textBubbles[this.currTextBubble].skip();
        if (this.textBubbles[this.currTextBubble].isDone()){
          // update next text bubble position
          let txtBbl = this.textBubbles[this.currTextBubble];
          this.currY = txtBbl.y+(txtBbl.h*(txtBbl.lineIdx+1))+this.padding;
          
          // start next one
          this.currTextBubble++;
          if (this.currTextBubble >= this.textBubbles.length){
            // done!
            this.finished = true;
          } else {
            this.textBubbles[this.currTextBubble].y = this.currY
            this.textBubbles[this.currTextBubble].startRunning();
          }
        }
      }
    }
  }

  draw(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.started){
        for (let i = 0; i < this.textBubbles.length; i++){
          this.textBubbles[i].draw();
        }

        if (!this.finished){
          if (this.textBubbles[this.currTextBubble].isDone()){
            // update next text bubble position
            let txtBbl = this.textBubbles[this.currTextBubble];
            this.currY = txtBbl.y+(txtBbl.h*(txtBbl.lineIdx+1))+this.padding;
            
            // start next one
            this.currTextBubble++;
            if (this.currTextBubble >= this.textBubbles.length){
              // done!
              this.finished = true;
            } else {
              this.textBubbles[this.currTextBubble].y = this.currY
              this.textBubbles[this.currTextBubble].startRunning();
            }
          }
        }
      }
    }
  }
}

class Button {
  constructor(defaultColor, hoverColor, clickedColor, textColor, text, x, y, w, h, identifier, oneClick=true){
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
    this.identifier = identifier;
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

class AnimatedTextBox {
  constructor(backgroundColor, textColor, text, x, y, w, h, fontSize, animType="from-bottom", activeScene="", writeTxtOnAnimDone=true, framesPerChar=3, maxMoveAmount=-1){
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
    this.text = text;
    this.textWords = text.split(" ");
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;

    this.currX = x;
    this.currY = y;

    this.writeTxtOnAnimDone = writeTxtOnAnimDone;
    this.animRunning = false;
    this.finishedAnim = false;
    this.txtRunning = false;
    this.currentText = [""];
    this.framesPerChar = framesPerChar;
    this.frames = 0;
    this.lineIdx = 0;
    this.wordIdx = 0;
    this.currIdx = 0;
    this.padding = this.w*0.05;
    this.fontSize = fontSize;
    this.activeScene = activeScene;
    this.animType = animType;

    if (this.animType == "from-bottom"){
      this.currY = cSCREEN_HEIGHT;
    }


    if (maxMoveAmount == -1){
      this.maxMoveAmount = Math.abs((this.y-this.currY)+(this.x-this.currX))/15;
    } else {
      this.maxMoveAmount = maxMoveAmount;
    }
  }

  startRunning(){
    this.animRunning = true;
    this.finishedAnim = false;
  }

  checkNewLine(){
    ctx.font = this.fontSize.toString()+"px sans-serif";
    let textWidth = ctx.measureText(this.currentText[this.lineIdx]+this.textWords[this.wordIdx]).width;

    if (textWidth > this.maxWidth){
      // new line
      this.currentText.push("");
      this.lineIdx++;
    }
  }

  skip(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.txtRunning){
        for (let i = this.currIdx; i < this.text.length; i++){
          this.checkNewLine();
          this.currentText[this.lineIdx] += this.text[i];
        }
        this.txtRunning = false;
      }
    }
  }

  finishAnim(){
    this.animRunning = false;
    this.finishedAnim = true;

    if (this.writeTxtOnAnimDone){
      this.txtRunning = true;
    } else {
      this.skip(this.activeScene);
    }
  }

  drawTxt(){
    if (this.txtRunning || this.currentText[0] != ""){
      if (this.txtRunning) {
        if (this.frames % this.framesPerChar == 0){
          if (this.currIdx < this.text.length){
            if (this.text[this.currIdx] == " "){
              this.wordIdx++;
            }
            this.currentText[this.lineIdx] += this.text[this.currIdx];
            this.currIdx++;
          } else {
            this.txtRunning = false;
          }
        }
      }

      ctx.font = this.fontSize.toString()+"px sans-serif";
      this.checkNewLine();

      ctx.fillStyle = this.textColor;
      for (let i=0; i <= this.lineIdx; i++){
        ctx.fillText(this.currentText[i], this.x+this.padding, this.y+this.padding+(this.fontSize*(i+1)));
      }
    }
  }

  draw(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.animRunning || this.finishedAnim){
        ctx.strokeStyle = this.backgroundColor;
        ctx.fillStyle = this.backgroundColor;
        ctx.beginPath();
        if (this.animRunning){
          // update animation
          if (this.animType == "from-bottom"){
            let newY = (this.currY+this.y)/2;
            if (Math.abs(this.currY-newY) > this.maxMoveAmount){
              this.currY = this.currY-(this.maxMoveAmount*Math.sign(this.currY-newY));
            } else {
              this.currY = newY;
            }

            if (Math.abs(this.currY-this.y) < 15){
              this.currY = this.y;
              
              // done
              this.finishAnim();
            }
          }
          ctx.fillRect(this.currX, this.currY, this.w, this.h);
        } else {
          ctx.fillRect(this.x, this.y, this.w, this.h);
        }
        ctx.stroke();
        ctx.fill();
  
        this.drawTxt();
        this.frames++;
      }
    }
  }
}

// Preset stuff


/* Game functionality */
let mousePos = {
    x:-1,
    y:-1
};
let mouseDown = false;
let keyPress = "";
let shiftPress = false;

let scene = "main"; // main, handbook, delivery, cat

// Task generation
let npcType = "";
let npcName = "";
let npcMood = "";
let npcVariation = 0;
let taskType = "";
let taskHandlingType = "";
let message = "";

// buttons
let all_buttons = [];

let notebook = new Button("#ffd182", "#ffbe56", "#b76e00", "#000", "Handbook", cNAV_BTN_SPACING, cNAV_BTN_Y, cNAV_BTN_WIDTH, cNAV_BTN_HEIGHT, "nav-handbook");
all_buttons.push(notebook);
let mainAreaBtn = new Button("#8de390", "#3ad63a", "#008a05", "#000", "Main Area", (cNAV_BTN_SPACING*2)+(cNAV_BTN_WIDTH), cNAV_BTN_Y, cNAV_BTN_WIDTH, cNAV_BTN_HEIGHT, "nav-main");
all_buttons.push(mainAreaBtn);
let deliverySortingBtn = new Button("#82aeff", "#569dff", "#004aba", "#000", "Delivery Sorting", (cNAV_BTN_SPACING*3)+(cNAV_BTN_WIDTH*2), cNAV_BTN_Y, cNAV_BTN_WIDTH, cNAV_BTN_HEIGHT, "nav-delivery");
all_buttons.push(deliverySortingBtn);
let catalogBtn = new Button("#ff82ff", "#e660db", "#9e00ba", "#000", "Cat-a-log", (cNAV_BTN_SPACING*4)+(cNAV_BTN_WIDTH*3), cNAV_BTN_Y, cNAV_BTN_WIDTH, cNAV_BTN_HEIGHT, "nav-cat");
all_buttons.push(catalogBtn);

// sprites
let all_sprites = [];

let guy = new Sprite("guy", 1, 1, cSCREEN_WIDTH-750, cCUST_Y_START, 750, 750, true, "cat");
all_sprites.push(guy);

// customer sprites
let kish_sprites = [];
let kish1 = new Sprite("kishik/kishik", 12, 7, cCUST_X_START, cCUST_Y_START, cCUST_SIZE, cCUST_SIZE, false, "main");
all_sprites.push(kish1);
kish_sprites.push(kish1);

let mu_sprites = [];
let mu1 = new Sprite("muglyph/muglyph", 11, 5, cCUST_X_START, cCUST_Y_START, cCUST_SIZE, cCUST_SIZE, false, "main");
all_sprites.push(mu1);
mu_sprites.push(mu1);

let plu_sprites = [];
let plu1 = new Sprite("pluglyph/pluglyph", 18, 6, cCUST_X_START, cCUST_Y_START, cCUST_SIZE, cCUST_SIZE, false, "main");
all_sprites.push(plu1);
plu_sprites.push(plu1);

let mnem_sprites = [];
let mnem1 = new Sprite("guy", 1, 1, cCUST_X_START, cCUST_Y_START, cCUST_SIZE, cCUST_SIZE, false, "main");
all_sprites.push(mnem1);
mnem_sprites.push(mnem1);

let osv_sprites = [];
let osv1 = new Sprite("guy", 1, 1, cCUST_X_START, cCUST_Y_START, cCUST_SIZE, cCUST_SIZE, false, "main");
all_sprites.push(osv1);
osv_sprites.push(osv1);

let eng_sprites = [];
let eng1 = new Sprite("guy", 1, 1, cCUST_X_START, cCUST_Y_START, cCUST_SIZE, cCUST_SIZE, false, "main");
all_sprites.push(eng1);
eng_sprites.push(eng1);

let npc_sprite_opts = {};
npc_sprite_opts["kish"] = kish_sprites;
npc_sprite_opts["mu"] = mu_sprites;
npc_sprite_opts["plu"] = plu_sprites;
npc_sprite_opts["mnem"] = mnem_sprites;
npc_sprite_opts["osv"] = osv_sprites;
npc_sprite_opts["eng"] = eng_sprites;

let npcVocab = {}
npcVocab["kish"] = [""];
npcVocab["mu"] = [""];
npcVocab["plu"] = ["address", "big", "hello", "how", "me", "move", "not", "object", "paper", "person", "small", "thanks", "want", "what", "when", "where", "who", "why", "you"];
npcVocab["mnem"] = ["address", "big", "friend", "hello", "how", "like", "me", "move", "not", "object", "paper", "person", "small", "thanks", "want", "what", "when", "where", "who", "why", "you"];
npcVocab["osv"] = ["address", "big", "friend", "hello", "how", "like", "me", "move", "not", "object", "paper", "person", "small", "thanks", "want", "what", "when", "where", "who", "why", "you"];
npcVocab["eng"] = [""];

let glyphNPCs = ["mu", "plu", "osv"];

// text bubbles
let all_skippable = [];
let all_popups = [];
// textBubble = new TextSpeechBubble("#FFF", "#000", "Ello whats up how are you doing? Can I help ya out? Is this text too long? Idk :3 OwO :O", 50, 50, cTEXT_BUBBLE_SIZE, cSCREEN_WIDTH-100, 2);
let textBubble = new MultiTextSpeechBubble("#FFF", "#000", ["Ello whats up how are you doing? Can I help ya out? Is this text too long? Idk"], 50, 50, cTEXT_BUBBLE_SIZE, cSCREEN_WIDTH-100, "main", 2);
all_skippable.push(textBubble);
all_popups.push(textBubble);
textBubble.startRunning();

let profileInfoBox = new AnimatedTextBox("#78f6ff", "#000", "AAAA", cSCREEN_WIDTH-cPROFILE_WIDTH-cPROFILE_PADDING, cPROFILE_Y_START+cPROFILE_PADDING, cPROFILE_WIDTH-cPROFILE_PADDING, cPROFILE_HEIGHT+cPROFILE_PADDING, 50, "from-bottom", "main", true, 5)
all_skippable.push(profileInfoBox);
all_popups.push(profileInfoBox);
profileInfoBox.startRunning();


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
    if (item.is_clicked(mousePos.x, mousePos.y)){
      // check if nav change
      if (item.identifier == "nav-handbook") scene = "handbook";
      if (item.identifier == "nav-main") scene = "main";
      if (item.identifier == "nav-delivery") scene = "delivery";
      if (item.identifier == "nav-cat") scene = "cat";
    }
  });
  all_skippable.forEach((item) => {
    item.skip(scene);
  });
});

document.addEventListener("touchstart", function(e) { 
  xScale = cvs.width/cvs.getBoundingClientRect().width;
  yScale = cvs.height/cvs.getBoundingClientRect().height;
  mousePos.x = (e.x-cvs.getBoundingClientRect().left) * xScale;
  mousePos.y = (e.y-cvs.getBoundingClientRect().top) * yScale;
  
  mouseDown = true;
  all_buttons.forEach((item) => {
    if (item.is_clicked(mousePos.x, mousePos.y)){
      // check if nav change
      if (item.identifier == "nav-handbook") scene = "handbook";
      if (item.identifier == "nav-main") scene = "main";
      if (item.identifier == "nav-delivery") scene = "delivery";
      if (item.identifier == "nav-cat") scene = "cat";
    }
  });
  all_skippable.forEach((item) => {
    item.skip(scene);
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
    
    all_sprites.forEach((item) => {
      item.draw(scene);
    })


    // updates
    if (scene == "main"){
      ctx.fillStyle = "#817c7a";
      ctx.fillRect(0, cDESK_Y_START, cSCREEN_WIDTH, cDESK_HEIGHT);
      
      // ctx.fillStyle = "#78f6ff";
      // ctx.fillRect(cSCREEN_WIDTH-cPROFILE_WIDTH-cPROFILE_PADDING, cPROFILE_Y_START+cPROFILE_PADDING, cPROFILE_WIDTH-cPROFILE_PADDING, cPROFILE_HEIGHT+cPROFILE_PADDING);

      // check if new customer
      if (npcType == ""){
        // new customer!
        npcType = getRandomChoice(cNPC_TYPES);
        if (glyphNPCs.includes(npcType)){
          npcName = getRandomNPCGlyphName(npcVocab[npcType]);
        } else {
          npcName = getRandomNPCName();
        }

        npcName = getRandomNPCName()
        npcMood = getRandomChoice(cNPC_MOODS);
        
        taskType = getRandomChoice(cTASK_TYPES);
        taskHandlingType = getRandomChoice(cTASK_HANDLING_TYPES);

        npcVariation = randrange(0, npc_sprite_opts[npcType].length);

        npc_sprite_opts[npcType][npcVariation].show();
      }
    }

    all_popups.forEach((item) => {
      item.draw(scene);
    })

    // nav bar
    ctx.fillStyle = "#515151";
    ctx.fillRect(0, cSCREEN_HEIGHT-cNAV_HEIGHT, cSCREEN_WIDTH, cNAV_HEIGHT);

    all_buttons.forEach((item) => {
      item.draw();
    });
}

let game = setInterval(draw, 20);