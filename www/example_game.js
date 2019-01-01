
const COIN_VALUE = 5;
const IMMUNITY_DURATION = 5000;
const PLAYER_FLICKER_INTERVAL = 400;
var playerPoints = 0;
var playerLifes = 3;
var playerImmune = false;
var playerVisible = true;

var isScreenPressed = false;
var isMalfunction = false;

function onInputPressed() {
    console.log("click")
    isScreenPressed = true;
}

function onInputReleased(){
    console.log("un-click")
    isScreenPressed = false;
}

function togleMalfunction(){
    isMalfunction = !isMalfunction;
    console.log({malfunction: isMalfunction})    
}

function takeLive(){
    //ToDo end game? 
    playerLifes -= 1;
    console.log("Player lost life " + playerLifes);
}

function onPlayerHit(){
    if(!playerImmune){
        takeLive();
        playerImmune = true;
        let flickerInterval = setInterval(function(){ playerVisible = !playerVisible; console.log("flick");}, PLAYER_FLICKER_INTERVAL);

        setTimeout(function(){
            playerImmune = false;
            console.log("Immunity end");
            clearInterval(flickerInterval); 
            playerVisible = true;
        }, IMMUNITY_DURATION);        
        
    }
}

let backImage = new Image();
backImage.src = "res/sprites/far_buildings.png";

let midImage = new Image();
midImage.src = "res/sprites/back_buildings.png";

let frontImage = new Image();
frontImage.src = "res/sprites/foreground.png";

/* Always have a playGame() function                                     */
/* However, the content of this function will be different for each game */
function playGame()
{

    let malfunctionButton = document.getElementById("malfunction_button")

    malfunctionButton.addEventListener('click', togleMalfunction)

    /* We need to initialise the game objects outside of the Game class */
    /* This function does this initialisation.                          */
    /* Specifically, this function will:                                */
    /* 1. initialise the canvas and associated variables                */
    /* 2. create the various game gameObjects,                   */
    /* 3. store the gameObjects in an array                      */
    /* 4. create a new Game to display the gameObjects           */
    /* 5. start the Game                                                */



    /* Create the various gameObjects for this game. */
    /* This is game specific code. It will be different for each game, as each game will have it own gameObjects */

    /* END OF game specific code. */

    
    gameObjects[0] = new ScrollingBackgroundImage (backImage, 50);
    gameObjects[1] = new ScrollingBackgroundImage (midImage, 40);
    gameObjects[2] = new ScrollingBackgroundImage (frontImage, 30);

    gameObjects[3] = new Player(70);

    gameObjects[4] = new Coin(600, 100, 50);
    gameObjects[5] = new Missile(500, 100, 50);
    gameObjects[6] = new Health(800, 400, 50);
    gameObjects[7] = new Laser(400);

    setTimeout(function(){
        console.log("new laser!");
        gameObjects[8] = new Laser(200); 
        gameObjects[8].start();
        console.log(gameObjects);
    }, IMMUNITY_DURATION);        



    /* Always create a game that uses the gameObject array */
    let game = new CanvasGame();

    canvas.addEventListener("touchstart", onInputPressed)
    canvas.addEventListener("mousedown", onInputPressed)

    canvas.addEventListener("touchend", onInputReleased)
    canvas.addEventListener("mouseup", onInputReleased)

    /* Always play the game */
    game.start();


    /* If they are needed, then include any game-specific mouse and keyboard listners */
}