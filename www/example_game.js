
const COIN_VALUE = 5;
const IMMUNITY_DURATION = 5000;
const PLAYER_FLICKER_INTERVAL = 400;
const MAULFUNCTION_DURATION = 5000;
//coin, missile, health, beam
const PROBABILITY_OF_PROPS = [0.3, 0.1, 0.005, 0.01, 0.005];

var PROPS_START_X;

var scoreTimer = 0;

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

function initMalfunction(){
    isMalfunction = true;

    setTimeout(function(){
        isMalfunction = false;
    }, MAULFUNCTION_DURATION);
    
}

let backImage = new Image();
backImage.src = "res/sprites/far_buildings.png";

let midImage = new Image();
midImage.src = "res/sprites/back_buildings.png";

let frontImage = new Image();
frontImage.src = "res/sprites/foreground.png";

function getRandomHeight(){
    return Math.random() * canvas.height;
}

/* Always have a playGame() function                                     */
/* However, the content of this function will be different for each game */
function playGame()
{
    PROPS_START_X = canvas.width + 50;

    let malfunctionButton = document.getElementById("malfunction_button")

    malfunctionButton.addEventListener('click', togleMalfunction);


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


    setInterval(function(){
        let max = PROBABILITY_OF_PROPS.reduce(function(a, b) { return a + b; }, 0)
        let number = Math.random() * (max * 50);
        
        let probSum = 0;
        let newObject;
        for(i = 0; i < PROBABILITY_OF_PROPS.length; i++){
            probSum += PROBABILITY_OF_PROPS[i];
            console.log({
                number: number,
                probSum: probSum,
            })
            if(number < probSum){
                switch(i){
                    case 0:
                    newObject = new Coin(getRandomHeight());
                    break;
                    case 1:
                    newObject = new Missile(getRandomHeight());
                    break;
                    case 2:
                    newObject = new Health(getRandomHeight());
                    break;
                    case 3:
                    newObject = new Laser(getRandomHeight());
                    break;
                    case 4:
                    initMalfunction();
                    break;
                }
                break;
            }
        }

        if(newObject !== undefined){
            gameObjects[gameObjects.length] = newObject;
            newObject.start();
        }

        scoreTimer++;
        if(scoreTimer == 50){
            playerPoints++;
            scoreTimer = 0;
        }
    }, 100);
    
    gameObjects[0] = new ScrollingBackgroundImage (backImage, 50);
    gameObjects[1] = new ScrollingBackgroundImage (midImage, 30);
    gameObjects[2] = new ScrollingBackgroundImage (frontImage, 20);

    gameObjects[3] = new Player(70);

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