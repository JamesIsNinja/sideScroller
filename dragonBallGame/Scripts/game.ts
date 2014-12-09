/**
File: game.ts
Author: James White, 200203355
Version History: Finished game
Last Modified by: James
Date last Miodified: December 7th
Purpose: A side scroller shooter game final, complete with 3 levels, new enemies, and more difficulty as you progress
*/
//create stage
var stage: createjs.Stage;
var queue;
var shootLabel;
// game objects
var goku: Goku;
var dragonBall: DragonBall;
var bullets = [];
var sky: Sky;
var kamehameha: Kamehameha;
var scoreboard: Scoreboard;
var gameLost: gameLose;
var Menu: menuUI; 
var instruct: insructions;
var score: number;
var level: number;
level = 1;
// game constants
var CLOUD_NUM: number = 4;
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
        { id: "adultGoku", src: "images/Goku2.png" },
        { id: "SSGoku", src: "images/Goku3.png" },
        { id: "goku3Shot", src: "images/Goku3Shot.png" },
        { id: "piccolo", src: "images/Piccolo.png" },
        { id: "vegeta", src: "images/Vegeta.png" },
        { id: "gokuShot", src: "images/GokuShot.png" },
        { id: "dragonBall", src: "images/DragonBall.png" },
        { id: "bullet", src: "images/Bullet.png" },
        { id: "bullet2", src: "images/Bullet2.png" },
        { id: "sky", src: "images/Sky2.jpg" },
        { id: "sky2", src: "images/Sky3.jpg" },
        { id: "sky3", src: "images/Sky4.png" },
        { id: "yea", src: "sounds/Yea.mp3" },
        { id: "grunt", src: "sounds/Goku Grunt.mp3" },
        { id: "BG", src: "sounds/BG1.mp3" },
        { id: "kamehamehaSound", src: "sounds/KAMEHAMEHA.mp3" },
        { id: "explode", src: "sounds/Explode.mp3" },
        { id: "vegetaDeath", src: "sounds/VegataKill.mp3" },
        { id: "SStrans", src: "sounds/SSTransform.mp3" },
        { id: "9000", src: "sounds/ItsOver9000.mp3" },
        { id: "Level2Theme", src: "sounds/Level2Theme.mp3" },
        { id: "Level3Theme", src: "sounds/BattleWithAllMyForce.mp3" },
        { id: "start", src: "images/startUN.png" },
        { id: "instruction", src: "images/instruct.png" },
        { id: "back", src: "images/back.png" }
    ]);   
}
//Initiate fucntion
function init(): void {
    stage = new createjs.Stage(document.getElementById("canvas"));
    optimizeForMobile();
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60);
    menu();
    stage.addEventListener("click", shoot);

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
    kamehameha.update();
    for (var count = 0; count < CLOUD_NUM; count++) {
            bullets[count].update();
    }
    collisionCheck();
    scoreboard.update();
    stage.update();
}

// Goku Class
class Goku {
    image: createjs.Bitmap;
    width: number;
    height: number;
    constructor(type: string) {
        this.image = new createjs.Bitmap(queue.getResult(type));
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

// Dragonball Class
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
// enemy Class
class Bullet {
    image: createjs.Bitmap;
    width: number;
    height: number;
    dy: number;
    sound: string;
    dx: number;
    constructor(enemy :string, soundClip: string) {
        this.image = new createjs.Bitmap(queue.getResult(enemy));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        this.image.name = enemy;
        this.sound = soundClip;
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
    playSound() {
        return this.sound;

    }
}
// KAMEHAAAMEEEEHAAAAAAAAA Class
class Kamehameha {
    image: createjs.Bitmap;
    width: number;
    height: number;
    dy: number;
    dx: number;
    constructor(attack: string) {
        this.image = new createjs.Bitmap(queue.getResult(attack));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.image.regX = this.width * 0.5;
        this.image.regY = this.height * 0.5;
        this.image.x = goku.image.x;
        this.dx = 10;

    }
    update() {
        if (level >= 2) {
            this.image.x += this.dx;
            stage.removeEventListener("click", shoot);
            if (this.image.x > stage.canvas.width) {
                stage.removeChild(this.image);
                stage.addEventListener("click", shoot);
            }
        }
    }
    reset() {
        stage.removeChild(this.image);

    }
    add() {
        this.image.x = goku.image.x;
        stage.addChild(this.image);   
        createjs.Sound.play("kamehamehaSound");
   
    }
}

// Sky Class
class Sky {
    image: createjs.Bitmap;
    width: number;
    height: number;
    dx: number;
    constructor(image: string) {
        this.image = new createjs.Bitmap(queue.getResult(image));
        this.width = this.image.getBounds().width;
        this.height = this.image.getBounds().height;
        this.dx = -5;
        stage.addChild(this.image);
        this.reset();
    }

    reset() {
        this.image.x = 0;
    }

    update() {
        this.image.x += this.dx;
        if (this.image.x <= -1375) {
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
        if (level == 1) {
            this.labelString = "| Lives: " + this.lives.toString() + " | Dragon Balls: " + score.toString() + " | ";
            this.label.text = this.labelString;
        }
        if (level == 2) {
            this.labelString = "| Lives: " + this.lives.toString() + " | Dragon Balls: " + score.toString() + " |";
            this.label.text = this.labelString;

        }
    }
}
//Check distance from objects, moms spaghetti
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

// Check Collision with goku and enemy
function gokuAndDragonBall() {
    var p1: createjs.Point = new createjs.Point();
    var p2: createjs.Point = new createjs.Point();

    p1.x = goku.image.x;
    p1.y = goku.image.y;
    p2.x = dragonBall.image.x;
    p2.y = dragonBall.image.y;

    if (distance(p1, p2) <= ((goku.height * 0.5) + (goku.height * 0.5))) {
        createjs.Sound.play("yea", "none", 0, 0, 0, 0.1, 0);
        score += 1;
        dragonBall.reset();
        if (score == 1 && level == 1) {
            level = level + 1;

            levelUp("adultGoku", "Level2Theme", "sky2", "gokuShot");
            createjs.Sound.play("9000");
        }
        else if (score == 2 && level == 2) {
            level = level + 1;

            levelUp("SSGoku", "Level3Theme", "sky3", "goku3Shot");
            createjs.Sound.play("SStrans");

        }
    }
}

//Check Collision with goku and bullet
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

//Check Collision with goku and bullet
function gokuShotAndBullet(theBullet: Bullet) {
    var p1: createjs.Point = new createjs.Point();
    var p2: createjs.Point = new createjs.Point();
    p1.x = kamehameha.image.x;
    p1.y = kamehameha.image.y;
    p2.x = theBullet.image.x;
    p2.y = theBullet.image.y;

    if (distance(p1, p2) <= ((kamehameha.height * 0.5) + (kamehameha.height * 0.5))) {
        var sound: string;
       
        sound = theBullet.playSound();
        console.log(sound);
        createjs.Sound.play(sound);

        theBullet.reset();
        kamehameha.image.x = 900;
    }
}
//Check for collisions
function collisionCheck() {
    gokuAndDragonBall();

    for (var count = 0; count <CLOUD_NUM; count++) {
        gokuAndBullet(bullets[count]);
        gokuShotAndBullet(bullets[count]);
    }
}
//The game over screen
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
        var playButton = new createjs.Bitmap("images/playagain.png");
        stage.addChild(playButton);
        playButton.x = 150;
        playButton.y = 300;
        playButton.addEventListener("click", playButtonClicked);
        stage.addChild(this.label);
        this.label.x = 225;
        this.label.y = 20;
        stage.addChild(this.label2);
        this.label2.x = 240;
        this.label2.y = 70;
        stage.update();
    }

}

//The menu screen UI
class menuUI {
    label: createjs.Text;
    label2: createjs.Text;
    labelString: string = "DRAGON BALL GAME";
    labelString2: string = ("INSTRUCTIONS");
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
        var playButton = new createjs.Bitmap("images/startUN.png");
        var instruct = new createjs.Bitmap("images/instruct.png");
        instruct.addEventListener("click", instructionsClicked);
        instruct.x = 200;
        instruct.y = 180;
        stage.addChild(playButton);
        playButton.x = 150;
        playButton.y = 300;
        playButton.addEventListener("click", playButtonClicked);
        stage.addChild(this.label);
        this.label.x = 160;
        this.label.y = 20;
        stage.addChild(instruct);
        stage.addChild(instruct);
        stage.addChild(playButton);
        stage.update();
    }
}
//Run menu
function menu() {
    // Instantiate Game Objects
    stage.cursor = "default";
    createjs.Sound.stop();
    stage.clear();
    createjs.Sound.play("BG");
    Menu = new menuUI();
    sky = new Sky("sky");
    Menu = new menuUI();
    stage.update();
}
//the instructions page
class insructions {
    label: createjs.Text;
    label2: createjs.Text;
    label3: createjs.Text;
    label4: createjs.Text;
    labelString: string = "INSTRUCTIONS";
    labelString2: string = "Move the mouse up and down to ";
    labelString3: string = "move goku, dodge the kai blasts,";
    labelString4: string = " collect the dragon balls!";
    width: number;
    height: number;
    width2: number;
    height2: number;
    constructor() {
        this.label = new createjs.Text(this.labelString, GAME_FONT, FONT_COLOUR);
        this.width = this.label.getBounds().width;
        this.height = this.label.getBounds().height;
        this.label2 = new createjs.Text(this.labelString2, GAME_FONT, FONT_COLOUR);
        this.label3 = new createjs.Text(this.labelString3, GAME_FONT, FONT_COLOUR);
        this.label4 = new createjs.Text(this.labelString4, GAME_FONT, FONT_COLOUR);
        this.width2 = this.label.getBounds().width;
        this.height2 = this.label.getBounds().height;
        var backButton = new createjs.Bitmap("images/back.png");
        stage.addChild(backButton);
        backButton.x = 250;
        backButton.y = 400;
        backButton.addEventListener("click", menu);
        stage.addChild(this.label);
        this.label.x = 195;
        this.label.y = 20;
        stage.addChild(this.label2);
        this.label2.x = 20;
        this.label2.y = 70;
        stage.addChild(this.label3);
        this.label3.x = 20;
        this.label3.y = 120;
        stage.addChild(this.label4);
        this.label4.x = 20;
        this.label4.y = 160;
        stage.update();
    }

}
//Run instructions page
function instructionsClicked(event: MouseEvent) {
    // Instantiate Game Objects
    stage.cursor = "default";
    createjs.Sound.stop();
    stage.clear();
    createjs.Sound.play("BG");
    instruct = new insructions();;
    sky = new Sky("sky");
    instruct = new insructions();
    stage.update();
}
//clear the game screen, then start the game!
function playButtonClicked(event: MouseEvent) {
    stage.removeAllEventListeners();
    stage.enableMouseOver(20);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", gameLoop);
    score = 0;
    levelUp("goku", "BG", "sky", "gokuShot");
}
//begins the game
function levelUp(type: string, music: string, background: string, shot: string): void {
    stage.removeAllChildren();
    createjs.Sound.stop();
    createjs.Sound.play(music,
        "none", 0, 0, 1, 0.2, 0);
    sky = new Sky(background);
    dragonBall = new DragonBall();
    goku = new Goku(type);
    stage.cursor = "none";
    createEnemies();
    kamehameha = new Kamehameha(shot);

    if (score == 7) {
        shootLabel = new createjs.Text("Click to shoot", GAME_FONT, FONT_COLOUR);
        shootLabel.x = 200;
        shootLabel.y = 400;
        stage.addChild(shootLabel);

    }
    scoreboard = new Scoreboard();
    stage.update();
}  
function shoot(event) {
    stage.removeChild(shootLabel);
    kamehameha.image.y = goku.image.y;
    kamehameha.add();

}

function createEnemies() {
    if (level == 1) {
        for (var count = 0; count < CLOUD_NUM; count++) {
            bullets[count] = new Bullet("bullet", "explode");
        }
    }
    else if (level == 2) {
        CLOUD_NUM = 6;
        for (var count = 0; count < CLOUD_NUM; count++) {
            bullets[count] = new Bullet("piccolo", "vegetaDeath");
        }
    }
    else if (level == 3) {
        CLOUD_NUM = 8;
        for (var count = 0; count < CLOUD_NUM; count++) {
            if (count %  2) {
                bullets[count] = new Bullet("vegeta", "vegetaDeath");
            }
            else {
                bullets[count] = new Bullet("bullet2", "explode");
            }
        }

    }

}
    
//If they lose, play lose screen.
function gameOver(): void {
    stage.cursor = "default";
    createjs.Sound.stop();
    stage.clear();
    createjs.Sound.play("BG");
    goku.updateX();
    sky = new Sky("sky");
    gameLost = new gameLose();
    stage.update();
}