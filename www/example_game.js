
const COIN_VALUE = 5;
const IMMUNITY_DURATION = 5000;
const PLAYER_FLICKER_INTERVAL = 400;
const MAULFUNCTION_DURATION = 5000;
//coin, missile, health, beam
const PROBABILITY_OF_PROPS = [0.3, 0.1, 0.005, 0.01, 0.005];

var difficulty = 1;
var gameSpeedMultiplier = 6;

var PROPS_START_X;

var isGameOn = false;

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
    // takeLive();
    // isMalfunction = !isMalfunction;
    // console.log({malfunction: isMalfunction})   
    readScores(); 
}

function takeLive(){
    //ToDo end game? 
    playerLifes -= 1;
    navigator.vibrate([500]);
    console.log("Player lost life " + playerLifes);
    if(playerLifes === 0){
        isGameOn = false;
        gameObjects = gameObjects.slice(0, 4);
        showEnterName();
        resetGame();
    }
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

    navigator.vibrate([1000, 1000, 1000, 1000, 1000]);

    setTimeout(function(){
        isMalfunction = false;
    }, MAULFUNCTION_DURATION);
    
}

let backImage = new Image();
backImage.src = "img/far_buildings.png";

let midImage = new Image();
midImage.src = "img/back_buildings.png";

let frontImage = new Image();
frontImage.src = "img/foreground.png";

function getRandomHeight(){
    return Math.random() * canvas.height;
}

function resetGame(){
    isGameOn = false;
    difficulty = 1;
    gameSpeedMultiplier = 6;
};


function onStartGameClicked(){
    console.log("startGame");
    isGameOn = true;
    playerLifes = 3;
    playerPoints = 0;
}

function onHighScoresClicked(){
    console.log("high scores");
}


var isGameInit = false;
/* Always have a playGame() function                                     */
/* However, the content of this function will be different for each game */
function playGame()
{
    if(isGameInit) {return;}
    isGameInit = true;

    PROPS_START_X = canvas.width + 50;

    setInterval(function(){
        if(difficulty < 46){
            difficulty += 3;
        }
        gameSpeedMultiplier += 2;
        console.log({difficulty: difficulty, gameSpeedMultiplier: gameSpeedMultiplier});
    }, 5000);

    setInterval(function(){
        if(!isGameOn){return;}
        let max = PROBABILITY_OF_PROPS.reduce(function(a, b) { return a + b; }, 0);
        let number = Math.random() * (max * (50 - difficulty));
        
        let probSum = 0;
        let newObject;
        for(i = 0; i < PROBABILITY_OF_PROPS.length; i++){
            probSum += PROBABILITY_OF_PROPS[i];
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
        if(scoreTimer > (50 - difficulty)){
            playerPoints++;
            scoreTimer = 0;
        }
    }, 100);
    
    gameObjects[0] = new ScrollingBackgroundImage (backImage, 0.06);
    gameObjects[1] = new ScrollingBackgroundImage (midImage, 0.12);
    gameObjects[2] = new ScrollingBackgroundImage (frontImage, 0.18);

    gameObjects[3] = new Player(70);

    /* Always create a game that uses the gameObject array */
    let game = new CanvasGame();

    canvas.addEventListener("touchstart", onInputPressed)
    canvas.addEventListener("mousedown", onInputPressed)

    canvas.addEventListener("touchend", onInputReleased)
    canvas.addEventListener("mouseup", onInputReleased)

    /* Always play the game */
    game.start();


    setInterval(function(){
        var newObjects = [];
        let newSize = 0;
        for(let i = 0; i < gameObjects.length; i++){
            
            if(i < 4 || (gameObjects[i] !== undefined && gameObjects[i].centreX > -50)){
                newObjects[newSize] = gameObjects[i];
                newSize++;
            }
        }
        console.log({
            old: gameObjects,
            new: newObjects
        });
        gameObjects = newObjects;
    }, 5000);

    /* If they are needed, then include any game-specific mouse and keyboard listners */
}

function createMovies() {
    var params = {
        TableName : "HighScores",
        KeySchema: [
            { AttributeName: "UserName", KeyType: "HASH"},
            { AttributeName: "Score", KeyType: "RANGE" }
        ],
        AttributeDefinitions: [
            { AttributeName: "UserName", AttributeType: "S" },
            { AttributeName: "Score", AttributeType: "N" }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    };

    dynamodb.createTable(params, function(err, data) {
        console.log(err);
        console.log(data);
        if (err) {
            document.getElementById('textarea').innerHTML = "Unable to create table: " + "\n" + JSON.stringify(err, undefined, 2);
        } else {
            document.getElementById('textarea').innerHTML = "Created table: " + "\n" + JSON.stringify(data, undefined, 2);
        }
    });
}
