class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    startGameLoop() {
        const step = () => {
            // Clear the canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // Get the camera focus
            const cameraPerson = this.map.gameObjects.hero;

            // Update and draw lower layer of map
            this.map.drawLowerImage(this.ctx, cameraPerson);

            // Update and draw each game object
            Object.values(this.map.gameObjects).sort((a, b) => {
                return a.y - b.y;
            }).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map,
                });
                object.sprite.draw(this.ctx, cameraPerson);
            });

            // Draw upper layer of map
            // this.map.drawUpperImage(this.ctx, cameraPerson);

            // Request next animation frame
            requestAnimationFrame(() => {
                step();
            });
        }
        step();
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => {
            this.map.checkForActionCutscene();
        })
    }

    bindHeroPositionCheck() {
        document.addEventListener("PersonWalkingComplete", e => {
            if (e.detail.whoId === "hero") {
                //Hero's position has changed
                this.map.checkForFootstepCutscene()
                console.log("New possition")
            }
        })
    }

    init() {
        this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
        this.map.mountObjects();

        this.bindActionInput();

        // Inicializando DirectionInput (supondo que seja necessário)
        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.startGameLoop();
        this.bindHeroPositionCheck();

        this.map.startCutscene([
            { who: "hero", type: "walk", direction: "down" },
            { who: "hero", type: "walk", direction: "down" },
            { who: "npcB", type: "walk", direction: "right" },
            { who: "npcB", type: "walk", direction: "right" },
            { who: "npcB", type: "stand", direction: "up", time: 800 },
            { type: "textMessage", text: "Olá, seja bem-vindo a Buildar corporation!" },
            { type: "textMessage", text: "Aqui você irá a suas habilidades comportamentais" },
            { type: "textMessage", text: "Na sua direita teram portas para você treinar as suas habilidades" },
            { type: "textMessage", text: "E na sua esquerda tem o nosso joguinho de descanso, fique a vontade para jogar" },
            { who: "npcB", type: "walk", direction: "down" },
            { who: "npcB", type: "walk", direction: "left" },
            { who: "npcB", type: "walk", direction: "left" },
            { who: "hero", type: "walk", direction: "down" },
        ]);

    }
}
