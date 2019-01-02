var initDone = false;
var menu = null;
var highScoreUI = null;

var highScoreInputUI = null;
var highScoreInputField = null;
function initUI(){
    if(initDone){return;}

    initDone = true;

    menu = document.getElementById("gameMenu");
    highScoreUI = document.getElementById("highScoresContainer");
    
    highScoreInputUI = document.getElementById("highScoreInputContainer");
    highScoreInputField = document.getElementById("highscoreInput");
    
    //Init highScoreInputUI
    let sendHighscoreButton = document.getElementById("send_highscore_button");
    sendHighscoreButton.addEventListener("click", function(){
        submitHighScore(highScoreInputField.value);
        showMenu();
    });


    let malfunctionButton = document.getElementById("malfunction_button")
    malfunctionButton.addEventListener('click', togleMalfunction);

    let startGameButton = document.getElementById("startGameButton")
    startGameButton.addEventListener('click', function(){hideAll(); onStartGameClicked();});

    let highScoresButton = document.getElementById("highScoresButton")
    highScoresButton.addEventListener('click', showHighScore);

    let closeHighScoreButton = document.getElementById("closeHighScore")
    closeHighScoreButton.addEventListener('click', showMenu);

    showMenu();
}

function showMenu(){
    hideAll();
    console.log("show menu");
    menu.style.display = 'flex';
}

function showHighScore(){
    hideAll();
    highScoreUI.style.display = 'block';
}

function showEnterName(){
    hideAll();
    highScoreInputUI.style.display = 'flex';
}

function hideAll(){
    menu.style.display = 'none';
    highScoreUI.style.display = 'none';
    highScoreInputUI.style.display = 'none';
}

