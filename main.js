let myGameArea = {
	canvas: document.createElement("canvas"),
  start: function() {
  	this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
    window.addEventListener('keydown', function(e) {
    	myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = true;
    });
    window.addEventListener('keyup', function(e) {
    	myGameArea.keys[e.keyCode] = false;
    });
    this.frameNo = 0;  
      /*
  	//when you want to move with mouse
    window.addEventListener('mousemove', function (e) {
      myGameArea.x = e.pageX;
      myGameArea.y = e.pageY;
    })
    //when you move to move object via touch screen
    window.addEventListener('touchmove', function (e) {
      myGameArea.x = e.touches[0].screenX;
      myGameArea.y = e.touches[0].screenY;
    })
    */
  },
  clear: function() {
  	this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
  }
}

let myGamePiece;
let myObstacles = [];
let myScore = 0;
let mySound;

function moveup() {
  myGamePiece.speedY = -1;
}
function movedown() {
  myGamePiece.speedY = 1;
}
function moveleft() {
  myGamePiece.speedX = -1;
}
function moveright() {
  myGamePiece.speedX = 1;
}

function stopMove() {
	myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}

function updateGameArea() {
 
    mySound1.play();
	var x, y;
  for (i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
	    mySound.play();
      myGameArea.stop();
      return;
    }
  }
  myGameArea.clear();
  myGameArea.frameNo += 1;
  if (myGameArea.frameNo == 1 || everyinterval(150)) {
    x = myGameArea.canvas.width;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
    minGap = 50;
    maxGap = 200;
    gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
    myObstacles.push(new component(10, height, "green", x, 0));
    myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
  }
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }
  myScore.text = "SCORE: " + myGameArea.frameNo;
  myScore.update();

  
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {
      myGamePiece.speedX = -1; 
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
      myGamePiece.speedX = 1; 
    }
    if (myGameArea.keys && myGameArea.keys[38]) {
      myGamePiece.speedY = -1; 
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
      myGamePiece.speedY = 1; 
    }
    /*
    //when you want to move with mouse or touchmove
    if (myGameArea.x && myGameArea.y) {
      myGamePiece.x = myGameArea.x;
      myGamePiece.y = myGameArea.y;
    }
    */
    
    myGamePiece.newPos();
    myGamePiece.update();
  
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
    
  }
  this.stop = function(){
    this.sound.pause();
  }
}

function component(width, height, color, x, y, type) {
	this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.type = type;
  
  this.update = function() {
  	ctx = myGameArea.context;
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  this.newPos = function() {
  	this.x += this.speedX;
    this.y += this.speedY;
//    console.log(this.x, this.y, this.speedX, this.speedY);
  },
  this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) ||
    (mytop > otherbottom) ||
    (myright < otherleft) ||
    (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}

function start() {
	myGameArea.start();
  myGamePiece = new component(30, 30, "red", 10, 120);
  myScore = new component("30px", "Arial", "black", 280, 40, "text");
  mySound = new sound("http://commondatastorage.googleapis.com/codeskulptor-assets/Evillaugh.ogg");
  mySound1 = new sound("http://commondatastorage.googleapis.com/codeskulptor-assets/Epoq-Lepidoptera.ogg");
}

start();
//https://simpleguics2pygame.readthedocs.io/en/latest/_static/links/snd_links.html.

