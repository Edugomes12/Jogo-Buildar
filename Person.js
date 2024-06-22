class Person extends GameObject {
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;
        this.isStanding = false;

        this.isPlayerControlled = config.isPlayerControlled || false;

        this.speed = 1.5;
        this.total = 0;

        this.directionUpdate = {
            "down": ["y", 1],
            "up": ["y", -1],
            "left": ["x", -1],
            "right": ["x", 1],
        }
    }

    update(state) {
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            //state.map,isCutscenePlaying faz o hero
            if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow
                });
            }
            this.updateSprite(state);
        }
    }

    startBehavior(state, behavior) {
        this.direction = behavior.direction;
        const xround = Math.round(this.x);
        const yround = Math.round(this.y);
        if (behavior.type === "walk") {
            // Check if space is taken before starting walk
            if (state.map.isSpaceTaken(xround , yround, this.direction)) {

                behavior.retry && setTimeout(() => {
                    this.startBehavior(state, behavior)
                }, 10);

                return;
            }
            state.map.moveWall(xround , yround, this.direction);
            this.movingProgressRemaining = Math.round(16 / this.speed);
            this.total = 0;
            this.updateSprite(state);
            console.log (xround)
            console.log (yround)
        }

        if (behavior.type === "stand"){
            this.isStanding = true;
            setTimeout(() =>{
                utils.emitEvent("PersonStandComplete",{
                    whoId: this.id
                })
                this.isStanding = false;
            }, behavior.time)
        }

    }

    updatePosition() {
        if (this.movingProgressRemaining > 0) {
            const [property, change] = this.directionUpdate[this.direction];
            this.total += this.speed;
            if (this.movingProgressRemaining !== 1) {
                this[property] += change * this.speed;
            } else if (this.movingProgressRemaining === 1) {
                this[property] += change * (this.speed !== 16 ? (this.speed + (16 - this.total)) : this.speed);
            }
            this.movingProgressRemaining -= 1;

            if (this.movingProgressRemaining === 0) {
                // Emit event when walking is complete
                utils.emitEvent("PersonWalkingComplete", {
                    whoId: this.id
                });
            }
        }
    }

    updateSprite(state) {
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("walk-" + this.direction);
            return;
        }
        this.sprite.setAnimation("idle-" + this.direction);
    }
}
