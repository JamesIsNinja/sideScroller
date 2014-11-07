var stage: createjs.Stage;
var queue;

// game objects
var goku: Goku;
var dragonBall: DragonBall;
var bullets = [];
var sky: Sky;
var scoreboard: Scoreboard;
var gameLost: gameLose;
var score: number;

//New
// game constants
var CLOUD_NUM: number = 7;
var PLAYER_LIVES: number = 5;
var GAME_FONT = "40px Impact";
var FONT_COLOUR = "#FF0000";
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
    createjs.Sound.play("BG");
}

function init(): void {
    stage = new createjs.Stage(document.getElementById("canvas"));
    optimizeForMobile();
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", gameLoop);
    gameStart();
    
}
// Add touch support for mobile devices
function optimizeForMobile() {
    if (createjs.Touch.isSupported()) {
        createjs.Touch.enable(stage);
    }
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
    updateX() {
        this.image.x = 7000;
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
        this.image.x = 800;
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
        this.labelString = "Lives: " + this.lives.toString() + " D Balls: " + score.toString(); 
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
        score += 1;
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
class gameLose {
    label: createjs.Text;
    label2: createjs.Text;
    labelString: string = "GAME OVER";
    labelString2: string = "SCORE: " + score.toString();
    width: number;
    height: number;
    width2: number;
    height2: number;
    constructor() {
        this.label = new createjs.Text(this.labelString, GAME_FONT, FONT_COLOUR);

        this.width = this.label.getBounds().width;
        this.height = this.label.getBounds().height;
        this.label2 = new createjs.Text(this.labelString2, GAME_FONT, FONT_COLOUR);
        this.width2 = this.label.getBounds().width;
        this.height2 = this.label.getBounds().height;
        var playButton = new createjs.Bitmap("images/startPU.png");
        stage.addChild(playButton);
        playButton.x = 150;
        playButton.y = 300;
        playButton.addEventListener("click", playButtonClicked);
        stage.addChild(this.label);
        this.label.x = 225;
        this.label.y = 0;
        stage.addChild(this.label2);
        this.label2.x = 240;
        this.label2.y = 50;
        stage.update();
    }
}
function menu() {
    // Instantiate Game Objects
    sky = new Sky();

    // Show Cursor
    stage.cursor = "default";

     gameLost = new gameLose();


}

function playButtonClicked(event: MouseEvent) {

    stage.removeAllChildren();
    stage.removeAllEventListeners();
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", gameLoop);
    gameStart();

}

function gameStart(): void {
    sky = new Sky();
    dragonBall = new DragonBall();
    goku = new Goku();
    stage.cursor = "none";
    score = 0;

    for (var count = 0; count < CLOUD_NUM; count++) {
        bullets[count] = new Bullet();
    }
    
    scoreboard = new Scoreboard(); 
    stage.update();
    
}  



function gameOver(): void {
    stage.cursor = "default";
    createjs.Sound.stop();
    stage.clear();
    createjs.Sound.play("BG");
    goku.updateX();
    sky = new Sky();
    gameLost = new gameLose();
    stage.update();
}