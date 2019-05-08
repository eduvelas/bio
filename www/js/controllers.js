angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
	var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
// canvas.height = canvas.width = size = 512;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.cssText = "width:"+ canvas.width +"px,height:"+ canvas.height +"px"; 
var targets = [];
var R = canvas.width/20;
var ii = 10;
var r = R/ii/5*3;
var deg = Math.PI/(ii*2);
var rotate_speed = deg/15;
var distance = r*4;
var lineWidth = 1;
var num = Math.floor(canvas.height/distance*0.7);
var offsetX = canvas.width/2;
var offsetY = canvas.height/2 - num*distance/2;
var color = "#2ae";

for(var i=0; i<num; i++){
	targets.push(deg*i);
	targets.push(i*distance);
}

function reset(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.style.cssText = "width:"+ canvas.width +"px,height:"+ canvas.height +"px"; 
	targets = [];
	R = canvas.width/60;
	r = R/ii/4*3;
	distance = r*4;
	num = Math.floor(canvas.height/distance*0.7);
	offsetX = canvas.width/2;
	offsetY = canvas.height/2 - num*distance/2;
	
	for(var i=0; i<num; i++){
		targets.push(deg*i);
		targets.push(i*distance);
	}
}

function transformPos(deg){
	var x = Math.sin(deg) * R;
	// var y = Math.cos(deg) * r +r;
	return { x: x }
}

function draw(){
	ctx.beginPath();
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = color;
	ctx.fillStyle = color;
	for (var i = 0; i<targets.length; i+=2) {
		var pos = transformPos( targets[i] );
		var y = offsetY + targets[i+1];
		ctx.moveTo( pos.x + offsetX, y);
		ctx.lineTo(-pos.x + offsetX, y);
		ctx.moveTo( pos.x + offsetX, y);
		ctx.arc(    pos.x + offsetX, y, r, 0, Math.PI*2);
		ctx.moveTo(-pos.x + offsetX, y)
		ctx.arc(   -pos.x + offsetX, y, r, 0, Math.PI*2);
	}
	ctx.stroke();
	ctx.fill();
	ctx.closePath()
}

function cleanUp(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
}

function update(){
	for(var i=0; i<targets.length; i+=2){
		targets[i] += rotate_speed;
		if( targets[i] >= Math.PI) { targets[i] -= Math.PI; }
	}
}

window.addEventListener("resize",reset);

function Animat(){
	cleanUp();
	draw();
	update();
	setTimeout(Animat,1000/60);
}
Animat();
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})
//---------------------------------------juego---------------------------------------//
.controller('JuegoCtrl', function($scope){
	const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;

    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');

    resetBoard();
  }, 1500);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

(function shuffle() {
  cards.forEach(card => {
    let randomPos = Math.floor(Math.random() * 12);
    card.style.order = randomPos;
  });
})();

cards.forEach(card => card.addEventListener('click', flipCard));

});

