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

        this.initialX = 100;
        this.rubberBandSpeed = 5;
        /* These variables depend on the object */
        this.centreX = this.initialX;
        this.centreY = 100;
        this.sizeX = size;
        this.sizeY = size;

        this.speedY = 0;
        this.speedX = 0;
        this.angle = 0;
        

        this.playerAcceleration = 0.7;
        this.gravityAcceleration = -0.5;
        this.rotationSpeed = 8;

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
            this.speedY = 0;
            this.speedX = 0;
            this.centreY = canvas.height - this.sizeY / 2 + 3;
        }
    }

    isPlayerOnGround(){
        return this.centreY + this.sizeY / 2 > canvas.height;
    }

    hasColisionUp(){
        return this.centreY - (this.sizeY / 2) < 1;
    }

    hasColisionLeft(){
        return this.centreX - (this.sizeX / 2) < 0;
    }

    hasColisionRight(){
        return this.centreX + (this.sizeX / 2) > canvas.width;
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

                this.speedX += Math.cos(Math.radians(-this.angle + 90)) * this.playerAcceleration;
                this.speedY += Math.sin(Math.radians(-this.angle + 90)) * this.playerAcceleration;  //ToDo x y 
                //console.log({angle: this.angle + 90, speedX: this.speedX, speedY: this.speedY})
            break;
            case MovementDirection.DOWN:
                this.speedY += this.gravityAcceleration;
            break;
            case MovementDirection.NONE:

            break;
        }

        if(playerStateProperties.rotation){
            this.angle += this.rotationSpeed;
        }

        if(this.isPlayerOnGround() && this.speedY < 0){
            this.speedY = 0;
            this.centreY = canvas.height - this.sizeY / 2;
        }

        //Colisions 
        if(this.hasColisionUp() && this.speedY > 0){
            this.speedY = 0;
            this.centreY = this.sizeY / 2;
        }

        if(this.hasColisionLeft() && this.speedX < 0){
            this.speedX = 0;
            this.centreX = this.sizeX / 2;
        }

        if(this.hasColisionRight() && this.speedX > 0){
            this.speedX = 0;
            this.centreX = canvas.width - this.sizeX / 2;
        }

        if(this.playerState == PlayerState.RUNNING){
            if(this.centreX != this.initialX){
                if(Math.abs(this.centreX - this.initialX) < 4){
                    this.centreX = this.initialX;
                } else if(this.centreX > this.initialX){
                    this.centreX -= this.rubberBandSpeed;
                } else {
                    this.centreX += this.rubberBandSpeed;
                }
            }
        }

        // if(this.isPlayerOnGround() && this.speedY < 0){
        //     this.speedY = 0;
        //     this.speedX = 0;
        //     this.centreY = canvas.height - this.size / 2;
        // }

        this.centreY -= this.speedY;
        this.centreX += this.speedX;

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
            this.centreX - parseInt(this.sizeX / 2),
            this.centreY - parseInt(this.sizeY / 2),
            this.sizeX,
            this.sizeY
        );

        ctx.restore()
    }
}