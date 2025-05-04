import {Noise} from 'noisejs';
// import {createNoise2D, type NoiseFunction2D} from 'simplex-noise';

import Group = Phaser.GameObjects.Group;
import {Game} from "../../scenes/Game.ts";

class GeneratedTile extends Phaser.GameObjects.Sprite {
    constructor(scene: Game, x: number, y: number, key: string) {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setOrigin(0);
    }
}


export class Chunk {
    scene: Game;
    x: number;
    y: number;
    tiles: Group;
    isLoaded: boolean;
    chunkSize: number;
    tileSize: number;

    // noise: NoiseFunction2D;


    constructor(scene: Game, x: number, y: number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.tiles = this.scene.add.group();

        this.isLoaded = false;
        this.chunkSize = scene.chunkSize;
        this.tileSize = scene.tileSize;

        const SEED = 500;
    }

    private generateTiles() {
        for (let x = 0; x < this.chunkSize; x++) {
            for (let y = 0; y < this.chunkSize; y++) {
                const tileX = (this.x * (this.chunkSize * this.tileSize)) + (x * this.tileSize);
                const tileY = (this.y * (this.chunkSize * this.tileSize)) + (y * this.tileSize);


                // const noise = new Noise(this.scene.seed)


                const perlinValue = this.scene.noise.perlin2(tileX / 100, tileY / 100)
                console.log({tileX, tileY, perlinValue})

                let key = "";
                let animationKey = "";


                //Assign sprite to a tile
                if (perlinValue < -0.2) {
                    key = "water";
                    animationKey = "waterAnimation";
                } else if (perlinValue >= -0.2 && perlinValue < 0.1) {
                    key = "sand";
                } else if (perlinValue >= 0.1) {
                    key = "grass";
                }

                const tile = new GeneratedTile(this.scene, tileX, tileY, key);
                tile.z = 5;


                if (animationKey !== "") {
                    tile.play(animationKey);
                }

                this.tiles.add(tile);

            }
        }

        this.isLoaded = true;
    }

    load() {
        if (!this.isLoaded) {
            this.generateTiles();
            console.log("LOADed")
        }
    }

    unload() {
        if (this.isLoaded) {
            this.tiles.clear(true, true);

            this.isLoaded = false;
        }
    }
}

