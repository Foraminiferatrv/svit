import {Scene} from 'phaser';
import {Player} from "../characters/player.ts";

import SpriteGrass from 'assets/textures/world/sprGrass.png'
import SandSprite from 'assets/textures/world/sprSand.png'
import TerrainSprite from 'assets/textures/world/terrain.png'
import WaterSprite from 'assets/textures/world/sprWater.png'
import {Chunk} from "../entities/world/chunk.ts";
import {World} from "../entities/world/world.ts";
import Tile = Phaser.Tilemaps.Tile;


export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Player;
    cameraSpeed: number;
    tileSize: number;
    seed: number;
    world: World;


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
        this.load.image("terrain", TerrainSprite);

        this.load.spritesheet("water", WaterSprite, {
            frameWidth: 16,
            frameHeight: 16
        })


        this.tileSize = 16; //px
        this.cameraSpeed = 10;

        this.seed = 499;

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


        this.world = new World({
            game: this,
            tileSize: this.tileSize,
            seed: 507,
            tileMapScale: 100,
        });


        this.player = new Player({scene: this, spriteKey: "player", speed: 1000})

        // const spawnTile = this.world.tileMap.getTileAt(this.player.x, this.player.y);
        // if (spawnTile?.index === 2) {
        //     const closestGrass = this.world.tileMap.findByIndex(3)
        //     this.player.x = closestGrass?.x || this.player.x;
        //     this.player.y = closestGrass?.y || this.player.x;
        //
        // }

        // console.log({spawnTile, closestGrass, map: this.world.tileMap.findByIndex(3)})

    }

    update() {
        this.player.handleUpdate();
        console.log(this.player.x.toFixed(), this.player.y.toFixed())
        const pos = this.world.tileMap.getTileAt(this.player.x?.toFixed(), this.player.y?.toFixed())
        console.log({pos: pos})

        // this.generateTiles()

    }

}
