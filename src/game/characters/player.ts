import {Character, type CharacterConfig} from "./character.ts";
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
            origin: {
                x: 0,
                y: 0
            }
        })

        this.setOrigin(0, 0)
        this.setInteractive();

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

        //TEST
        let shootInterval: number | null = null;

        this.scene.input.on('pointerdown', (pointer: Pointer) => {
            const shoot =
                () => {

                    const arrow = this.scene.add.image(this.x, this.y + 30, "arrow")
                    this.scene.physics.world.enableBody(arrow);

                    const relativePosition = pointer.positionToCamera(this.scene.cameras.main)
                    const x = relativePosition?.x;
                    const y = relativePosition?.y;

                    let angle = Phaser.Math.Angle.Between(this.x, this.y, x, y);


                    arrow.setRotation(angle)
                    this.scene.physics.moveTo(arrow, x, y, 2000)

                    setTimeout(() => {
                        arrow.destroy()
                    }, 1000)

                }
            shoot()
            shootInterval = setInterval(shoot, 100)


        })
        this.scene.input.on('pointerup', () => {
            if (shootInterval) clearInterval(shootInterval)
        })


        this.scene.cameras.main.startFollow(this);

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
            this.anims.play('up', true);
            this.setVelocity(DIAG_SPEED, -DIAG_SPEED)
        } else if (this.#moveN?.isDown && this.#moveW?.isDown) {
            //NW
            this.anims.play('up', true);
            this.setVelocity(-DIAG_SPEED, -DIAG_SPEED)
        } else if (this.#moveS?.isDown && this.#moveE?.isDown) {
            //SE
            this.anims.play('down', true);
            this.setVelocity(DIAG_SPEED, DIAG_SPEED)
        } else if (this.#moveS?.isDown && this.#moveW?.isDown) {
            //SW
            this.anims.play('down', true);
            this.setVelocity(-DIAG_SPEED, DIAG_SPEED)
        } else if (this.#moveW?.isDown) {
            //W
            this.anims.play('walk-x', true);
            this.flipX = false;
            this.setVelocity(-this.speed, 0)
        } else if (this.#moveE?.isDown) {
            //E
            this.anims.play('walk-x', true);
            this.flipX = true;
            this.setVelocity(this.speed, 0)

        } else if (this.#moveN?.isDown) {
            //N
            this.anims.play('up', true);
            this.setVelocity(0, -this.speed)

        } else if (this.#moveS?.isDown) {
            //S
            this.anims.play('down', true);
            this.setVelocity(0, this.speed)

        } else {
            this.setVelocity(0, 0)
        }
    }

    handleUpdate() {
        this.handleMovement();
    }

}

export class LocalPlayer extends Player {

}