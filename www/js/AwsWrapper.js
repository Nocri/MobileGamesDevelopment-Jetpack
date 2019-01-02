//ToDo export to another file 
AWS.config.update({
    region: "eu-central-1",
    endpoint: 'dynamodb.eu-central-1.amazonaws.com',
    // accessKeyId default can be used while using the downloadable version of DynamoDB. 
    // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
    accessKeyId: "XXX",
    // secretAccessKey default can be used while using the downloadable version of DynamoDB. 
    // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
    secretAccessKey: "YYY"
  });

  
var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

function createItem(name, score) {
    var params = {
        TableName :"HighScores",
        Item:{
            "UserName": name,
            "Score": score,
        }
    };
    docClient.put(params, function(err, data) {
        console.log({error: err, data: data});
        showMenu();
    });
}


function submitHighScore(name){
    createItem(name, playerPoints);
}


function readScores(){
    //Show loading & clear list

    var params = {
        TableName: "HighScores",
        ProjectionExpression: "UserName, Score",
    };
    
    console.log("Scanning Movies table.");
    docClient.scan(params, function(err, data) {
        console.log({error: err, data: data});
        // for(let i = 0; i < data.Items.length; i++){
        //     console.log(data.Items[i]);
        // }
        highScoresList = data.Items;
        inflateHighScore();
        //Hide loading
        //Show error on error || set new data to list
    });
}