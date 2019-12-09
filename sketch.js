var audio = new Audio('https://raw.githubusercontent.com/tiara28307/CS-3366-P2-Group-11/master/01%20-%20Title%20Theme.mp3');
audio.play();
var beep = new Audio('beep.mp3');
var boop = new Audio('boop.wav');
var badScore = new Audio('badScore.wav');
var score = new Audio('score.wav');
var cOn = new Audio('cameraon.wav');
var cOff = new Audio('cameraOff.wav');
var winS = new Audio('win.wav');
var looseS = new Audio('loose.wav');

setVolume(0);
function setVolume(num){
  beep.volume = num;
  boop.volume = num;
  score.volume = num;
  badScore.volume = num;
  cOn.volume = num;
  cOff.volume = num;
  winS.volume = num;
  looseS.volume = num;
}


function cameraOn(){
  audio.play();
  setVolume(1);
}

function cameraOff(){
  audio.pause();
  setVolume(0);
}

const video = document.getElementById("myvideo");
const canvas2 = document.getElementById("canvas2");
const context2 = canvas2.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let imgindex = 1
let isVideo = false;
let model = null;
let videoInterval = 300
var where;
var keysDown = {};

// video.width = 500
// video.height = 400


const modelParams = {
    flipHorizontal: true, // flip e.g for video  
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
}

function stopVideo() {
    handTrack.stopVideo(video).then(function (status) {
        console.log("video stopped", status);
        if (status) {
            isVideo = false;
            runDetection()
            cOff.play();
        } else {
            updateNote.innerText = "Video Stopped Running"
            cOff.play();
        }
    });
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            isVideo = true;
            runDetection()
            cOn.play();
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}


function runDetection() {
    model.detect(video).then(predictions => {
        // console.log("Predictions: ", predictions);
        // get the middle x value of the bounding box and map to paddle location
        model.renderPredictions(predictions, canvas2, context2, video);
        if (predictions[0]!=null) {
            let midval = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2)
            gamex = document.body.clientWidth * (midval / video.width)
          where = gamex;
            console.log('Predictions: ', gamex);
          if(gamex>440){
            delete keysDown[39];
              keysDown[39] = true;
            delete keysDown[37];
            console.log(keysDown);
          }
          else{
            delete keysDown[39];
          }
          if(gamex<230){
              keysDown[37] = true;
            delete keysDown[39];
          }
          else{
            delete keysDown[37];
          }
                  }
      else{
        delete keysDown[39];
        delete keysDown[37];
      
      }
        if (isVideo) {
            setTimeout(() => {
                runDetection(video)
            }, videoInterval);
        }
    });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    trackButton.disabled = false

    $(".overlaycenter").animate({
        opacity: 0,
        fontSize: "0vw"
    }, pauseGameAnimationDuration, function () {
        $(".pauseoverlay").hide()
    });
});


var Playerscore = 0;
var CPUscore = 0;
var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

var canvas = document.createElement('canvas');
var width = 600;
var height = 600;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');


window.onload = function() {
  document.body.appendChild(canvas);
  animate(step);
  
};

var step = function() {
  update();
  render();
  if(CPUscore > 4)
    {
      audio.pause();
      context.font = "60px Black Ops One";
      context.fillStyle = "#00E500";
      context.fill();
      context.fillText("CPU WINS! ", 130, 325);
      looseS.play();
    }
  else if (Playerscore > 2)
  {
    audio.pause();
    context.font = "60px Black Ops One";
    context.fillStyle = "#00E500";
    context.fill();
    context.fillText("PLAYER WINS! ", 130, 295);  
    winS.play();
  }
  else
  {
  animate(step);
  }
};

var update = function() {
};

var render = function() {
  context.fillStyle = "#676767";
  context.fillRect(0, 0, width, height);
};


function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function() {
  context.fillStyle = "#10bfea";
  context.fillRect(this.x, this.y, this.width, this.height);
};

function Player() {
   this.paddle = new Paddle(175, 580, 60, 15);
}

function Computer() {
  this.paddle = new Paddle(175, 10, 60, 15);
}

Player.prototype.render = function() {
  this.paddle.render();
};

Computer.prototype.render = function() {
  this.paddle.render();
};

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 0;
  this.y_speed = 3;
  this.radius = 6.5;
}

Ball.prototype.render = function() {
  context.beginPath();
  context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  //Score keeping for Players
  context.font = "40px Black Ops One";
  context.fillStyle = "#00E500";
  context.fill();
  context.fillText("Score ", 438, 290);
  context.font = "25px Black Ops One";
  context.fillStyle = "#0080FF";
  context.fill();
  context.fillText("Player: "+ Playerscore, 438, 340);
  context.fillStyle = "#FF0000";
  context.fill();
  context.fillText("CPU: "+ CPUscore, 438, 380);
  context.fillStyle = "#00E500";
  context.fill();
};

var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

var render = function() {
  context.fillStyle = "#676767";
  context.fillRect(0, 0, width, height);
  if(CPUscore > 4 || Playerscore > 2)
  {
    var button = document.createElement("BUTTON");   // Create a <button> element
    button.innerHTML = "PLAY AGAIN";  // Insert text
    button.style = "#0080FF";
    button.id = "gameoverbtn";
    document.body.appendChild(button);
    button.addEventListener ("click", function() {
    document.location.reload(true);
  });  
  }
  else
  {
      player.render();
      computer.render();
      ball.render();
  }
};

var update = function() {
  ball.update();
};

Ball.prototype.update = function() {
  this.x += this.x_speed;
  this.y += this.y_speed;
};

var update = function() {
  ball.update(player.paddle, computer.paddle);
};

Ball.prototype.update = function(paddle1, paddle2) {
  this.x += this.x_speed;
  this.y += this.y_speed;
  var top_x = this.x - 5;
  var top_y = this.y - 5;
  var bottom_x = this.x + 5;
  var bottom_y = this.y + 5;

  if(this.x - 5 < 0) { // hitting the left wall
    this.x = 5;
    this.x_speed = -this.x_speed;
  } else if(this.x + 5 > 400) { // hitting the right wall
    this.x = 395;
    this.x_speed = -this.x_speed;
  }

  // Score tracker for player
  if(this.y < 0) {
    score.play();
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = 200;
    this.y = 300;
    Playerscore++;
  }
  // Score tracker for CPU
  if(this.y > 600) { 
    badScore.play();
    this.x_speed = 0;
    this.y_speed = 3;
    this.x = 200;
    this.y = 300;
    CPUscore++;
  }

  if(top_y > 300) {
    if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
      // hit the player's paddle
      beep.play();
      this.y_speed = -3;
      this.x_speed += (paddle1.x_speed / 2);
      this.y += this.y_speed;
    }
  } else {
    if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
      // hit the computer's paddle
      boop.play();
      this.y_speed = 3;
      this.x_speed += (paddle2.x_speed / 2);
      this.y += this.y_speed;
    }
  }
};

var keysDown = {};

window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
});

var update = function() {
  player.update();
  ball.update(player.paddle, computer.paddle);
};

Player.prototype.update = function() {
  for(var key in keysDown) {
    var value = Number(key);
    if(value == 37) { // left arrow
      this.paddle.move(-4, 0);
    } else if (value == 39) { // right arrow
      this.paddle.move(4, 0);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

Paddle.prototype.move = function(x, y) {
  this.x += x;
  this.y += y;
  this.x_speed = x;
  this.y_speed = y;
  if(this.x < 0) { // all the way to the left
    this.x = 0;
    this.x_speed = 0;
  } else if (this.x + this.width > 400) { // all the way to the right
    this.x = 400 - this.width;
    this.x_speed = 0;
  }
}

var update = function() {
  player.update();
  computer.update(ball);
  ball.update(player.paddle, computer.paddle);
};

Computer.prototype.update = function(ball) {
  var x_pos = ball.x;
  var diff = -((this.paddle.x + (this.paddle.width / 2)) - x_pos);
  if(diff < 0 && diff < -4) { // max speed left
    diff = -5;
  } else if(diff > 0 && diff > 4) { // max speed right
    diff = 5;
  }
  this.paddle.move(diff, 0);
  if(this.paddle.x < 0) {
    this.paddle.x = 0;
  } else if (this.paddle.x + this.paddle.width > 400) {
    this.paddle.x = 400 - this.paddle.width;
  }
};
