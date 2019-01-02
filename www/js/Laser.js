let laserImage = new Image();
laserImage.src = "img/laser.png";

var BEAM_DURATION = 6000;
class Laser extends GameObject
{

    constructor(centreY, delay = 0)
    {
        super(40, delay); /* as this class extends from GameObject, you must always call super() */

        /* These variables depend on the object */
        this.explosionImage = laserImage;
        this.centreX = canvas.width/2;
        this.centreY = centreY;
        this.sizeY = 50;
        this.sizeX = canvas.width * 1.5;
        this.delay = delay;

        setTimeout(endBeam.bind(this), BEAM_DURATION)
    
        function endBeam(){
            this.gameObjectIsDisplayed = false;
            console.log("Beam done");
        }
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
    }

    render()
    {
        ctx.drawImage(
            this.explosionImage,
            0,
            0,
            this.explosionImage.width,
            this.explosionImage.height,
            this.centreX - parseInt(this.sizeX / 2),
            this.centreY - parseInt(this.sizeY / 2),
            this.sizeX,
            this.sizeY
        );
    }

    onCollision(){
        if(this.isDisplayed()){
            // this.stopAndHide()       
            onPlayerHit();
            //console.log("Laser hit! " + playerLifes)
        }
    }
}