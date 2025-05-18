import {Game} from "../../scenes/Game.ts";
import {Noise} from "noisejs";

import Tilemap = Phaser.Tilemaps.Tilemap;
import Tileset = Phaser.Tilemaps.Tileset;


type WorldConstructor = { game: Game, seed: number, tileSize: number, tileMapScale?: number }


export class World {
    tileMap: Tilemap;
    private tileSet: Tileset;
    tileMapScale: number;
    game: Game;
    seed: number;
    tileSize: number;

    constructor({game, seed, tileSize, tileMapScale = 100}: WorldConstructor) {
        this.game = game;
        this.seed = seed;
        this.tileSize = tileSize;
        this.tileMapScale = tileMapScale;

        console.time("The world has been generated in: ")
        this.generateTerrain()
        console.timeEnd("The world has been generated in: ")

    }

    generateTerrain() {
        const noise = new Noise(this.seed);

        const worldStart = -1000;
        const worldEnd = 1000;

        //generate tile data
        const mapData = []
        const perlinScale = 100;

        for (let x = worldStart; x < worldEnd; x++) {
            const row = [];
            for (let y = worldStart; y < worldEnd; y++) {
                const perlinValue = noise.perlin2(x / perlinScale, y / perlinScale);
                //Assign sprite to a tile
                if (perlinValue < -0.2) {
                    row.push(0)
                } else if (perlinValue >= -0.2 && perlinValue < 0.1) {
                    row.push(1)
                } else if (perlinValue >= 0.1) {
                    row.push(2)
                }
            }
            mapData.push(row)
        }

        this.tileMap = this.game.make.tilemap({data: mapData, tileHeight: this.tileSize, tileWidth: this.tileSize,});

        const tileSet = this.tileMap.addTilesetImage("terrain", "terrain", this.tileSize, this.tileSize, 0,3);
        if (tileSet) {
            this.tileMap.createLayer(0, tileSet, worldStart * this.tileSize, worldStart * this.tileSize);
            // this.tileMap.setCollisionBetween()
        }

    }
}