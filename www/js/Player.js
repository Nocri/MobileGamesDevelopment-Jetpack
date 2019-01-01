let fallingImage = new Image();
fallingImage.src = "res/sprites/player_engines_off.png";

let jetpackActiveImage = new Image();
jetpackActiveImage.src = "res/sprites/player_moving.png";

let jetpackMalfunctionImage = new Image();
jetpackMalfunctionImage.src = "res/sprites/player_moving_one_engine.png";

let runningImage = new Image();
runningImage.src = "res/sprites/player_running.png";

var MovementDirection = {
    UP: 1,
    DOWN: 2,
    NONE: 3
}

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
            movement: MovementDirection.DOWN,
            rotation: false,
            reset: false,
            //ToDo add status angle change, acceleration (or elevates/falls/nothing), reset on state start e
        },
        2: {
            image: jetpackActiveImage,
            spriteRowsAmmount: 3,
            spriteColumnsAmmount: 5,
            spritesAmmount: 15,
            movement: MovementDirection.UP,
            rotation: false,
            reset: false,
        },
        3: {
            image: jetpackMalfunctionImage,
            spriteRowsAmmount: 3,
            spriteColumnsAmmount: 5,
            spritesAmmount: 15,
            movement: MovementDirection.DOWN,
            rotation: true,
            reset: false,
            },
        4: {
            image: runningImage,
            spriteRowsAmmount: 3,
            spriteColumnsAmmount: 5,
            spritesAmmount: 15,
            movement: MovementDirection.NONE,
            rotation: false,
            reset: true,
        }
    }
};


class Player extends GameObject
{
    constructor(size) //ToDo: Shouldn t centreX Y be internal variables of Player class?
    {
        super(40);

        /* These variables depend on the object */
        this.centreX = 200;
        this.centreY = 100;
        this.size = size;

        this.speed = 0;
        this.speedX = 0;
        this.angle = 0;
        

        this.playerAcceleration = 0.7;
        this.gravityAcceleration = -0.5;
        this.rotationSpeed = 5;

        this.changePlayerState(PlayerState.JETPACK_ACTIVE);
    }

    changePlayerState(newPlayerState){
        let playerStateProperties = PlayerState.properties[newPlayerState];

        this.playerState = newPlayerState;
        this.column = 0;
        this.row = 0;
        this.currentgameObject = 0;

        this.SPRITE_WIDTH = (playerStateProperties.image.width / playerStateProperties.spriteColumnsAmmount);
        this.SPRITE_HEIGHT = (playerStateProperties.image.height / playerStateProperties.spriteRowsAmmount);

        if(playerStateProperties.reset){
            this.angle = 0;
            this.speed = 0;
        }
    }

    isPlayerOnGround(){
        return this.centreY + this.size / 2 > canvas.height;
    }

    hasColisionUp(){
        // console.log({
        //     centreY: this.centreY,
        //     size: this.size/2
        // })
        return this.centreY - (this.size / 2) < 1;
    }

    updateState()
    {

        //State change
        let newState;

        if(isScreenPressed){
            newState = PlayerState.JETPACK_ACTIVE;
        } else if(this.isPlayerOnGround()){
            newState = PlayerState.RUNNING
        }   else {
            newState = isMalfunction ? PlayerState.JETPACK_MALFUNCTION : PlayerState.FALLING
        }

        if(newState !== this.playerState){
            this.changePlayerState(newState);
        }

        let playerStateProperties = PlayerState.properties[this.playerState];

        switch(playerStateProperties.movement){
            case MovementDirection.UP:
                this.speed += this.playerAcceleration;
            break;
            case MovementDirection.DOWN:
                this.speed += this.gravityAcceleration;
            break;
            case MovementDirection.NONE:

            break;
        }

        if(playerStateProperties.rotation){
            this.angle += this.rotationSpeed;
        }

        //Colisions 
        if(this.hasColisionUp() && this.speed > 0){
            this.speed = 0;
            this.centreY = this.size / 2;
        }
        if(this.isPlayerOnGround() && this.speed < 0){
            this.speed = 0;
            this.centreY = canvas.height - this.size / 2;
        }

        this.centreY -= this.speed;






        // if(this.playerState !== PlayerState.JETPACK_ACTIVE && isScreenPressed){
        //     this.changePlayerState(PlayerState.JETPACK_ACTIVE);
        // } else if(this.playerState === PlayerState.JETPACK_ACTIVE && !isScreenPressed){
        //     if(isMalfunction){
        //         this.changePlayerState(PlayerState.JETPACK_MALFUNCTION);
        //     } else{
        //         this.changePlayerState(PlayerState.FALLING);
        //     }
        // }

  

        //ToDo block from going offscreen. Just lock to max/min coordinates


        // if(this.playerState === PlayerState.JETPACK_ACTIVE){
        //     if(!this.hasColisionUp()){
        //         this.speed += this.playerAcceleration;
        //         // this.currentY -= this.speed;
        //     } else {
        //         if(this.speed > 0){
        //             this.speed = 0;
        //         }
        //     }
        // }   else if(!this.isPlayerOnGround()){
        //     this.speed += this.gravityAcceleration;
        //     if(isMalfunction){
        //         this.angle += this.rotationSpeed;
        //     }
        //     // this.currentY += this.speed;
        // }   else if(this.playerState !== PlayerState.RUNNING){
        //     this.changePlayerState(PlayerState.RUNNING);
        //     this.speed = 0;
        //     this.angle = 0;
        // }


        //console.log({speed:this.speed, state: this.playerState});


        if (this.currentgameObject >= (playerStateProperties.spritesAmmount - 1))
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

        //console.log({currentgameObject: this.currentgameObject, row: this.row, column: this.column});
    }

    render()
    {
        let playerStateProperties = PlayerState.properties[this.playerState];

        ctx.save();
        ctx.translate(this.centreX, this.centreY);
        ctx.rotate(Math.radians(this.angle));
        ctx.translate(-this.centreX,-this.centreY);
        
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

        ctx.restore()
    }
}