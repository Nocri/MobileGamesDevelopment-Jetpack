var highScoresList = null;

var initDone = false;
var menu = null;
var highScoreUI = null;

var highScoreInputUI = null;
var highScoreInputField = null;
var highScoresListView = null;
var highScoreLoadingText = null;

function initUI(){
    if(initDone){return;}

    initDone = true;

    menu = document.getElementById("gameMenu");
    highScoreUI = document.getElementById("highScoresContainer");
    
    highScoreInputUI = document.getElementById("highScoreInputContainer");
    highScoreInputField = document.getElementById("highscoreInput");

    highScoresListView = document.getElementById("highScoresList");

    highScoreLoadingText = document.getElementById("loading");

    //Init highScoreInputUI
    let sendHighscoreButton = document.getElementById("send_highscore_button");
    sendHighscoreButton.addEventListener("click", function(){
        submitHighScore(highScoreInputField.value);
        showMenu();
    });

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
    highScoresListView.style.display = 'none';
    highScoreLoadingText.style.display = "block";
    readScores();
    //ToDo show loading
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

function inflateHighScore(){
    console.log("inflate high score");
    console.log(highScoresList);

    highScoreLoadingText.style.display = "none";
    highScoresListView.style.display = "block";
    highScoresListView.innerHTML = '';

    if(highScoresList === undefined) {return;}

    highScoresList.sort(function(a, b){return b.Score-a.Score});
    highScoresList = highScoresList.slice(0, 10);

    for(let i = 0; i < highScoresList.length; i++){
        let scoreItem = highScoresList[i];
        let elem = document.createElement("li");
        elem.innerHTML = scoreItem.UserName + ": " + scoreItem.Score;
        highScoresListView.appendChild(elem);
    }
}