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

const cNPC_TYPES = ["mu", "plu", "osv", "eng", "kish", "mnem"];
const cTASK_TYPES = ["package delivery", "letter delivery", "transportation ticket"];
const cNPC_MOODS = ["default", "grumpy", "chatty"];
const cTASK_HANDLING_TYPES = ["", "", "", " error"];

const cPROFILE_Y_START = cCUST_Y_START*1.1;
const cPROFILE_WIDTH = (cSCREEN_WIDTH-cCUST_SIZE)-((cSCREEN_WIDTH-cCUST_SIZE)/4);
const cPROFILE_HEIGHT = cSCREEN_HEIGHT-cPROFILE_Y_START-cNAV_HEIGHT-(cDESK_HEIGHT/2);
const cPROFILE_PADDING = 25;

const cGLYPH_HEIGHT = 100;
const cGLYPH_BOOK_HEIGHT = 75;
const cBOOK_PADDING = 25;

const cPAGE_HEIGHT = (cSCREEN_HEIGHT-cNAV_HEIGHT)-100;
const cPAGE_WIDTH = (cSCREEN_WIDTH-100)/2;
const cPAGE_X_START = 50;
const cPAGE_Y_START = 50;
const cPAGE_BTN_SIZE = 100;

const cDELIVERY_X_START = 200;
const cDELIVERY_Y_START = 250;
const cDELIVERY_SIZE = 350;
const cDELIVERY_X_SPACING = 400;
const cDELIVERY_Y_SPACING = 400;

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

function getRandomDestination(languageType){
  if (languageType == "kish"){
    return getRandomChoice(["nurand", "kiskus", "mnemonide", "mukry", "brukro", "iknus"]);
  } else if (languageType == "mnem"){
    return getRandomChoice(["n*l*nt", "k*sk*s", "mn*m*n*t", "m*kl*", "pl*kl*", "*kn*s"])
  } else {
    return getRandomChoice(["nuland", "kiskus", "mnemonite", "mugly", "pluglo", "ignus"]);
  }
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

console.log("Defining classes");
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

class ClickableSprite {
  constructor(imgName, x, y, w, h, oneClick=true, showing=true, activeScene="", identifier="") {
    this.defaultImg = new Image();
    this.defaultImg.src = cBASE_IMG_DIR+imgName+"-default.png";
    
    this.hoveringImg = new Image();
    this.hoveringImg.src = cBASE_IMG_DIR+imgName+"-hovering.png";
    
    this.clickedImg = new Image();
    this.clickedImg.src = cBASE_IMG_DIR+imgName+"-clicked.png";

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.showing = showing;
    this.activeScene = activeScene;
    this.hovering = false;
    this.clickedOn = false;
    this.identifier = identifier;
    this.oneClick = oneClick;
  }

  is_hovering(mouseX, mouseY, sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
        if (mouseX > this.x && mouseX < this.x+this.w){
          if (mouseY > this.y && mouseY < this.y+this.h){
            this.hovering = true;
            return true;
          }
        }
      }
    }
    this.hovering = false;
    return false;
  }

  is_clicked(mouseX, mouseY, sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
        if (mouseX > this.x && mouseX < this.x+this.w){
          if (mouseY > this.y && mouseY < this.y+this.h){
            if (this.clickedOn){
              this.clickedOn = false;
            } else {
              this.clickedOn = true;
            }
            return true;
          }
        }
      }
    }
    this.clickedOn = false;
    return false;
  }

  mouse_up(){
    if (this.oneClick){
      this.clickedOn = false;
    }
  }

  draw(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
        if (this.clickedOn){
          ctx.drawImage(this.clickedImg, this.x, this.y, this.w, this.h);
        } else {
          if (this.hovering){
            ctx.drawImage(this.hoveringImg, this.x, this.y, this.w, this.h);
          } else {
            ctx.drawImage(this.defaultImg, this.x, this.y, this.w, this.h);
          }
        }
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
  constructor(backgroundColor, textColor, text, x, y, h, maxWidth, framesPerChar=3, activeScene="", showing=true){
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

    this.activeScene = activeScene;
    this.showing = showing;
  }

  startRunning(){
    this.running = true;
  }

  isDone(){
    return (!this.running) && this.currentText[0] != "";
  }

  show(){
    this.showing = true;
  }

  hide(){
    this.showing = false;
  }

  resetText(newText, showing=true){
    this.text = newText;
    this.textWords = newText.split(" ");
    this.running = false;
    this.currentText = [""];
    this.frames = 0;
    this.lineIdx = 0;
    this.wordIdx = 0;
    this.currIdx = 0;
    this.showing = showing;
  }

  checkNewLine(){
    if (this.text[this.currIdx] == "<" && this.text[this.currIdx+1] == ">"){
      // new line
      this.currIdx += 2;
      this.currentText.push("");
      this.lineIdx++;
      return;
    }

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
      if (this.showing){
        while (this.currIdx < this.text.length){
          this.checkNewLine();
          this.currentText[this.lineIdx] += this.text[this.currIdx];
          this.currIdx++;
        }
        this.running = false;
      }
    }
  }

  skipIfClicked(mouseX, mouseY, sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      ctx.font = this.fontSize.toString()+"px sans-serif";
      let textWidth = ctx.measureText(this.currentText[this.lineIdx]).width;
      let speechBubbleWidth = textWidth+(this.padding*2);
      let speechBubbleHeight = this.h*(this.lineIdx+1)
      if (mouseX > this.x && mouseX < this.x+speechBubbleWidth){
        if (mouseY > this.y && mouseY < this.y+speechBubbleHeight){
          this.skip(sceneName);
        }
      }
    }
  }

  draw(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
        if (this.running || this.currentText[0] != ""){
          if (this.running) {
            if (this.frames % this.framesPerChar == 0){
              this.checkNewLine();
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
  }
}

class GlyphTextSpeechBubble {
  constructor(backgroundColor, text, languageType, x, y, maxWidth, framesPerChar=3, activeScene="", showing=true, roundedCorners=true){
    this.backgroundColor = backgroundColor;
    this.textWords = text.split(", ");
    this.languageType = languageType;
    this.x = x;
    this.y = y;
    this.padding = cGLYPH_HEIGHT*0.2;
    this.maxNumGlyphs = (maxWidth-(this.padding*2))/cGLYPH_HEIGHT;

    this.running = false;
    this.framesPerChar = framesPerChar;
    this.frames = 0;
    this.currIdx = 0;

    this.activeScene = activeScene;
    this.showing = showing;
    this.roundedCorners = true;
  }

  resetText(newText, languageType, showing){
    this.textWords = newText.split(", ");
    this.languageType = languageType;
    this.running = false;
    this.frames = 0;
    this.currIdx = 0;
    this.showing = showing;
  }

  startRunning(){
    this.running = true;
  }

  isDone(){
    return (!this.running) && this.currIdx > 0;
  }

  skip(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
        this.currIdx = this.textWords.length;
      }
    }
  }

  skipIfClicked(mouseX, mouseY, sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      let speechBubbleWidth;
      if (this.currIdx < this.maxNumGlyphs){
        speechBubbleWidth = this.currIdx*cGLYPH_HEIGHT;
      } else {
        speechBubbleWidth = this.maxNumGlyphs*cGLYPH_HEIGHT;
      }
      let speechBubbleHeight = (parseInt(this.currIdx/this.maxNumGlyphs)+1)*cGLYPH_HEIGHT;

      if (mouseX > this.x && mouseX < this.x+speechBubbleWidth){
        if (mouseY > this.y && mouseY < this.y+speechBubbleHeight){
          this.skip(sceneName);
        }
      }
    }
  }

  check_mouse_over_char(mouseX, mouseY, sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
        let xStart;
        let yStart;
        for (let i = 0; i < this.currIdx; i++){
          if (this.textWords[i] != "" && this.textWords[i] != " "){
            xStart = this.x+(this.padding/2)+((i%this.maxNumGlyphs)*cGLYPH_HEIGHT)
            yStart = this.y+(this.padding/2)+(cGLYPH_HEIGHT*0.05)+(parseInt(i/this.maxNumGlyphs)*cGLYPH_HEIGHT)
            if (mouseX > xStart && mouseX < xStart+cGLYPH_HEIGHT){
              if (mouseY > yStart && mouseY < yStart+cGLYPH_HEIGHT){
                return [xStart, yStart, this.textWords[i]];
              }
            }
          }
        }
      }
    }
    return -1;
  }

  draw(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
        if (this.running || this.currIdx > 0){
          if (this.running) {
            if (this.frames % this.framesPerChar == 0){
              if (this.currIdx < this.textWords.length){
                this.currIdx++;
              } else {
                this.running = false;
              }
            }
          }
          
          let speechBubbleWidth;
          if (this.currIdx < this.maxNumGlyphs){
            speechBubbleWidth = this.currIdx*cGLYPH_HEIGHT;
          } else {
            speechBubbleWidth = this.maxNumGlyphs*cGLYPH_HEIGHT;
          }
          let speechBubbleHeight = (parseInt(this.currIdx/this.maxNumGlyphs)+1)*cGLYPH_HEIGHT;

          ctx.strokeStyle = this.backgroundColor;
          ctx.fillStyle = this.backgroundColor;
          ctx.beginPath();
          if (this.roundedCorners){
            ctx.roundRect(this.x, this.y, speechBubbleWidth+(this.padding*2), speechBubbleHeight+(this.padding*2), [cGLYPH_HEIGHT/2]);
          } else {
            ctx.fillRect(this.x, this.y, speechBubbleWidth+(this.padding*2), speechBubbleHeight+(this.padding*2));
          }
          ctx.stroke();
          ctx.fill();
          
          for (let i = 0; i < this.currIdx; i++){
            if (this.textWords[i] != "" && this.textWords[i] != " "){
              const img = new Image();
              img.src = cBASE_IMG_DIR+"languages/"+this.languageType+"-"+this.textWords[i]+".png";
              ctx.drawImage(img, this.x+(this.padding/2)+((i%this.maxNumGlyphs)*cGLYPH_HEIGHT), this.y+(this.padding/2)+(cGLYPH_HEIGHT*0.05)+(parseInt(i/this.maxNumGlyphs)*cGLYPH_HEIGHT), cGLYPH_HEIGHT, cGLYPH_HEIGHT);
            }
          }

          this.frames++;
        }
      }
    }
  }
}

class CharTextSpeechBubble {
  constructor(backgroundColor, text, languageType, x, y, maxWidth, framesPerChar=3, activeScene="", showing=true){
    this.backgroundColor = backgroundColor;
    this.textWords = text.split("");
    this.languageType = languageType;
    this.x = x;
    this.y = y;
    this.padding = cGLYPH_HEIGHT*0.2;
    this.maxNumChars = parseInt((maxWidth-(this.padding*2))/(cGLYPH_HEIGHT*0.75));

    this.running = false;
    this.framesPerChar = framesPerChar;
    this.frames = 0;
    this.currIdx = 0;

    this.activeScene = activeScene;
    this.showing = showing;
  }

  resetText(newText, languageType, showing){
    this.textWords = newText.split("");
    this.languageType = languageType;
    this.running = false;
    this.frames = 0;
    this.currIdx = 0;
    this.showing = showing;
  }

  startRunning(){
    this.running = true;
  }

  isDone(){
    return (!this.running) && this.currIdx > 0;
  }

  skip(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
        this.currIdx = this.textWords.length;
      }
    }
  }

  skipIfClicked(mouseX, mouseY, sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      let speechBubbleWidth;
      if (this.currIdx < this.maxNumChars){
        speechBubbleWidth = this.currIdx*(cGLYPH_HEIGHT*0.75);
      } else {
        speechBubbleWidth = this.maxNumChars*(cGLYPH_HEIGHT*0.75);
      }
      let speechBubbleHeight = (parseInt(this.currIdx/this.maxNumChars)+1)*cGLYPH_HEIGHT;

      if (mouseX > this.x && mouseX < this.x+speechBubbleWidth){
        if (mouseY > this.y && mouseY < this.y+speechBubbleHeight){
          this.skip(sceneName);
        }
      }
    }
  }

  check_mouse_over_char(mouseX, mouseY, sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
        let xStart;
        let yStart;
        for (let i = 0; i < this.currIdx; i++){
          if (this.textWords[i] != "" && this.textWords[i] != " "){
            xStart = this.x+(this.padding/2)+((i % this.maxNumChars)*cGLYPH_HEIGHT*0.75)
            yStart = this.y+(this.padding/2)+(cGLYPH_HEIGHT*0.05)+(parseInt(i/this.maxNumChars)*cGLYPH_HEIGHT)
            if (mouseX > xStart && mouseX < xStart+(cGLYPH_HEIGHT*0.75)){
              if (mouseY > yStart && mouseY < yStart+cGLYPH_HEIGHT){
                return [xStart, yStart, this.textWords[i]];
              }
            }
          }
        }
      }
    }
    return -1;
  }

  draw(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
        if (this.running || this.currIdx > 0){
          if (this.running) {
            if (this.frames % this.framesPerChar == 0){
              if (this.currIdx < this.textWords.length){
                this.currIdx++;
              } else {
                this.running = false;
              }
            }
          }
          
          let speechBubbleWidth;
          if (this.currIdx < this.maxNumChars){
            speechBubbleWidth = this.currIdx*(cGLYPH_HEIGHT*0.75);
          } else {
            speechBubbleWidth = this.maxNumChars*(cGLYPH_HEIGHT*0.75);
          }
          let speechBubbleHeight = (parseInt(this.currIdx/this.maxNumChars)+1)*cGLYPH_HEIGHT;

          ctx.strokeStyle = this.backgroundColor;
          ctx.fillStyle = this.backgroundColor;
          ctx.beginPath();
          ctx.roundRect(this.x, this.y, speechBubbleWidth+(this.padding*2), speechBubbleHeight+(this.padding*2), [cGLYPH_HEIGHT/2]);
          ctx.stroke();
          ctx.fill();
          
          for (let i = 0; i < this.currIdx; i++){
            if (this.textWords[i] != "" && this.textWords[i] != " "){
              const img = new Image();
              img.src = cBASE_IMG_DIR+"languages/"+this.languageType+"-"+this.textWords[i]+".png";
              ctx.drawImage(img, this.x+(this.padding/2)+((i % this.maxNumChars)*cGLYPH_HEIGHT*0.75), this.y+(this.padding/2)+(cGLYPH_HEIGHT*0.05)+(parseInt(i/this.maxNumChars)*cGLYPH_HEIGHT), cGLYPH_HEIGHT*0.75, cGLYPH_HEIGHT);
            }
          }

          this.frames++;
        }
      }
    }
  }
}

class MultiTextSpeechBubble {
  constructor(backgroundColor, textColor, texts, startX, startY, h, maxWidth, activeScene="", showing=true, framesPerChar=3){
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
    this.showing = showing;
    this.started = false;
    this.finished = false;

    this.h = h
    this.maxWidth = maxWidth;
    this.framesPerChar = framesPerChar;
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
  }

  resetText(newTexts, showing=true){
    this.textBubbles = [];
    this.currTextBubble = 0;

    let textBubble;
    for (let i = 0; i < newTexts.length; i++){
      textBubble = new TextSpeechBubble(this.backgroundColor, this.textColor, newTexts[i], this.currX, this.currY, this.h, this.maxWidth, this.framesPerChar);
      this.textBubbles.push(textBubble);
    }

    this.showing = showing;
    this.started = false;
    this.finished = false;
  }
  
  startRunning(){
    this.started = true;
    this.finished = false;
    this.textBubbles[this.currTextBubble].startRunning();
  }

  show() {
    this.showing = true;
  }

  hide() {
    this.showing = false;
  }

  skip(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
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
  }

  skipIfClicked(mouseX, mouseY, sceneName){
    this.textBubbles[this.currTextBubble].skipIfClicked(mouseX, mouseY, sceneName);
  }

  draw(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
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
}

class Button {
  constructor(defaultColor, hoverColor, clickedColor, textColor, text, x, y, w, h, identifier, oneClick=true, activeScene="", showing=true){
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

    this.activeScene = activeScene;
    this.showing = showing;
  }


  show() {
    this.showing = true;
  }

  hide() {
    this.showing = false;
  }

  is_clicked(mouseX, mouseY, sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
        if (this.x < mouseX && this.x+this.w > mouseX){
          if (this.y < mouseY && this.y+this.h > mouseY){
            this.clickedOn = true;
            return true;
          }
        }
        this.clickedOn = false;
        return false;
      }
    }
  }

  mouse_up(){
    if (this.clickedOn){
      this.clickedOn = false;
    }
  }

  is_hovering(mouseX, mouseY, sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
        if (this.x < mouseX && this.x+this.w > mouseX){
          if (this.y < mouseY && this.y+this.h > mouseY){
            this.hovering = true;
            return true;
          }
        }
        this.hovering = false;
        return false;
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

  draw(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
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
    this.originalFS = fontSize;
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

    if (this.animType == "none"){
      this.finishAnim();
    }
  }

  restartText(){
    this.animRunning = false;
    this.finishedAnim = false;
    this.txtRunning = false;
    this.currentText = [""];
    this.frames = 0;
    this.lineIdx = 0;
    this.wordIdx = 0;
    this.currIdx = 0;
  }

  startRunning(){
    this.animRunning = true;
    this.finishedAnim = false;
  }

  checkNewLine(){
    if (this.text[this.currIdx] == "<" && this.text[this.currIdx+1] == ">"){
      // new line
      this.currIdx += 2;
      this.currentText.push("");
      this.lineIdx++;
      return;
    }

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
        while (this.currIdx < this.text.length){
          this.checkNewLine();
          this.currentText[this.lineIdx] += this.text[this.currIdx];
          this.currIdx++;
        }
        this.txtRunning = false;
      }
    }
  }

  skipIfClicked(mouseX, mouseY, sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (mouseX > this.x && mouseX < this.x+this.w){
        if (mouseY > this.y && mouseY < this.y+this.h){
          this.skip(sceneName);
        }
      }
    }
  }

  finishAnim(){
    this.animRunning = false;
    this.finishedAnim = true;

    if (this.writeTxtOnAnimDone){
      this.txtRunning = true;
    } else {
      this.txtRunning = true;
      this.skip(this.activeScene);
    }
  }

  resetText(newText){
    this.text = newText;
    this.textWords = newText.split(" ");
    this.currentText = [""];
    this.lineIdx = 0;
    this.wordIdx = 0;
    this.currIdx = 0;
    this.txtRunning = true;
    this.skip(this.activeScene);
  }

  drawTxt(){
    if (this.txtRunning || this.currentText[0] != "" || this.currentText.length > 1){
      if (this.txtRunning) {
        if (this.frames % this.framesPerChar == 0){
          this.checkNewLine();
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

      
      let textWidth;
      ctx.fillStyle = this.textColor;
      this.fontSize = this.originalFS;
      let noShrink = true;
      for (let i=0; i <= this.lineIdx; i++){
        ctx.font = this.fontSize.toString()+"px sans-serif";
        textWidth = ctx.measureText(this.currentText[i]).width;
        if (textWidth > (this.w-(this.padding*2.5))){
          noShrink = false;
          this.fontSize = this.fontSize*(this.w-(this.padding*2.5))/textWidth;
        }
      }
      if (noShrink) this.fontSize = this.originalFS;

      ctx.font = this.fontSize.toString()+"px sans-serif";
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

class TextInputBox {
  constructor(x, y, w, h, activeScene="", showing=true, editable=true, prefilledText=""){
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.padding = this.h*0.15;
    
    this.activeScene = activeScene;
    this.showing = showing;

    this.editing = false;
    this.currentText = "";
    this.maxFontSize = this.h-(this.padding*2);

    this.editing = false;
    this.hovering = false;

    this.frames = 0;
    this.lineShow = false;

    this.editable = editable;
    this.prefilledText = prefilledText;
  }

  check_hovering(mouseX, mouseY, sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
        if (mouseX > this.x && mouseX < this.x+this.w){
          if (mouseY > this.y && mouseY < this.y+this.h){
            this.hovering = true;
            return true;
          }
        }
      }
    }
    this.hovering = false;
    return false;
  }

  check_clicked(mouseX, mouseY, sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing){
        if (mouseX > this.x && mouseX < this.x+this.w){
          if (mouseY > this.y && mouseY < this.y+this.h){
            if (this.editing){
              this.editing = false;
            } else {
              this.editing = true;
            }
            return true;
          }
        }
      }
    }
    this.editing = false;
    return false;
  }

  check_keypress(keyPressed){
    if (this.editing){
      if (keyPressed.length == 1){
        this.currentText += keyPressed;
      } if (keyPressed.toLowerCase() == "backspace" || keyPressed.toLowerCase() == "delete"){
        this.currentText = this.currentText.slice(0, -1);
      }
    }
  }

  show(){
    this.showing = true;
  }

  hide(){
    this.showing = false;
  }

  draw(sceneName, show){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.showing || show){
        if (this.editable){
          this.frames++;
          ctx.strokeStyle = "#000";
          if (this.editing){
            ctx.fillStyle = "#acecff";
          } else {
            if (this.hovering){
              ctx.fillStyle = "#e3e7ec";
            } else {
              ctx.fillStyle = "#FFF";
            }
          }
  
          ctx.beginPath();
          ctx.fillRect(this.x, this.y, this.w, this.h);
  
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(this.x+this.padding, this.y+this.h-this.padding);
          ctx.lineTo(this.x+this.w-this.padding, this.y+this.h-this.padding);
          ctx.stroke();
          
          let fontSize = this.maxFontSize;
          ctx.font = fontSize.toString()+"px sans-serif";
          let textWidth = ctx.measureText(this.currentText).width;
  
          if (textWidth > this.w-(this.padding*2)) {
            let scale = (this.w-(this.padding*2))/textWidth
            fontSize = parseInt(fontSize*scale);
            ctx.font = fontSize.toString()+"px sans-serif";
            textWidth = this.w-(this.padding*2);
          }
          ctx.fillStyle = "#000";
          ctx.fillText(this.currentText, this.x+this.padding, this.y+(this.h/2)+(fontSize/3));
  
          if (this.editing && this.lineShow){
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x+this.padding+textWidth, this.y+this.padding);
            ctx.lineTo(this.x+this.padding+textWidth, this.y+this.h-this.padding);
            ctx.stroke();
          }
  
          if (this.frames % 20 == 0) this.lineShow = !this.lineShow;
        } else {
          ctx.strokeStyle = "#000";
          ctx.fillStyle = "#FFF";
          ctx.beginPath();
          ctx.fillRect(this.x, this.y, this.w, this.h);
          
          let fontSize = this.maxFontSize;
          ctx.font = fontSize.toString()+"px sans-serif";
          let textWidth = ctx.measureText(this.prefilledText).width;
  
          if (textWidth > this.w-(this.padding*2)) {
            let scale = (this.w-(this.padding*2))/textWidth
            fontSize = parseInt(fontSize*scale);
            ctx.font = fontSize.toString()+"px sans-serif";
            textWidth = this.w-(this.padding*2);
          }
          ctx.fillStyle = "#000";
          ctx.fillText(this.prefilledText, this.x+this.padding, this.y+(this.h/2)+(fontSize/3));
          
        }
      }
    }
  }
}

class BasicImg {
  constructor(img, x, y, w, h, showing){
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.showing = showing;
  }

  show(){
    this.showing = true;
  }

  hide(){
    this.showing = false;
  }

  draw(show=false){
    if (this.showing || show){
      ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
  }
}


class Alert {
  constructor(x, y, activeScene=""){
    this.x = x;
    this.y = y;
    this.currX = x;
    this.currY = y;
    this.activeScene = activeScene;
    this.running = false;
    this.frames = 0;
    this.text = "";
  }

  draw(sceneName){
    if (this.activeScene == "" || this.activeScene == sceneName){
      if (this.running){
        this.frames++;

        ctx.font = "75px sans-serif";
        if (this.frames >= 60){
          ctx.fillStyle = "#FFFFFFCC";
        } else if (this.frames >= 62){
          ctx.fillStyle = "#FFFFFF99";
        } else if (this.frames >= 64){
          ctx.fillStyle = "#FFFFFF66";
        } else if (this.frames >= 66){
          ctx.fillStyle = "#FFFFFF33";
        } else {
          ctx.fillStyle = "#FFF";
        }

        if (this.frames < 10 || this.frames > 60){
          this.currY -= 3;
        }

        ctx.fillText(this.text, this.currX, this.currY);

        if (this.frames >= 70){
          this.running = false;
          this.frames = 0;
        }
      }
    }
  }

  startAlert(text){
    this.text = text;
    this.running = true;
    this.currX = this.x;
    this.currY = this.y;
  }
}

console.log("Defining info");
// Preset stuff
const osvMessages = {
    "package delivery":"you, big, object, move, [], question",
    "letter delivery":"you, paper, move, [], question",
    "transportation ticket":"me, [], move, paper, want",
    "package delivery error":"small",
    "letter delivery error":"small",
    "transportation ticket error":"small"
}

const muMessages = {
  "package delivery":"please, move, object, []",
  "letter delivery":"please, move, paper, object, []",
  "transportation ticket":"me, want, [], move, paper",
  "package delivery error":"small",
  "letter delivery error":"small",
  "transportation ticket error":"small",
}

const pluMessages = {
  "package delivery":"you, move, object, []",
  "letter delivery":"you, move, paper, []",
  "transportation ticket":"me, want, [], move, paper",
  "package delivery error":"small",
  "letter delivery error":"small",
  "transportation ticket error":"small",
}

const engMessages = {
  "package delivery":"Can you please deliver this package to []?",
  "letter delivery":"Can you please deliver this letter to []?",
  "transportation ticket":"I would like a transportation ticket to [], please",
  "package delivery error":"AAA",
  "letter delivery error":"AAA",
  "transportation ticket error":"AAA",
}

const mnemMessages = {
  "package delivery":"k*n j* t*l*v*r v*s p*k*j t* []",
  "letter delivery":"k*n j* t*l*v*r v*s l*t*r t* []",
  "transportation ticket":"m* *nt * jr*nsp*rt*j*n t*k*t t* []",
  "package delivery error":"*r*r",
  "letter delivery error":"*r*r",
  "transportation ticket error":"*r*r",
}

const kishMessages = {
  "package delivery":"kan you deriber dis bakaje do []",
  "letter delivery":"kan you deriber dis redder do []",
  "transportation ticket":"i ourd rike a dransbordajion dikked do []",
  "package delivery error":"error",
  "letter delivery error":"error",
  "transportation ticket error":"error",
}

let npcTextCatalog = {}
npcTextCatalog["osv"] = osvMessages;
npcTextCatalog["mu"] = muMessages;
npcTextCatalog["plu"] = pluMessages;
npcTextCatalog["eng"] = engMessages;
npcTextCatalog["mnem"] = mnemMessages;
npcTextCatalog["kish"] = kishMessages;


/* Game functionality */
let mousePos = {
    x:-1,
    y:-1
};
let mouseDown = false;
let keyPress = "";
let shiftPress = false;

let scene = "main"; // main, handbook, delivery, cat

// handbook
let pageNum = 0;
let npc_profile_pics = {};
npc_profile_pics["kish"] = new Image();
npc_profile_pics["kish"].src = cBASE_IMG_DIR+"kishik/kishik-4.png";

npc_profile_pics["mu"] = new Image();
npc_profile_pics["mu"].src = cBASE_IMG_DIR+"muglyph/muglyph-11.png";

npc_profile_pics["plu"] = new Image();
npc_profile_pics["plu"].src = cBASE_IMG_DIR+"pluglyph/pluglyph-1.png";

npc_profile_pics["eng"] = new Image();
npc_profile_pics["eng"].src = cBASE_IMG_DIR+"eng/eng-1.png";

npc_profile_pics["mnem"] = new Image();
npc_profile_pics["mnem"].src = cBASE_IMG_DIR+"mnemote/mnemote-1.png";

npc_profile_pics["osv"] = new Image();
npc_profile_pics["osv"].src = cBASE_IMG_DIR+"osiv/osiv-3.png";

let npc_profile_txt = {}
npc_profile_txt["mu"] = "<> <> <> <> <> Muglyph <> Language Type: Glyphs";
npc_profile_txt["plu"] = "<> <> <> <> <> Pluglyph <> Language Type: Glyphs";
npc_profile_txt["osv"] = "<> <> <> <> <> Osiv <> Language Type: Glyphs";
npc_profile_txt["eng"] = "<> <> <> <> <> Nulander <> Language Type: Letters";
npc_profile_txt["kish"] = "<> <> <> <> <> Kishik <> Language Type: Letters";
npc_profile_txt["mnem"] = "<> <> <> <> <> Mnemote <> Language Type: Letters";

console.log("Defining sprites");
// Task generation
let npcType = "";
let npcName = "";
let npcMood = "";
let npcVariation = 0;
let taskType = "";
let taskHandlingType = "";
let message = "";
let deliveryDestination = "";
let currentDeliverySelection = "";

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

let guy = new Sprite("guy/guy", 3, 10, cSCREEN_WIDTH-750, cCUST_Y_START, 750, 750, true, "cat");
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
let mnem1 = new Sprite("mnemote/mnemote", 3, 10, cCUST_X_START, cCUST_Y_START, cCUST_SIZE, cCUST_SIZE, false, "main");
all_sprites.push(mnem1);
mnem_sprites.push(mnem1);

let osv_sprites = [];
let osv1 = new Sprite("osiv/osiv", 9, 12, cCUST_X_START, cCUST_Y_START, cCUST_SIZE, cCUST_SIZE, false, "main");
all_sprites.push(osv1);
osv_sprites.push(osv1);

let eng_sprites = [];
let eng1 = new Sprite("eng/eng", 4, 10, cCUST_X_START, cCUST_Y_START, cCUST_SIZE, cCUST_SIZE, false, "main");
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
npcVocab["kish"] = ["a", "b", "d", "e", "g", "h", "i", "j", "k", "m", "n", "o", "r", "s", "u", "y"];
npcVocab["mnem"] = ['*', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v'];
npcVocab["plu"] = ["address", "big", "hello", "how", "me", "move", "not", "object", "paper", "person", "small", "please", "want", "what", "when", "where", "who", "why", "you", "question", "plural"];
npcVocab["mu"] = ["address", "big", "friend", "hello", "how", "like", "me", "move", "not", "object", "paper", "person", "small", "please", "want", "what", "when", "where", "who", "why", "you"];
npcVocab["osv"] = ["address", "big", "friend", "hello", "how", "like", "me", "move", "not", "object", "paper", "person", "small", "please", "want", "what", "when", "where", "who", "why", "you", "question", "plural"];

let npcTranslations = {}
npcTranslations["kish"] = {'a': 'a', 'b': 'b/p/v/f', 'd': 'd/t', 'e': 'e', 'g': 'ng', 'h': 'h', 'i': 'i', 'j': 'j/sh/ch', 'k': 'k/g', 'm': 'm', 'n': 'n', 'o': 'o', 'r': 'r/l', 's': 's/z', 'u': 'u', 'y': 'y'}
npcTranslations["mnem"] = {'*': 'a/e/i/o/u/y', 'j': 'j/sh/ch', 'k': 'k/g', 'l': 'l', 'm': 'm', 'n': 'n', 'p': 'p/b', 'r': 'r', 's': 's/z', 't': 't/d', 'v': 'v/f'};
npcTranslations["plu"] = {'address': 'address/location', 'big': 'big', 'hello': 'hello/goodbye', 'how': 'how', 'me': 'me', 'move': 'move/transport', 'not': 'not', 'object': 'object/thing', 'paper': 'paper/letter', 'person': 'person', 'small': 'small', 'please': 'please/thanks', 'want': 'want', 'what': 'what', 'when': 'when', 'where': 'where', 'who': 'who', 'why': 'why', 'you': 'you', 'plural':'s', 'question':'?'};
npcTranslations["mu"] = {'address': 'address/location', 'big': 'big', 'friend': 'friend', 'hello': 'hello/goodbye', 'how': 'how', 'like': 'like', 'me': 'me', 'move': 'move/transport', 'not': 'not', 'object': 'object/thing', 'paper': 'paper/letter', 'person': 'person', 'small': 'small', 'please': 'please/thanks', 'want': 'want', 'what': 'what', 'when': 'when', 'where': 'where', 'who': 'who', 'why': 'why', 'you': 'you'};
npcTranslations["osv"] = {'address': 'address/location', 'big': 'big', 'friend': 'friend', 'hello': 'hello/goodbye', 'how': 'how', 'like': 'like', 'me': 'me', 'move': 'move/transport', 'not': 'not', 'object': 'object/thing', 'paper': 'paper/letter', 'person': 'person', 'small': 'small', 'please': 'please/thanks', 'want': 'want', 'what': 'what', 'when': 'when', 'where': 'where', 'who': 'who', 'why': 'why', 'you': 'you', 'plural':'s', 'question':'?'};

let npcTranslatedWords = {}
npcTranslatedWords["kish"] = [];
npcTranslatedWords["mnem"] = [];
npcTranslatedWords["plu"] = [];
npcTranslatedWords["mu"] = [];
npcTranslatedWords["osv"] = [];


let glyphNPCs = ["mu", "plu", "osv"];

// text bubbles
let all_skippable = [];
let all_popups = [];
// let engTextBubble = new MultiTextSpeechBubble("#FFF", "#000", ["Ello whats up how are you doing?"], 50, 50, cSCREEN_WIDTH-100, cSCREEN_WIDTH-100, "main", false, 2);
let engTextBubble = new TextSpeechBubble("#FFF", "#000", "Ello whats up how are you doing?", 50, 50, cTEXT_BUBBLE_SIZE, cSCREEN_WIDTH-100, 3, "main", false);
all_skippable.push(engTextBubble);
all_popups.push(engTextBubble);

let glyphTextBubble = new GlyphTextSpeechBubble("#FFF", pluMessages["package delivery"], "plu", 50, 50, cSCREEN_WIDTH-100, 3, "main", false);
all_skippable.push(glyphTextBubble);
all_popups.push(glyphTextBubble);
// glyphTextBubble.startRunning();

let charTextBubble = new CharTextSpeechBubble("#FFF", kishMessages["package delivery"], "kish", 50, 50, cSCREEN_WIDTH-100, 3, "main", false);
all_skippable.push(charTextBubble);
all_popups.push(charTextBubble);
// charTextBubble.startRunning();

let profileInfoBox = new AnimatedTextBox("#78f6ff", "#000", "AAAA", cSCREEN_WIDTH-cPROFILE_WIDTH-cPROFILE_PADDING, cPROFILE_Y_START+cPROFILE_PADDING, cPROFILE_WIDTH-cPROFILE_PADDING, cPROFILE_HEIGHT+cPROFILE_PADDING, 50, "from-bottom", "main", true, 2)
all_skippable.push(profileInfoBox);
all_popups.push(profileInfoBox);
// profileInfoBox.startRunning();
let profileText = "";

let leftPage = new AnimatedTextBox("#ffffff", "#000", "AAA", cPAGE_X_START, cPAGE_Y_START, cPAGE_WIDTH, cPAGE_HEIGHT, cTEXT_BUBBLE_SIZE, "none", "handbook", false);
all_popups.push(leftPage);
// leftPage.startRunning();
let rightPage = new AnimatedTextBox("#ffffff", "#000", "AAA", cPAGE_X_START+cPAGE_WIDTH, cPAGE_Y_START, cPAGE_WIDTH, cPAGE_HEIGHT, cTEXT_BUBBLE_SIZE, "none", "handbook", false);
all_popups.push(rightPage);
// leftPage.startRunning();

let prevPage = new Button("#dee2e7", "#b6dae8", "#677786", "#0b0b2e", " <  ", cPAGE_X_START+15, cPAGE_Y_START+(cPAGE_HEIGHT/2), cPAGE_BTN_SIZE, cPAGE_BTN_SIZE, "prev-page", true, "handbook", true);
all_buttons.push(prevPage);
let nextPage = new Button("#dee2e7", "#b6dae8", "#677786", "#0b0b2e", "  > ", cPAGE_X_START-15+(cPAGE_WIDTH*2)-cPAGE_BTN_SIZE, cPAGE_Y_START+(cPAGE_HEIGHT/2), cPAGE_BTN_SIZE, cPAGE_BTN_SIZE, "next-page", true, "handbook", true);
all_buttons.push(nextPage);

let all_text_input_boxes = [];
// let textInputBox = new TextInputBox(1000, 100, 200, 50, "main", true);
// all_text_input_boxes.push(textInputBox);

let package1 = new ClickableSprite("package-1", 250, cDESK_Y_START-200, 400, 400, true, false, "main", "package");
all_buttons.push(package1);
let letter1 = new ClickableSprite("letter", 250, cDESK_Y_START-200, 400, 400, true, false, "main", "letter");
all_buttons.push(letter1);

let closeProfileButton = new Button("#ff0000", "#b60000", "#740000", "#000", " ", 0, 0, 50, 50, "close-profile", true, "main", true);
all_buttons.push(closeProfileButton);

let all_main_nav_buttons = [];
let showProfileButton = new Button("#78f6ff", "#59e1ff", "rgb(94, 203, 239)", "#000", " Customer Profile ", cSCREEN_WIDTH*0.7, cDESK_Y_START+50, 400, cNAV_BTN_HEIGHT, "show-profile", true, "main", true);
all_buttons.push(showProfileButton);
all_main_nav_buttons.push(showProfileButton);
let showHandbookPage = new Button("#ffd182", "#ffbe56", "#b76e00", "#000", "Handbook Page", cSCREEN_WIDTH*0.7, cDESK_Y_START+40-cNAV_BTN_HEIGHT, 400, cNAV_BTN_HEIGHT, "handbook-page", true, "main", true);
all_buttons.push(showHandbookPage);
all_main_nav_buttons.push(showHandbookPage);


let nulandDelivery = new ClickableSprite("nuland", cDELIVERY_X_START, cDELIVERY_Y_START, cDELIVERY_SIZE, cDELIVERY_SIZE, false, true, "delivery", "delivery-nuland");
all_buttons.push(nulandDelivery);
let kiskusDelivery = new ClickableSprite("kiskus", cDELIVERY_X_START+(cDELIVERY_X_SPACING), cDELIVERY_Y_START, cDELIVERY_SIZE, cDELIVERY_SIZE, false, true, "delivery", "delivery-kiskus");
all_buttons.push(kiskusDelivery);
let mnemoniteDelivery = new ClickableSprite("mnemonite", cDELIVERY_X_START+(cDELIVERY_X_SPACING*2), cDELIVERY_Y_START, cDELIVERY_SIZE, cDELIVERY_SIZE, false, true, "delivery", "delivery-mnemonite");
all_buttons.push(mnemoniteDelivery);
let muglyDelivery = new ClickableSprite("mugly", cDELIVERY_X_START, cDELIVERY_Y_START+cDELIVERY_Y_SPACING, cDELIVERY_SIZE, cDELIVERY_SIZE, false, true, "delivery", "delivery-mugly");
all_buttons.push(muglyDelivery);
let plugloDelivery = new ClickableSprite("pluglo", cDELIVERY_X_START+(cDELIVERY_X_SPACING), cDELIVERY_Y_START+cDELIVERY_Y_SPACING, cDELIVERY_SIZE, cDELIVERY_SIZE, false, true, "delivery", "delivery-pluglo");
all_buttons.push(plugloDelivery);
let ignusDelivery = new ClickableSprite("ignus", cDELIVERY_X_START+(cDELIVERY_X_SPACING*2), cDELIVERY_Y_START+cDELIVERY_Y_SPACING, cDELIVERY_SIZE, cDELIVERY_SIZE, false, true, "delivery", "delivery-ignus");
all_buttons.push(ignusDelivery);

let sendDeliveryButton = new Button("#33d021", "#1ba90b", "#0c7400", "#000000", "Send for Delivery", cSCREEN_WIDTH*0.7, 50, 400, cNAV_BTN_HEIGHT, "send-delivery", true, "delivery", true);
all_buttons.push(sendDeliveryButton);


let alertText = new Alert(cSCREEN_WIDTH*0.6, 250, "main");
// alertText.startAlert(":3");
all_sprites.push(alertText)


let npc_language_pages = {}
npc_language_pages["mu"] = [];
npc_language_pages["plu"] = [];
npc_language_pages["osv"] = [];
npc_language_pages["kish"] = [];
npc_language_pages["mnem"] = [];
let npc_language_inputs = {}
npc_language_inputs["mu"] = [];
npc_language_inputs["plu"] = [];
npc_language_inputs["osv"] = [];
npc_language_inputs["kish"] = [];
npc_language_inputs["mnem"] = [];
let npcPageType;
let imgObj;
let textInputBox;
for (let n = 0; n < cNPC_TYPES.length; n++){
  npcPageType = cNPC_TYPES[n];

  let startX = rightPage.x+(cBOOK_PADDING*2);
  let startY = rightPage.y+cBOOK_PADDING;
  let maxX = (startX+cPAGE_WIDTH)-cBOOK_PADDING;
  let maxY = (startY+cPAGE_HEIGHT)-cBOOK_PADDING;
  let currX = startX;
  let currY = startY;
  if (npcPageType != "eng"){
    for (let i = 0; i < npcVocab[npcPageType].length; i++){
      const img = new Image();
      img.src = cBASE_IMG_DIR+"languages/"+npcPageType+"-"+npcVocab[npcPageType][i]+".png";
      if (glyphNPCs.includes(npcPageType)){
        imgObj = new BasicImg(img, currX, currY, cGLYPH_BOOK_HEIGHT, cGLYPH_BOOK_HEIGHT, false);
        textInputBox = new TextInputBox(currX+cGLYPH_BOOK_HEIGHT, currY, 200, cGLYPH_BOOK_HEIGHT, "handbook", false);

        currY += cGLYPH_BOOK_HEIGHT;
        if (currY+cGLYPH_BOOK_HEIGHT >= maxY){
          // next col
          currY = startY;
          currX += cGLYPH_BOOK_HEIGHT+200;
        }
      } else {
        imgObj = new BasicImg(img, currX, currY, cGLYPH_BOOK_HEIGHT*0.75, cGLYPH_BOOK_HEIGHT, false);
        textInputBox = new TextInputBox(currX+(cGLYPH_BOOK_HEIGHT*0.75), currY, 100, cGLYPH_BOOK_HEIGHT, "handbook", false);

        currY += cGLYPH_BOOK_HEIGHT;
        if (currY+cGLYPH_BOOK_HEIGHT >= maxY){
          // next col
          currY = startY;
          currX += cGLYPH_BOOK_HEIGHT+100;
        }
      }

      npc_language_pages[npcPageType].push(imgObj);
      all_text_input_boxes.push(textInputBox);
      npc_language_inputs[npcPageType].push(textInputBox);
    }
  }
}


console.log("Defining key + mouse binds");
// Get Keys
document.addEventListener("keydown", function (e){
  console.log(e.key);
  if (e.key == "Shift"){
    shiftPress = true;
  } else {
    keyPress = e.key;
  }

  all_text_input_boxes.forEach((item) => {
    item.check_keypress(e.key);
  });
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
    item.is_hovering(mousePos.x, mousePos.y, scene);
  });

  all_text_input_boxes.forEach((item) => {
    item.check_hovering(mousePos.x, mousePos.y, scene);
  });
});

document.addEventListener("mousedown", function(e) { 
  xScale = cvs.width/cvs.getBoundingClientRect().width;
  yScale = cvs.height/cvs.getBoundingClientRect().height;
  mousePos.x = (e.x-cvs.getBoundingClientRect().left) * xScale;
  mousePos.y = (e.y-cvs.getBoundingClientRect().top) * yScale;

  mouseDown = true;
  let noButtonClicked = true;
  all_buttons.forEach((item) => {
    if (item.is_clicked(mousePos.x, mousePos.y, scene)){
      noButtonClicked = false;
      // check if nav change
      if (item.identifier == "nav-handbook"){
        scene = "handbook";
        if (cNPC_TYPES[pageNum] != "eng" && pageNum < cNPC_TYPES.length){
          for (let i = 0; i < npc_language_pages[cNPC_TYPES[pageNum]].length; i++){
            npc_language_inputs[cNPC_TYPES[pageNum]][i].show();
          }
        }
      }
      if (item.identifier == "nav-main") scene = "main";
      if (item.identifier == "nav-delivery") scene = "delivery";
      if (item.identifier == "nav-cat") scene = "cat";
      if (item.identifier == "next-page"){
        if (cNPC_TYPES[pageNum] != "eng" && pageNum < cNPC_TYPES.length){
          for (let i = 0; i < npc_language_pages[cNPC_TYPES[pageNum]].length; i++){
            npc_language_inputs[cNPC_TYPES[pageNum]][i].hide();
          }
        }
        pageNum++;
        if (cNPC_TYPES[pageNum] != "eng" && pageNum < cNPC_TYPES.length){
          for (let i = 0; i < npc_language_pages[cNPC_TYPES[pageNum]].length; i++){
            npc_language_inputs[cNPC_TYPES[pageNum]][i].show();
          }
        }
      } if (item.identifier == "prev-page"){
        if (cNPC_TYPES[pageNum] != "eng" && pageNum < cNPC_TYPES.length){
          for (let i = 0; i < npc_language_pages[cNPC_TYPES[pageNum]].length; i++){
            npc_language_inputs[cNPC_TYPES[pageNum]][i].hide();
          }
        }
        
        if (pageNum-1 >= 0){
          pageNum--;
        }

        if (cNPC_TYPES[pageNum] != "eng" && pageNum < cNPC_TYPES.length){
          for (let i = 0; i < npc_language_pages[cNPC_TYPES[pageNum]].length; i++){
            npc_language_inputs[cNPC_TYPES[pageNum]][i].show();
          }
        }
      }

      if (item.identifier == "close-profile"){
        profileInfoBox.y = cSCREEN_HEIGHT;
        profileInfoBox.startRunning();
        closeProfileButton.hide();

        for (let i = 0; i < all_main_nav_buttons.length; i++){
          all_main_nav_buttons[i].show();
        }
      } if (item.identifier == "show-profile"){
        profileInfoBox.y = cPROFILE_Y_START+cPROFILE_PADDING;
        profileInfoBox.restartText();
        profileInfoBox.startRunning();
        closeProfileButton.show();
        
        for (let i = 0; i < all_main_nav_buttons.length; i++){
          all_main_nav_buttons[i].hide();
        }
      }

      if (item.identifier == "handbook-page"){
        scene = "handbook";
        if (cNPC_TYPES[pageNum] != "eng" && pageNum < cNPC_TYPES.length){
          for (let i = 0; i < npc_language_pages[cNPC_TYPES[pageNum]].length; i++){
            npc_language_inputs[cNPC_TYPES[pageNum]][i].hide();
          }
        }
        pageNum = cNPC_TYPES.indexOf(npcType);
        if (cNPC_TYPES[pageNum] != "eng" && pageNum < cNPC_TYPES.length){
          for (let i = 0; i < npc_language_pages[cNPC_TYPES[pageNum]].length; i++){
            npc_language_inputs[cNPC_TYPES[pageNum]][i].show();
          }
        }
      }

      if (item.identifier.substring(0, 8) == "delivery"){
        currentDeliverySelection = item.identifier.substring(9);
      }
    }
  });
  if (noButtonClicked) currentDeliverySelection = "";

  all_skippable.forEach((item) => {
    item.skipIfClicked(mousePos.x, mousePos.y, scene);
  });
  all_text_input_boxes.forEach((item) => {
    item.check_clicked(mousePos.x, mousePos.y, scene);
  });
});

document.addEventListener("touchstart", function(e) { 
  xScale = cvs.width/cvs.getBoundingClientRect().width;
  yScale = cvs.height/cvs.getBoundingClientRect().height;
  mousePos.x = (e.x-cvs.getBoundingClientRect().left) * xScale;
  mousePos.y = (e.y-cvs.getBoundingClientRect().top) * yScale;
  
  mouseDown = true;
  currentDeliverySelection = "";
  all_buttons.forEach((item) => {
    if (item.is_clicked(mousePos.x, mousePos.y, scene)){
      noButtonClicked = false;
      // check if nav change
      if (item.identifier == "nav-handbook"){
        scene = "handbook";
        if (cNPC_TYPES[pageNum] != "eng" && pageNum < cNPC_TYPES.length){
          for (let i = 0; i < npc_language_pages[cNPC_TYPES[pageNum]].length; i++){
            npc_language_inputs[cNPC_TYPES[pageNum]][i].show();
          }
        }
      }
      if (item.identifier == "nav-main") scene = "main";
      if (item.identifier == "nav-delivery") scene = "delivery";
      if (item.identifier == "nav-cat") scene = "cat";
      if (item.identifier == "next-page"){
        if (cNPC_TYPES[pageNum] != "eng" && pageNum < cNPC_TYPES.length){
          for (let i = 0; i < npc_language_pages[cNPC_TYPES[pageNum]].length; i++){
            npc_language_inputs[cNPC_TYPES[pageNum]][i].hide();
          }
        }
        pageNum++;
        if (cNPC_TYPES[pageNum] != "eng" && pageNum < cNPC_TYPES.length){
          for (let i = 0; i < npc_language_pages[cNPC_TYPES[pageNum]].length; i++){
            npc_language_inputs[cNPC_TYPES[pageNum]][i].show();
          }
        }
      } if (item.identifier == "prev-page"){
        if (cNPC_TYPES[pageNum] != "eng" && pageNum < cNPC_TYPES.length){
          for (let i = 0; i < npc_language_pages[cNPC_TYPES[pageNum]].length; i++){
            npc_language_inputs[cNPC_TYPES[pageNum]][i].hide();
          }
        }
        
        if (pageNum-1 >= 0){
          pageNum--;
        }

        if (cNPC_TYPES[pageNum] != "eng" && pageNum < cNPC_TYPES.length){
          for (let i = 0; i < npc_language_pages[cNPC_TYPES[pageNum]].length; i++){
            npc_language_inputs[cNPC_TYPES[pageNum]][i].show();
          }
        }
      }

      if (item.identifier == "close-profile"){
        profileInfoBox.y = cSCREEN_HEIGHT;
        profileInfoBox.startRunning();
        closeProfileButton.hide();

        for (let i = 0; i < all_main_nav_buttons.length; i++){
          all_main_nav_buttons[i].show();
        }
      } if (item.identifier == "show-profile"){
        profileInfoBox.y = cPROFILE_Y_START+cPROFILE_PADDING;
        profileInfoBox.restartText();
        profileInfoBox.startRunning();
        closeProfileButton.show();
        
        for (let i = 0; i < all_main_nav_buttons.length; i++){
          all_main_nav_buttons[i].hide();
        }
      }

      if (item.identifier == "handbook-page"){
        scene = "handbook";
        if (cNPC_TYPES[pageNum] != "eng" && pageNum < cNPC_TYPES.length){
          for (let i = 0; i < npc_language_pages[cNPC_TYPES[pageNum]].length; i++){
            npc_language_inputs[cNPC_TYPES[pageNum]][i].hide();
          }
        }
        pageNum = cNPC_TYPES.indexOf(npcType);
        if (cNPC_TYPES[pageNum] != "eng" && pageNum < cNPC_TYPES.length){
          for (let i = 0; i < npc_language_pages[cNPC_TYPES[pageNum]].length; i++){
            npc_language_inputs[cNPC_TYPES[pageNum]][i].show();
          }
        }
      }

      if (item.identifier.substring(0, 8) == "delivery"){
        currentDeliverySelection = item.identifier.substring(9);
      }
    }
  });
  if (noButtonClicked) currentDeliverySelection = "";

  all_skippable.forEach((item) => {
    item.skipIfClicked(mousePos.x, mousePos.y, scene);
  });
  all_text_input_boxes.forEach((item) => {
    item.check_clicked(mousePos.x, mousePos.y, scene);
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


console.log("Draw function");
let buttonAnimFrameLoop = 0;
function draw(){
    ctx.fillStyle = "#1c1c32";
    ctx.fillRect(0, 0, cSCREEN_WIDTH, cSCREEN_HEIGHT);
    
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
        deliveryDestination = getRandomDestination(npcType);
        if (glyphNPCs.includes(npcType)){
          npcName = getRandomNPCGlyphName(npcVocab[npcType]);
        } else {
          npcName = getRandomNPCName();
        }

        npcMood = getRandomChoice(cNPC_MOODS);
        
        taskType = getRandomChoice(cTASK_TYPES);
        console.log(taskType);
        if (taskType == "package delivery") package1.show();
        if (taskType == "letter delivery") letter1.show();
        taskHandlingType = getRandomChoice(cTASK_HANDLING_TYPES);

        npcVariation = randrange(0, npc_sprite_opts[npcType].length);

        npc_sprite_opts[npcType][npcVariation].show();

        // chat text
        let npcTextTemplate;
        if (npcType == "eng"){
          npcTextTemplate = npcTextCatalog[npcType][taskType+taskHandlingType];
          engTextBubble.resetText(npcTextTemplate.replace("[]", deliveryDestination), true);
          engTextBubble.startRunning();
        } else if (glyphNPCs.includes(npcType)){
          npcTextTemplate = npcTextCatalog[npcType][taskType+taskHandlingType]
          glyphTextBubble.resetText(npcTextTemplate.replace("[]", deliveryDestination), npcType, true);
          glyphTextBubble.startRunning();
        } else {
          npcTextTemplate = npcTextCatalog[npcType][taskType+taskHandlingType];
          charTextBubble.resetText(npcTextTemplate.replace("[]", deliveryDestination), npcType, true);
          charTextBubble.startRunning();
        }

        // profile
        profileText = "Name: <>\"";
        profileText += npcName;
        profileText += "\"<> <>Request Category: <>\"";
        profileText += taskType;
        profileText += "\"";

        profileInfoBox.text = profileText;

      }
    } if (scene == "delivery"){
      if (taskType == "transportation ticket"){
        nulandDelivery.clickedOn = false;
        kiskusDelivery.clickedOn = false;
        mnemoniteDelivery.clickedOn = false;
        muglyDelivery.clickedOn = false;
        plugloDelivery.clickedOn = false;
        ignusDelivery.clickedOn = false;
        sendDeliveryButton.hide();
      } else {
        ctx.fillStyle = "#78f6ff";
        ctx.fillRect(30, 30, cSCREEN_WIDTH*0.45, 100);
  
        ctx.fillStyle = "#000";
        ctx.font = "55px sans-serif";
        ctx.fillText("DELIVER TO: ", 42, 105);
        ctx.fillText(currentDeliverySelection, 400, 105);
  
        if (currentDeliverySelection == "nuland") nulandDelivery.clickedOn = true;
        if (currentDeliverySelection == "kiskus") kiskusDelivery.clickedOn = true;
        if (currentDeliverySelection == "mnemonite") mnemoniteDelivery.clickedOn = true;
        if (currentDeliverySelection == "mugly") muglyDelivery.clickedOn = true;
        if (currentDeliverySelection == "pluglo") plugloDelivery.clickedOn = true;
        if (currentDeliverySelection == "ignus") ignusDelivery.clickedOn = true;
        if (currentDeliverySelection == "") sendDeliveryButton.hide();
        if (currentDeliverySelection != "") sendDeliveryButton.show();
  
        if (parseInt(buttonAnimFrameLoop/10) == 0){
          sendDeliveryButton.defaultColor = "#33d021";
        } else if (parseInt(buttonAnimFrameLoop/10) == 1){
          sendDeliveryButton.defaultColor = "#4bff37";
        } else if (parseInt(buttonAnimFrameLoop/10) == 2){
          sendDeliveryButton.defaultColor = "#6eff5e";
        } else if (parseInt(buttonAnimFrameLoop/10) == 3){
          sendDeliveryButton.defaultColor = "#4bff37";
        } else {
          buttonAnimFrameLoop = 0;
          sendDeliveryButton.defaultColor = "#33d021";
        }
  
        buttonAnimFrameLoop++;
      }
    }

    all_popups.forEach((item) => {
      item.draw(scene);
    })
    if (scene == "main"){
      closeProfileButton.x = profileInfoBox.currX+profileInfoBox.w-65;
      closeProfileButton.y = profileInfoBox.currY+15;

      // check mouse over letter
      let charGlyphInfo = -1;
      if (npcType != "eng"){
        if (glyphNPCs.includes(npcType)){
          charGlyphInfo = glyphTextBubble.check_mouse_over_char(mousePos.x, mousePos.y, "main");
          if (charGlyphInfo != -1){
            ctx.fillStyle = "#a2e9ffa9";
            ctx.fillRect(charGlyphInfo[0], charGlyphInfo[1], cGLYPH_HEIGHT, cGLYPH_HEIGHT);
          }
        } else {
          charGlyphInfo = charTextBubble.check_mouse_over_char(mousePos.x, mousePos.y, "main");
          if (charGlyphInfo != -1){
            ctx.fillStyle = "#a2e9ffa9";
            ctx.fillRect(charGlyphInfo[0], charGlyphInfo[1], cGLYPH_HEIGHT*0.75, cGLYPH_HEIGHT);
          }
        }
      }
    }

    if (scene == "handbook"){
      ctx.fillStyle = "#2b2b2b";
      ctx.fillRect((cPAGE_X_START+cPAGE_WIDTH)-1, cPAGE_Y_START, 2, cPAGE_HEIGHT);

      if (pageNum < cNPC_TYPES.length){
        rightPage.resetText("");
        let npcPageType = cNPC_TYPES[pageNum];
        // draw profile image
        ctx.strokeStyle = "#2b2b2b";
        ctx.lineWidth = 3;
        ctx.strokeRect(cPAGE_X_START+50, cPAGE_Y_START+50, cPAGE_WIDTH*0.35, cPAGE_WIDTH*0.35);
        ctx.drawImage(npc_profile_pics[npcPageType], cPAGE_X_START+50, cPAGE_Y_START+50, cPAGE_WIDTH*0.35, cPAGE_WIDTH*0.35);

        if (leftPage.text != npc_profile_txt[npcPageType]){
          leftPage.resetText(npc_profile_txt[npcPageType]);
          leftPage.startRunning();
          leftPage.finishAnim();
        }

        if (pageNum == 0){
          prevPage.hide();
        } else {
          prevPage.show();
        }

        if (npcPageType != "eng"){
          for (let i = 0; i < npc_language_pages[npcPageType].length; i++){
            npc_language_pages[npcPageType][i].draw(true);
          }
        }
      } else {
        // instructions pages
      }
    }

    // nav bar
    ctx.fillStyle = "#515151";
    ctx.fillRect(0, cSCREEN_HEIGHT-cNAV_HEIGHT, cSCREEN_WIDTH, cNAV_HEIGHT);

    all_text_input_boxes.forEach((item) => {
      item.draw(scene);
    });

    all_buttons.forEach((item) => {
      item.draw(scene);
    });
}

console.log("Running");
let game = setInterval(draw, 20);