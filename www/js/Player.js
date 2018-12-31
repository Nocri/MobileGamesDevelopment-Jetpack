let fallingImage = new Image();
fallingImage.src = "res/sprites/player_engines_off.png";

let jetpackActiveImage = new Image();
jetpackActiveImage.src = "res/sprites/player_moving.png";

let jetpackMalfunctionImage = new Image();
jetpackMalfunctionImage.src = "res/sprites/player_moving_one_engine.png";

let runningImage = new Image();
runningImage.src = "res/sprites/player_running.png";

var PlayerState = {
    FALLING: 1,
    JETPACK_ACTIVE: 2,
    JETPACK_MALFUNCTION: 3,
    RUNNING: 4,

    properties: {
        1: {
            image: fallingImage,
            spriteRowsAmmount: 3,
            spriteColumnsAmmount: 5,
            spritesAmmount: 15,
        },
        2: {
            image: jetpackActiveImage,
            spriteRowsAmmount: 3,
            spriteColumnsAmmount: 5,
            spritesAmmount: 15,
        },
        3: {
            image: jetpackMalfunctionImage,
            spriteRowsAmmount: 3,
            spriteColumnsAmmount: 5,
            spritesAmmount: 15,
            },
        4: {
            image: runningImage,
            spriteRowsAmmount: 3,
            spriteColumnsAmmount: 5,
            spritesAmmount: 15,
        }
    }
};


class Player extends GameObject
{
    constructor(size) //ToDo: Shouldn t centreX Y be internal variables of Player class?
    {
        super(40);

        /* These variables depend on the object */
        this.centreX = 100;
        this.centreY = 100;
        this.size = size;

        this.changePlayerState(PlayerState.JETPACK_MALFUNCTION);
    }

    changePlayerState(newPlayerState){
        let playerStateProperties = PlayerState.properties[newPlayerState];

        this.playerState = newPlayerState;
        this.column = 0;
        this.row = 0;
        this.currentgameObject = 0;

        this.SPRITE_WIDTH = (playerStateProperties.image.width / playerStateProperties.spriteColumnsAmmount);
        this.SPRITE_HEIGHT = (playerStateProperties.image.height / playerStateProperties.spriteRowsAmmount);
    }

    updateState()
    {
        let playerStateProperties = PlayerState.properties[this.playerState];

        console.log(this.currentgameObject)
        if (this.currentgameObject === (playerStateProperties.spritesAmmount - 1))
        {
            this.column = 0;
            this.row = 0;
            this.currentgameObject = 0;
        }

        this.currentgameObject++;
        this.column++;
        
        if (this.column >= playerStateProperties.spriteColumnsAmmount)
        {
            this.column = 0;
            this.row++;
        }
    }

    render()
    {
        let playerStateProperties = PlayerState.properties[this.playerState];

        ctx.drawImage(
            // this.explosionImage,
            playerStateProperties.image,
            this.column * this.SPRITE_WIDTH,
            this.row * this.SPRITE_HEIGHT,
            this.SPRITE_WIDTH,
            this.SPRITE_HEIGHT,
            this.centreX - parseInt(this.size / 2), // Coordinates on canvas
            this.centreY - parseInt(this.size / 2), // Coordinates on canvas
            this.size,
            this.size
        );
    }
}