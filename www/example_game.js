/* Author: Derek O Reilly, Dundalk Institute of Technology, Ireland.             */
/* There should always be a javaScript file with the same name as the html file. */
/* This file always holds the playGame function().                               */
/* It also holds game specific code, which will be different for each game       */





/******************** Declare game specific global data and functions *****************/
/* images must be declared as global, so that they will load before the game starts  */

/******************* END OF Declare game specific data and functions *****************/
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

const COIN_VALUE = 5;
var playerPoints = 0;
var playerLives = 3;

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

    gameObjects[0] = new Player(70);
    gameObjects[1] = new Coin(600, 100, 50);
    gameObjects[2] = new Missile(500, 100, 50);
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