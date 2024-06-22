class GameObject {
    constructor(config) {
        this.id = null;
        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "./images/characters/people/hero.png",
            numeroDeFrames: config.numeroDeFrames,
            colunaY: config.colunaY,
            distanciaX: config.distanciaX,
            distanciaY: config.distanciaY,
            width: config.width,
            height: config.height,
            animationFrameLimit: config.animationFrameLimit
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;

        this.talking = config.talking || [];
    }

    mount(map) {
        // console.log("Montando");
        this.isMounted = true;
        map.addWall(this.x, this.y);

        // If we have a behavior, start after a small delay
        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 10);
    }

    update() {}

    async doBehaviorEvent(map) {
        // Don't perform behavior if a cutscene is playing or if there's no behavior
        if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
            return;
        }

        // Get the next event configuration
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        // Create the event
        const eventHandler = new OverworldEvent({ map, event: eventConfig });
        await eventHandler.init();


        // Move to the next event in the loop
        this.behaviorLoopIndex += 1;
        if (this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        }

        // Trigger the next behavior event
        this.doBehaviorEvent(map);
    }
}
