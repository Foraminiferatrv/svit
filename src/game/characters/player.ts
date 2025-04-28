import {Character, type CharacterConfig} from "./character.ts";
import {Math} from "phaser";
import Pointer = Phaser.Input.Pointer;


export interface PlayerConfig extends CharacterConfig {

}


export class Player extends Character {
    #moveN: Phaser.Input.Keyboard.Key | undefined;
    #moveS: Phaser.Input.Keyboard.Key | undefined;
    #moveW: Phaser.Input.Keyboard.Key | undefined;
    #moveE: Phaser.Input.Keyboard.Key | undefined;


    constructor(config: PlayerConfig) {
        super({
            ...config,
        })

        this.scene.anims.create({
            key: 'down',
            frames: this.scene.anims.generateFrameNumbers('player', {start: 0, end: 0}),
            frameRate: 10,
            repeat: 0
        });

        this.scene.anims.create({
            key: 'walk-x',
            frames: this.scene.anims.generateFrameNumbers('player', {start: 2, end: 2}),
            frameRate: 10,
            repeat: 0
        });
        this.scene.anims.create({
            key: 'up',
            frames: this.scene.anims.generateFrameNumbers('player', {start: 1, end: 1}),
            frameRate: 10,
            repeat: 0
        });

        this.scene.input.on('pointermove', (pointer: Pointer) => {
            let angle = Math.Angle.Between(this.sprite.x, this.sprite.y, pointer.x + this.scene.cameras.main.scrollX, pointer.y + this.scene.cameras.main.scrollY)
            console.log({angle})
            this.directionAngle = angle;
        })


        this.scene.cameras.main.startFollow(this.sprite);
        //Input
        this.#moveN = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.#moveS = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.#moveE = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.#moveW = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    }

    handleMovement() {
        const DIAG_SPEED = this.speed / 1.4;

        if (this.#moveN?.isDown && this.#moveE?.isDown) {
            //NE
            this.sprite.anims.play('up', true);
            this.sprite.setVelocity(DIAG_SPEED, -DIAG_SPEED)
        } else if (this.#moveN?.isDown && this.#moveW?.isDown) {
            //NW
            this.sprite.anims.play('up', true);
            this.sprite.setVelocity(-DIAG_SPEED, -DIAG_SPEED)
        } else if (this.#moveS?.isDown && this.#moveE?.isDown) {
            //SE
            this.sprite.anims.play('down', true);
            this.sprite.setVelocity(DIAG_SPEED, DIAG_SPEED)
        } else if (this.#moveS?.isDown && this.#moveW?.isDown) {
            //SW
            this.sprite.anims.play('down', true);
            this.sprite.setVelocity(-DIAG_SPEED, DIAG_SPEED)
        } else if (this.#moveW?.isDown) {
            //W
            this.sprite.anims.play('walk-x', true);
            this.sprite.flipX = false;
            this.sprite.setVelocity(-this.speed, 0)
        } else if (this.#moveE?.isDown) {
            //E
            this.sprite.anims.play('walk-x', true);
            this.sprite.flipX = true;
            this.sprite.setVelocity(this.speed, 0)

        } else if (this.#moveN?.isDown) {
            //N
            this.sprite.anims.play('up', true);
            this.sprite.setVelocity(0, -this.speed)

        } else if (this.#moveS?.isDown) {
            //S
            this.sprite.anims.play('down', true);
            this.sprite.setVelocity(0, this.speed)

        } else {
            this.sprite.setVelocity(0, 0)
        }
    }

    handleUpdate() {
        this.handleMovement();
    }

}

export class LocalPlayer extends Player {

}