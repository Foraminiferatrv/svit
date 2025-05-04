import {Scene} from 'phaser';
import {Player} from "../characters/player.ts";

import SpriteGrass from 'assets/textures/world/sprGrass.png'
import SandSprite from 'assets/textures/world/sprSand.png'
import WaterSprite from 'assets/textures/world/sprWater.png'
import {Chunk} from "../entities/world/chunk.ts";


export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Player;

    cameraSpeed: number;
    chunkSize: number;
    tileSize: number;
    chunks: Chunk[];
    seed: number;
    // chunks: Phaser.GameObjects.Group;
    // noise: NoiseFunction2D;

    constructor() {
        super('Game');
    }

    //TODO: Add to World class
    getChunk(x: number, y: number) {
        let chunk: Chunk | null = null;

        for (let i = 0; i < this.chunks.length; i++) {
            if (this.chunks[i].x == x && this.chunks[i].y === y) {
                chunk = this.chunks[i]
            }
        }
        return chunk
    }


    preload() {
        this.load.spritesheet('player', 'assets/textures/TX_Player.png', {
            frameWidth: 32,
            frameHeight: 64
        });
        this.load.image('dummy_background', 'assets/textures/TX_Tileset_Grass.png');
        this.load.image('arrow', 'assets/textures/arrow.png');

        //Terrain
        this.load.image("grass", SpriteGrass)
        this.load.image("sand", SandSprite)

        this.load.spritesheet("water", WaterSprite, {
            frameWidth: 16,
            frameHeight: 16
        })


        this.chunkSize = 6; //tiles
        this.tileSize = 16; //px
        this.cameraSpeed = 10;
        this.chunks = [];
        // this.chunks = this.add.group([]);

    }

    create() {
        //Camera

        // this.seed = Math.random();
        this.seed = 499;


        this.camera = this.cameras.main;
        this.camera.setBackgroundColor("#1B1B1B");

        this.add.image(0, 0, 'dummy_background');

        this.anims.create({
            key: "waterAnimation",
            frames: this.anims.generateFrameNumbers("water"),
            frameRate: 3,
            repeat: -1
        });

        this.player = new Player({scene: this, spriteKey: "player"})
    }

    update() {
        this.player.handleUpdate();

        //Chunks
        let chunkPositionX = (this.chunkSize * this.tileSize) * Math.round(this.player.x / (this.chunkSize * this.tileSize));
        let chunkPositionY = (this.chunkSize * this.tileSize) * Math.round(this.player.y / (this.chunkSize * this.tileSize));

        chunkPositionX = chunkPositionX / this.chunkSize / this.tileSize;
        chunkPositionY = chunkPositionY / this.chunkSize / this.tileSize;

        //Create chunks around player chunk position if they don't exist
        for (let x = chunkPositionX - 2; x < chunkPositionX + 2; x++) {
            for (let y = chunkPositionY - 2; y < chunkPositionY + 2; y++) {
                const existingChunk = this.getChunk(x, y);

                if (!existingChunk) {
                    this.chunks.push(new Chunk(this, x, y))
                }
            }
        }

        //Loading/unloading chunks:
        for (let i = 0; i < this.chunks.length; i++) {
            let chunk = this.chunks[i];

            if (chunk) {
                if (Phaser.Math.Distance.Between(
                    chunkPositionX,
                    chunkPositionY,
                    chunk.x,
                    chunk.y,
                ) < 3) {
                    chunk.load();
                } else {
                    // chunk.unload();
                }
            }
        }

    }
}
