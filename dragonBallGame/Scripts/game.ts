var stage: createjs.Stage;
var queue;

// game objects
var goku: Goku;
var dragonBall: DragonBall;
var bullets = [];
var sky: Sky;
var scoreboard: Scoreboard;
//New
// game constants
var CLOUD_NUM: number = 7;
var PLAYER_LIVES: number = 5;
var GAME_FONT = "40px Consolas";
var FONT_COLOUR = "#FFFF00";
var startUN = new createjs.Bitmap("images/startUN.png");
var startPU = new createjs.Bitmap("images/startPU.png");
// Preload function
function preload(): void {
    queue = new createjs.LoadQueue();
    queue.installPlugin(createjs.Sound);
    queue.addEventListener("complete", init);
    queue.loadManifest([
        { id: "goku", src: "images/Goku.png" },
        { id: "dragonBall", src: "images/DragonBall.png" },
        { id: "bullet", src: "images/Bullet.png" },
        { id: "sky", src: "images/Sky2.jpg" },
        { id: "yea", src: "sounds/Yea.mp3" },
        { id: "grunt", src: "sounds/Goku Grunt.mp3" },
        { id: "BG", src: "sounds/BG.mp3" }
    ]);
}

function init(): void {
    stage = new createjs.Stage(document.getElementById("canvas"));
    createjs.Sound.play("BG");
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", gameLoop);
    loading();
    gameStart();
    
}
// Game Loop
function gameLoop(event): void {
    sky.update();
    dragonBall.update();
    goku.update();
    for (var count = 0; count < CLOUD_NUM; count++) {
            bullets[count].update();
    }
    collisionCheck();
    scoreboard.update();
    stage.update();
}

function loading(): void {
    var load = 0;
    var labelString: string = load.toString();
    this.label = new createjs.Text(this.labelString, GAME_FONT, FONT_COLOUR);
    setTimeout(function () {
        stage.update();
    }, 400);
}

// Plane Class
class Goku {
    image: createjs.Bitmap;
    width: number;
    height: number;
    constructor() {
        createjs.Sound.play("BG");
        this.image = new createjs.Bitmap(queue.getResult("goku"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regY = this.width * 0.5;
        this.image.regX = this.height * 0.5;
        this.image.x = 30;
        stage.addChild(this.image);
    }
    update() {
        this.image.y = stage.mouseY;
    }
}

// Island Class
class DragonBall {
    image: createjs.Bitmap;
    width: number;
    height: number;
    dy: number;
    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("dragonBall"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        this.dy = 5;
        stage.addChild(this.image);
        this.reset();
    }

    reset() {
        this.image.x = 620;
        this.image.y = Math.floor(Math.random() * stage.canvas.width);
    }

    update() {
        this.image.x -= this.dy;
        if (this.image.x < (this.width - stage.canvas.width)) {
            this.reset();
        }
       
    }
}

// Island Class
class Bullet {
    image: createjs.Bitmap;
    width: number;
    height: number;
    dy: number;
    dx: number;
    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("bullet"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;

        stage.addChild(this.image);
        this.reset();
    }

    reset() {
        this.image.x = 600;
        this.image.y = Math.floor(Math.random() * stage.canvas.width);
        this.dx = Math.floor(Math.random() * 5 + 5);
        this.dy = Math.floor(Math.random() * 4 - 2);
    }

    update() {
        this.image.y += this.dy;
        this.image.x -= this.dx;
        if (this.image.x < (this.width - stage.canvas.width)) {
            
            this.reset();
        }

    }
}

// Ocean Class
class Sky {
    image: createjs.Bitmap;
    width: number;
    height: number;
    dx: number;
    constructor() {
        this.image = new createjs.Bitmap(queue.getResult("sky"));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.dx = 5;
        stage.addChild(this.image);
        this.reset();
    }

    reset() {
        this.image.x = -this.width + stage.canvas.width;
    }

    update() {
        this.image.x += this.dx;
        if (this.image.x >= 0) {
            this.reset();
        }

    }
}

// Scoreboard Class
class Scoreboard {
    label: createjs.Text;
    labelString: string = "";
    lives: number = PLAYER_LIVES;
    score: number = 0;
    width: number;
    height: number;
    constructor() {
        this.label = new createjs.Text(this.labelString, GAME_FONT, FONT_COLOUR);
        this.update();
        this.width = this.label.getBounds().width;
        this.height = this.label.getBounds().height;

        stage.addChild(this.label);
    }

    update() {
        this.labelString = "Lives: " + this.lives.toString() + " D Balls: " + this.score.toString(); 
        this.label.text = this.labelString;
    }
}

function distance(point1: createjs.Point, point2: createjs.Point):number {
    var p1: createjs.Point;
    var p2: createjs.Point;
    var theXs: number;
    var theYs: number;
    var result: number;

    p1 = new createjs.Point();
    p2 = new createjs.Point();

    p1.x = point1.x;
    p1.y = point1.y;
    p2.x = point2.x;
    p2.y = point2.y;

    theXs = p2.x - p1.x;
    theYs = p2.y - p1.y;

    theXs = theXs * theXs;
    theYs = theYs * theYs;

    result = Math.sqrt(theXs + theYs);

    return result;
}

// Check Collision with Plane and Island
function gokuAndDragonBall() {
    var p1: createjs.Point = new createjs.Point();
    var p2: createjs.Point = new createjs.Point();

    p1.x = goku.image.x;
    p1.y = goku.image.y;
    p2.x = dragonBall.image.x;
    p2.y = dragonBall.image.y;

    if (distance(p1, p2) <= ((goku.height * 0.5) + (goku.height * 0.5))) {
        createjs.Sound.play("yea");
        scoreboard.score += 1;
        dragonBall.reset();
    }
}

// Check Collision with Plane and Cloud
function gokuAndBullet(theBullet: Bullet) {
    var p1: createjs.Point = new createjs.Point();
    var p2: createjs.Point = new createjs.Point();
    p1.x = goku.image.x;
    p1.y = goku.image.y;
    p2.x = theBullet.image.x;
    p2.y = theBullet.image.y;

    if (distance(p1, p2) <= ((goku.height * 0.5) + (goku.height * 0.5))) {
        createjs.Sound.play("grunt");
        scoreboard.lives -= 1;
        if (scoreboard.lives == 0) {
            //GO TO GAME OVER
            console.log("YOU LOSE");
            gameOver();
        }
        theBullet.reset();
    }
}

function collisionCheck() {
    gokuAndDragonBall();

    for (var count = 0; count < CLOUD_NUM; count++) {
        gokuAndBullet(bullets[count]);
    }
}

function gameStart(): void {
    sky = new Sky();
    dragonBall = new DragonBall();
    goku = new Goku();

    for (var count = 0; count < CLOUD_NUM; count++) {
        bullets[count] = new Bullet();
    }
    
    scoreboard = new Scoreboard(); 
    
}  



function gameOver(): void {
    stage.removeAllChildren();
    sky = new Sky();
    label: createjs.Text;
    var label = new createjs.Text("Hello", GAME_FONT, FONT_COLOUR);
    this.update();
    stage.addChild(label);
    label.x = 350;
    label.y = 200;
    stage.addChild(startUN);
    startUN.x = 350;
    startUN.y = 350;
    stage.update();
}