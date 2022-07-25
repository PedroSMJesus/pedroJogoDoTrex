var PLAY = 1
var END = 0;
var gameState = PLAY;

var trex ,trex_running, trexDead;
var ground;
var cloud, cloud_img;
var cacto1,cacto1_img;
var cacto2, cacto2_img;
var cacto3, cacto3_img;
var cacto4, cacto4_img;
var cacto5, cacto5_img;
var cacto6, cacto6_img;
var groundImage;
var invisibleGround;
var gameOver, gameOver_img;
var restart, restart_img;
var checkPointSound;
var dieSound;
var jumpSound;

function preload(){
  //carregar imagens
trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
groundImage = loadImage("ground2.png");
cacto1_img= loadImage("obstacle1.png");
cacto2_img= loadImage("obstacle2.png");
cacto3_img = loadImage ("obstacle3.png");
cacto4_img = loadImage ("obstacle4.png");
cacto5_img = loadImage ("obstacle5.png");
cacto6_img = loadImage ("obstacle6.png");
cloud_img = loadImage ("cloud.png");
gameOver_img = loadImage("gameOver.png");
restart_img = loadImage("restart.png");
trexDead = loadAnimation ("trex_collided.png");
//carregar sons
checkPointSound = loadSound ("checkpoint.mp3");
jumpSound = loadSound ("jump.mp3");
dieSound = loadSound ("die.mp3");
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  
//crie um sprite de trex
 trex= createSprite(50,height-70,20,50);
 trex.addAnimation("running",trex_running);
 trex.addAnimation ("collided", trexDead);
 trex.scale= 0.3;
 trex.x=50;

//criar solo
 ground= createSprite(width/2,height-75,width,125);
 ground.addImage("ground",groundImage);
 ground.x = ground.width/2;

//criar gameOver
 gameOver = createSprite (650,height-300);
 gameOver.addImage("end",gameOver_img);
 gameOver.scale= 0.5;
 gameOver.visible = false;

//criar restart
 restart = createSprite(650, height-340);
 restart.addImage("reinicio",restart_img);
 restart.scale = 0.6;
 restart.visible = false;
 

//criar solo invisivel
 invisibleGround = createSprite(width/2,height-10,width,125);
 invisibleGround.visible = false;

//matematica
var rand = Math.round(random(1,100));
console.log(rand);


//criando novos grupos
obstaclesGroup = new Group();
cloudsGroup = new Group();

//console.log("olá" + "mundo");

//colisão
trex.setCollider("circle",0,0,35);
trex.debug = false;
//pontos
score= 0;
}

function draw(){
background("black")

//exibir pontos
textSize(15)
stroke("gray")
text("Pontuação:"+score,width-140,50);
   
//console.log("isto" + "é", gameState)

if (gameState === PLAY) {
//movimento
ground.velocityX = -(2 + 3* score/100);

//pontos
score= score + Math.round(getFrameRate()/60);

if (score>0 && score%100 === 0) {
  checkPointSound.play()
}

//chão infinito (mas ou menos) ;-;
 if (ground.x<0) {
  ground.x = ground.width/2;
}

//fazer o trex pular
 if (touches.length > 0 ||keyDown("up") && trex.y>=height-150) {
  trex.velocityY = -10;
  jumpSound.play();
  touches = [];
}
 trex.velocityY = trex.velocityY+1;

//gerar obstaculos e nuvens
 spawClouds();
 spawObstacle();
  
//toque mortal
 if (obstaclesGroup.isTouching(trex)) {
  gameState = END;
  dieSound.play();
}

} else if (gameState === END) {
//parar o tempo
  ground.velocityX = 0;
  obstaclesGroup.setVelocityXEach(0);
  cloudsGroup.setVelocityXEach(0);
 obstaclesGroup.setLifetimeEach(-1);
 cloudsGroup.setLifetimeEach(-1);

//morte
  trex.changeAnimation("collided", trexDead);
  trex.velocityY = 0;

//game over e restart
  gameOver.visible= true;
  restart.visible = true;

  if (mousePressedOver(restart)) {
// console.log("Reiniciar o jogo");
reset();
}
} 
 
  console.log(ground.x);
  
//colisões
trex.collide(invisibleGround);
edges = createEdgeSprites();
 
 
 
 drawSprites();
}

//função para gerar as nuvens
function spawClouds() {
  if (frameCount % 60 === 0) {
    //criar nuvens
    cloud= createSprite(width,Math.round(random(200,450)),20,50);
cloud.addImage("cenario",cloud_img);
cloud.scale= 0.9;
cloud.velocityX=-3;
 //atribua tempo de vida à variável  
 cloud.lifetime = 500;  
 //ajuste a profundidade 
 cloud.depth = trex.depth; 
 trex.depth = trex.depth + 1; 
 //adicionar nuvens ao grupo 
 cloudsGroup.add(cloud);
  }

}
  
// função para gerar obstaculos
function spawObstacle (params) {
  if (frameCount % 80 === 0) {
    var obstacle = createSprite(width,height-93,20,50);
    obstacle.velocityX= -(5 +  score/100);
  obstacle.scale=0.6;
  obstacle.lifetime= 500; 
  obstacle.depth = trex.depth; 
  trex.depth = trex.depth + 1;
var rand = Math.round(random(1,6));
switch (rand) {
  case 1: obstacle.addImage(cacto1_img);
   break;
   case 2: obstacle.addImage(cacto2_img);
break;
case 3: obstacle.addImage(cacto3_img);
break;
case 4: obstacle.addImage(cacto4_img);
break;
case 5: obstacle.addImage(cacto5_img);
break;
case 6: obstacle.addImage(cacto6_img);
break;
  default:
    break;
}
obstaclesGroup.add(obstacle);
  }
}

//reiniciar
function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running",trex_running);
  score = 0;
}