import {Scene} from 'phaser';
import {Player} from "../characters/player.ts";


export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    player: Player;

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
    }

    create() {
        //Camera
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor("#1B1B1B");

        this.add.image(0, 0, 'dummy_background');

        this.player = new Player({scene: this, spriteKey: "player"})
    }

    update() {
        this.player.handleUpdate();


    }


}
