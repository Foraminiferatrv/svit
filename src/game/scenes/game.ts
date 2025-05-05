import {Scene} from 'phaser';
import {Player} from "../characters/player.ts";

import SpriteGrass from 'assets/textures/world/sprGrass.png'
import SandSprite from 'assets/textures/world/sprSand.png'
import WaterSprite from 'assets/textures/world/sprWater.png'
import {Chunk} from "../entities/world/chunk_2.ts";
import {Noise} from "noisejs";
import {ChunkData, ChunkGeneratorParams} from "../entities/world/chunk_2.ts";

// import workerScript from '../utils/worker.ts'


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
    // noise: Noise;

    worldGenWorker: Worker;

    constructor() {
        super('Game');
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


        this.chunkSize = 16; //tiles
        this.tileSize = 16; //px
        this.cameraSpeed = 10;
        this.chunks = [];

        this.seed = 499;
        // this.noise = new Noise(this.seed);

        this.worldGenWorker = new Worker(new URL('../utils/worker.ts', import.meta.url), {
            type: "module"
        })

        this.worldGenWorker.onmessage = (event: MessageEvent<ChunkData[]>) => {
            const chunksData = event.data
            console.log(chunksData)

            for (let i = 0; i < chunksData.length; i++) {
                let chunkData = chunksData[i];
                const chunk = new Chunk({
                    scene: this,
                    x: chunkData.x,
                    y: chunkData.y,
                    tilesData: chunkData.tiles,
                    chunkRelativePositionX: chunkData.chunkRelativePositionX,
                    chunkRelativePositionY: chunkData.chunkRelativePositionY
                })

                this.chunks.push(chunk);
            }
        };


        // this.chunks = this.add.group([]);

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

    create() {
        //Camera

        // this.seed = Math.random();


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

        //Generate chunks
        const chunkGeneratorParams: ChunkGeneratorParams = {
            playerX: this.player.x,
            playerY: this.player.y,
            seed: this.seed,
            chunkSize: this.chunkSize,
            tileSize: this.tileSize
        }

        // this.worldGenWorker.postMessage(chunkGeneratorParams)


        //Loading/unloading chunks:
        // for (let i = 0; i < this.chunks.length; i++) {
        //     let chunk = this.chunks[i];
        //
        //     if (chunk) {
        //         if (Phaser.Math.Distance.Between(
        //             chunk.chunkRelativePositionX,
        //             chunk.chunkRelativePositionY,
        //             chunk.x,
        //             chunk.y,
        //         ) < 3) {
        //             chunk.load();
        //         } else {
        //             chunk.unload();
        //         }
        //     }
        // }


        // this.updateChunks()
    }


    updateChunks() {

        //Chunks
        let chunkRelativePositionX = (this.chunkSize * this.tileSize) * Math.round(this.player.x / (this.chunkSize * this.tileSize));
        let chunkRelativePositionY = (this.chunkSize * this.tileSize) * Math.round(this.player.y / (this.chunkSize * this.tileSize));
        chunkRelativePositionX = chunkRelativePositionX / this.chunkSize / this.tileSize;
        chunkRelativePositionY = chunkRelativePositionY / this.chunkSize / this.tileSize;

        //Create chunks around player chunk position if they don't exist
        for (let x = chunkRelativePositionX - 2; x < chunkRelativePositionX + 2; x++) {
            for (let y = chunkRelativePositionY - 2; y < chunkRelativePositionY + 2; y++) {
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
                    chunkRelativePositionX,
                    chunkRelativePositionY,
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
