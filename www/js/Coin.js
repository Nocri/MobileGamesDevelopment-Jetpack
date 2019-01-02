let coinImage = new Image();
coinImage.src = "img/coin.png";

class Coin extends GameObject
{

    constructor(centreY, delay = 0)
    {
        super(40, delay); /* as this class extends from GameObject, you must always call super() */

        this.movementSpeed = 5;
        /* These variables depend on the object */
        this.explosionImage = coinImage;
        this.centreX = PROPS_START_X;
        this.centreY = centreY;
        this.sizeX = 30;
        this.sizeY = 30;
        this.delay = delay;
        this.NUMBER_OF_SPRITES = 8; // the number of gameObjects in the gameObject image
        this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE = 8; // the number of columns in the gameObject image
        this.NUMBER_OF_ROWS_IN_SPRITE_IMAGE = 1; // the number of rows in the gameObject image	
        this.START_ROW = 0;
        this.START_COLUMN = 0;

        this.currentgameObject = 0; // the current gameObject to be displayed from the gameObject image  
        this.row = this.START_ROW; // current row in gameObject image
        this.column = this.START_COLUMN; // current column in gameObject image

        this.SPRITE_WIDTH = (this.explosionImage.width / this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE);
        this.SPRITE_HEIGHT = (this.explosionImage.height / this.NUMBER_OF_ROWS_IN_SPRITE_IMAGE);

        this.isFirstCallOfUpdateState = true; // used to synchronise explosion sound with start of animation
    }

    updateState()
    {
        if (this.currentgameObject === this.NUMBER_OF_SPRITES)
        {
            this.column = 0;
            this.row = 0;
            this.currentgameObject = 0;
        }
        this.currentgameObject++;

        this.column++;
        if (this.column >= this.NUMBER_OF_COLUMNS_IN_SPRITE_IMAGE)
        {
            this.column = 0;
            this.row++;
        }

        if(this.row >= this.NUMBER_OF_ROWS_IN_SPRITE_IMAGE){
            this.column = 0;
            this.row = 0;
        }

        this.centreX -= this.movementSpeed;
    }

    render()
    {
        ctx.drawImage(
            this.explosionImage,
            this.column * this.SPRITE_WIDTH,
            this.row * this.SPRITE_HEIGHT,
            this.SPRITE_WIDTH,
            this.SPRITE_HEIGHT,
            this.centreX - parseInt(this.sizeX / 2),
            this.centreY - parseInt(this.sizeY / 2),
            this.sizeX,
            this.sizeY
        );
    }

    onCollision(){
        if(this.isDisplayed()){
            this.stopAndHide();
            if(isGameOn){
                playerPoints += COIN_VALUE;
                console.log("Coin earned " + playerPoints)
            }       
        }
    }
}