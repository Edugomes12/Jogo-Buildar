class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;
        this.walls = config.walls || {};
        this.cutsceneSpaces = config.cutsceneSpaces || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src= config.upperSrc;

        this.isCutscenePlaying = false;
    }

    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.lowerImage,
            utils.withGrid(10) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        );
    }

    drawUpperImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.upperImage,
            utils.withGrid(10) - cameraPerson.x,
            utils.withGrid(6) - cameraPerson.y
        );
    }

    isSpaceTaken(currentX, currentY, direction) {
        const { x, y } = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {
            let object = this.gameObjects[key];
            object.id = key;
            object.mount(this);
        });
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true;
    
        // Inicia um loop de eventos assíncronos e aguarda cada um deles
        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            });
    
            await eventHandler.init();
        }
    
        this.isCutscenePlaying = false;
    
        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
    }

    checkForActionCutscene(){
        const hero = this.gameObjects["hero"];
        const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
        const match = Object.values(this.gameObjects).find(object => {
            return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
        });
         if (!this.isCutscenePlaying && match && match.talking.length) {
             this.startCutscene(match.talking[0].events)
         }
    }

    // checkForFootstepCutscene() {
    //     const hero = this.gameObjects["hero"];
    //     const match = this.cutsceneSpaces [ `${hero.x}, ${hero.y}`];
    //     console.log ({ match })
    //   }
    
    
    addWall(x, y) {
        this.walls[`${x},${y}`] = true;
    }

    removeWall(x, y) {
        delete this.walls[`${x},${y}`];
    }

    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY);
        const { x, y } = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x, y);
    }
}

window.OverworldMaps = {
    DemoRoom: {
        lowerSrc: "./images/maps/mapaExtenso.png",
        // upperSrc: "./images/maps/corredorCima.png",
        gameObjects: {
            npcA: new Person({
                x: utils.withGrid(15),
                y: utils.withGrid(9),
                src: "./images/characters/people/npc1.png",
                behaviorLoop: [
                    //fazer a movimentação do npc (stand = giro ou parado) (walk = andando )
                    { type: "stand", direction: "left", time: 800 },
                    { type: "stand", direction: "up", time: 800 },
                    { type: "stand", direction: "right", time: 1200 },
                    { type: "stand", direction: "up", time: 300 },
                ],
                talking: [
                    {
                        events: [
                            //Evento de quando você for falar com o npc
                            { type: "textMessage", text: "WHY HELLO THERE!", faceHero: "npcA" },
                            { type: "textMessage", text: "Go away"},
                            { who: "hero", type: "walk", direction: "up" },
                        ]
                    }
                ]
            }),
            npcB: new Person({
                x: utils.withGrid(5),
                y: utils.withGrid(8),
                src: "./images/characters/people/npc2.png",
                //  behaviorLoop: [
                //    { type: "walk", direction: "up"},
                //    { type: "walk", direction: "right"},
                //    { type: "walk", direction: "left"},
                //    { type: "walk", direction: "down"},
                //  ],
                talking: [
                    {
                        events: [
                            //Evento de quando você for falar com o npc
                            { type: "textMessage", text: "Aproveite a buildar", faceHero: "npcB" },
                        ]
                    }
                ]
                
            }),
            hero: new Person({
                isPlayerControlled: true,
                x: utils.withGrid(7),
                y: utils.withGrid(5),
                src: "./images/characters/people/img.png",
                numeroDeFrames: 8,
                width: 24,
                // height: 32,
                colunaY: {
                    "down": 0,
                    "up": 1,
                    "left": 2,
                    "right": 3
                },
                distanciaX: 4,
                animationFrameLimit: 4
            }) 
        },
        walls: {
            [utils.asGridCoord(0, 4)]: true,
            [utils.asGridCoord(1, 4)]: true,
            [utils.asGridCoord(2, 4)]: true,
            [utils.asGridCoord(1, 5)]: true,
            [utils.asGridCoord(3, 4)]: true,
            [utils.asGridCoord(4, 4)]: true,
            [utils.asGridCoord(5, 4)]: true,
            [utils.asGridCoord(5, 5)]: true,
            [utils.asGridCoord(6, 4)]: true,
            [utils.asGridCoord(7, 4)]: true, 
            [utils.asGridCoord(8, 4)]: true,
            [utils.asGridCoord(9, 5)]: true,
            [utils.asGridCoord(9, 4)]: true,
            [utils.asGridCoord(10, 4)]: true,
            [utils.asGridCoord(11, 4)]: true,
            [utils.asGridCoord(12, 4)]: true,
            [utils.asGridCoord(13, 4)]: true,
            [utils.asGridCoord(14, 4)]: true,
            [utils.asGridCoord(15, 4)]: true,
            [utils.asGridCoord(16, 4)]: true,
            // [utils.asGridCoord(17, 4)]: true, porta
            [utils.asGridCoord(18, 4)]: true, 
            [utils.asGridCoord(19, 4)]: true,
            [utils.asGridCoord(20, 4)]: true,
            [utils.asGridCoord(21, 4)]: true, 
            [utils.asGridCoord(22, 4)]: true,
            // [utils.asGridCoord(23, 4)]: true, porta
            [utils.asGridCoord(24, 4)]: true,
            [utils.asGridCoord(25, 4)]: true,
            [utils.asGridCoord(26, 4)]: true, 
            [utils.asGridCoord(27, 4)]: true,
            [utils.asGridCoord(28, 4)]: true,
            // [utils.asGridCoord(29, 4)]: true, porta
            [utils.asGridCoord(30, 4)]: true,
            [utils.asGridCoord(31, 4)]: true, 
            [utils.asGridCoord(32, 4)]: true,
            [utils.asGridCoord(33, 4)]: true,
            [utils.asGridCoord(34, 5)]: true,
            [utils.asGridCoord(34, 6)]: true,
            [utils.asGridCoord(34, 7)]: true,
            [utils.asGridCoord(33, 7)]: true,
            [utils.asGridCoord(34, 8)]: true,
            [utils.asGridCoord(34, 9)]: true,
            [utils.asGridCoord(34, 10)]: true,
            [utils.asGridCoord(34, 11)]: true,
            [utils.asGridCoord(0, 12)]: true,
            [utils.asGridCoord(1, 12)]: true,
            [utils.asGridCoord(2, 12)]: true,
            [utils.asGridCoord(3, 12)]: true,
            [utils.asGridCoord(4, 12)]: true,
            [utils.asGridCoord(5, 12)]: true,
            [utils.asGridCoord(6, 12)]: true,
            [utils.asGridCoord(7, 12)]: true,
            [utils.asGridCoord(8, 12)]: true,
            [utils.asGridCoord(9, 12)]: true,
            [utils.asGridCoord(10, 12)]: true,
            [utils.asGridCoord(11, 12)]: true,
            [utils.asGridCoord(12, 12)]: true,
            [utils.asGridCoord(13, 12)]: true,
            [utils.asGridCoord(14, 12)]: true,
            [utils.asGridCoord(15, 12)]: true,
            [utils.asGridCoord(16, 12)]: true,
            [utils.asGridCoord(17, 12)]: true,
            [utils.asGridCoord(18, 12)]: true, 
            [utils.asGridCoord(19, 12)]: true, 
            [utils.asGridCoord(20, 12)]: true,
            [utils.asGridCoord(21, 12)]: true,
            [utils.asGridCoord(22, 12)]: true,
            [utils.asGridCoord(23, 12)]: true,
            [utils.asGridCoord(24, 12)]: true,
            [utils.asGridCoord(25, 12)]: true,
            [utils.asGridCoord(26, 12)]: true,
            [utils.asGridCoord(27, 12)]: true,
            [utils.asGridCoord(28, 12)]: true,
            [utils.asGridCoord(29, 12)]: true,
            [utils.asGridCoord(30, 12)]: true, 
            [utils.asGridCoord(31, 12)]: true, 
            [utils.asGridCoord(32, 12)]: true,
            [utils.asGridCoord(33, 12)]: true,
            [utils.asGridCoord(-1, 5)]: true,
            [utils.asGridCoord(-1, 6)]: true,
            [utils.asGridCoord(-1, 7)]: true,
            [utils.asGridCoord(-1, 8)]: true,
            [utils.asGridCoord(-1, 9)]: true,
            [utils.asGridCoord(-1, 10)]: true,
            [utils.asGridCoord(-1, 11)]: true,
        },

        // cutsceneSpaces: {
        //     [utils.asGridCoord(7, 7)]: [
        //         {
        //             events: [
        //                 { who: "npcB", type: "walk", direction: "up" },
        //                 { who: "npcB", type: "walk", direction: "right" },
        //                 { who: "npcB", type: "walk", direction: "right" },
        //                 { who: "npcB", type: "stand", direction: "right", time: 800},
        //                 { type: "textMessage", text: "Olá, seja bem-vindo a Buildar corporation!"},
        //                 { type: "textMessage", text: "Aqui você irá a suas habilidades comportamentais"},
        //                 { type: "textMessage", text: "Na sua direita teram portas para você treinar as suas habilidades"},
        //                 { type: "textMessage", text: "E na sua esquerda tem o nosso joguinho de descanso, fique a vontade para jogar"},
        //                 { who: "npcB", type: "walk", direction: "down" },
        //                 { who: "npcB", type: "walk", direction: "left" },
        //                 { who: "npcB", type: "walk", direction: "left" },
        //                 { who: "hero", type: "walk", direction: "down" },
        //                 { who: "hero", type: "walk", direction: "down" },
        //             ]
        //         }
        //     ]
        // },


    }, 


    Kitchen: {
        //outro mapa
        
        lowerSrc: "./images/maps/KitchenLower.png",
        upperSrc: "./images/maps/KitchenUpper.png",
        gameObjects: {
            hero: new GameObject({
                x: 5,
                y: 2
            }),  
            hero2: new GameObject({
                x: 10,
                y: 7,
                src: "./images/characters/people/npc1.png"
            })
        }
    }
};
