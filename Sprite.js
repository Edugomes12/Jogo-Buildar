class Sprite {
    constructor(config) {

        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        this.shadow = new Image();
        this.useShadow = true; //config.useShadow || false
        if (this.useShadow) {
            this.shadow.src = "./images/characters/shadow.png";
        }

        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }

        this.numeroDeFrames = config.numeroDeFrames || 4;
        this.colunaY = config.colunaY;
        
        // console.log(this.colunaY)

        // this.animations = config.animations || {
        //     "idle-down": [[0, this.colunaY ? this.colunaY.down : 0]],
        //     "idle-right": [[0, this.colunaY ? this.colunaY.right : 1]],
        //     "idle-up": [[0, this.colunaY ? this.colunaY.up : 2]],
        //     "idle-left": [[0, this.colunaY ? this.colunaY.left : 3]],
        //     "walk-down": this.defineFrames(this.numeroDeFrames, this.colunaY ? this.colunaY.down : 0),
        //     "walk-right": this.defineFrames(this.numeroDeFrames, this.colunaY ? this.colunaY.right : 1),
        //     "walk-up": this.defineFrames(this.numeroDeFrames, this.colunaY ? this.colunaY.up : 2),
        //     "walk-left": this.defineFrames(this.numeroDeFrames, this.colunaY ? this.colunaY.left : 3)
        // }

        const defaultValue = {
            down: 0,
            right: 1,
            up: 2,
            left: 3
        };

        // Criação das animações
        this.animations = config.animations || {};

        // Definição das animações de caminhada
        ["down", "right", "up", "left"].forEach(direction => {
            this.animations[`idle-${direction}`] = [[0, this.colunaY?.[direction] || defaultValue[direction]]];
            this.animations[`walk-${direction}`] = this.defineFrames(this.numeroDeFrames, this.colunaY?.[direction] || defaultValue[direction]);
        });

        this.currentAnimation = config.currentAnimation || "idle-down";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 8;
        this.animationFrameProgress = this.animationFrameLimit;

        this.gameObject = config.gameObject;

        this.distanciaX = config.distanciaX || 8;
        this.distanciaY = config.distanciaY || 18;

        this.width = config.width || 32;
        this.height = config.height || 32;
    }

    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    defineFrames(n, nY){
        var arrayFrames = [];
        for(var i = 0; i < n; i++) {
            arrayFrames.push([i,nY]);
        }
        return arrayFrames;
    }
    setAnimation(key) {
        if(this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }
    }

    draw(ctx, cameraPerson) { 
        //ele desenha tudo
        const x = this.gameObject.x + utils.withGrid(10,5) - cameraPerson.x;
        const y = this.gameObject.y + utils.withGrid(6) - cameraPerson.y;

        this.isShadowLoaded && ctx.drawImage(this.shadow, x - 8, y - 18);

        const [frameX, frameY] = this.frame;

        this.isLoaded && ctx.drawImage(this.image,
            frameX * this.width, frameY * this.height,
            this.width, this.height,
            x - this.distanciaX, y - this.distanciaY,
            this.width, this.height
        )

        this.updateAnimationProgress();
    }
}