import {Noise} from 'noisejs';
import Phaser from "phaser";

// import {createNoise2D, type NoiseFunction2D} from 'simplex-noise';

import Group = Phaser.GameObjects.Group;
import {Game} from "../../scenes/game.ts";


export type TileData = {
    x: number;
    y: number;
    key: string;
    animationKey: string;
};

export type ChunkData = {
    x: number;
    y: number;
    chunkRelativePositionX: number;
    chunkRelativePositionY: number;
    tiles: TileData[];

};

export type ChunkGeneratorParams = {
    playerX: number,
    playerY: number,
    chunkSize: number,
    tileSize: number,
    seed: number,
}


export function generateChunkData({playerX, playerY, chunkSize, tileSize, seed}: ChunkGeneratorParams): ChunkData[] {
    const noise = new Noise(seed);

    function generateTiles() {
        const tilesData: TileData[] = [];

        for (let x = 0; x < chunkSize; x++) {
            for (let y = 0; y < chunkSize; y++) {
                const tileX = (x * (chunkSize * tileSize)) + (x * tileSize);
                const tileY = (y * (chunkSize * tileSize)) + (y * tileSize);

                const perlinValue = noise.perlin2(tileX / 100, tileY / 100)

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

                const tile: TileData = {
                    x: tileX,
                    y: tileY,
                    animationKey,
                    key,
                };

                tilesData.push(tile);
            }
        }

        return tilesData
    }


    function getChunk(x: number, y: number) {
        let chunk: ChunkData | null = null;

        for (let i = 0; i < chunks.length; i++) {
            if (chunks[i].x == x && chunks[i].y === y) {
                chunk = chunks[i]
            }
        }
        return chunk
    }

    let chunks: ChunkData[] = []

    //Chunks
    let chunkRelativePositionX = (chunkSize * tileSize) * Math.round(playerX / (chunkSize * tileSize));
    let chunkRelativePositionY = (chunkSize * tileSize) * Math.round(playerY / (chunkSize * tileSize));
    chunkRelativePositionX = chunkRelativePositionX / chunkSize / tileSize;
    chunkRelativePositionY = chunkRelativePositionY / chunkSize / tileSize;

    //Create chunks around player chunk position if they don't exist
    for (let x = chunkRelativePositionX - 2; x < chunkRelativePositionX + 2; x++) {
        for (let y = chunkRelativePositionY - 2; y < chunkRelativePositionY + 2; y++) {
            const existingChunk = getChunk(x, y);

            if (!existingChunk) {
                const tiles = generateTiles();

                let newChunk: ChunkData = {
                    x,
                    y,
                    chunkRelativePositionX,
                    chunkRelativePositionY,
                    tiles,
                }
                chunks.push(newChunk)
            }
        }
    }

    return chunks;
}

export class GeneratedTile extends Phaser.GameObjects.Sprite {
    constructor(scene: Game, x: number, y: number, key: string) {
        super(scene, x, y, key);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setOrigin(0);
    }
}

type ConstructorParams = {
    scene: Game;
    x: number;
    y: number;
    chunkRelativePositionX: number;
    chunkRelativePositionY: number;
    tilesData: TileData[]
}

export class Chunk {
    scene: Game;
    x: number;
    y: number;
    chunkRelativePositionX: number;
    chunkRelativePositionY: number;
    tiles: Group;
    tilesData: TileData[];
    isLoaded: boolean;


    constructor({scene, x, y, chunkRelativePositionX, chunkRelativePositionY, tilesData}: ConstructorParams) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.tiles = this.scene.add.group();
        this.tilesData = tilesData;

        this.isLoaded = false;
    }


    load() {
        if (!this.isLoaded) {

            this.tilesData.forEach(({key, animationKey, x, y}) => {
                const tile = new GeneratedTile(this.scene, x, y, key);
                tile.z = 5;

                if (animationKey !== "") {
                    tile.play(animationKey);
                }

                this.tiles.add(tile);
            })

            this.isLoaded = true;
        }
    }

    unload() {
        if (this.isLoaded) {
            this.tiles.clear(true, true);

            this.isLoaded = false;
        }
    }
}

