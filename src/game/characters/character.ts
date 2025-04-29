import {type Scene} from "phaser";
import {MOVE_SPEED} from "../constants.ts";
import Sprite = Phaser.Physics.Arcade.Sprite;


export interface CharacterConfig {
    scene: Scene;
    spriteKey: string;
    speed?: number;
    origin?: {
        x: number;
        y: number;
    },

}

export class Character extends Sprite {
    #directionAngle: number = 0;
    public readonly speed: number;

    constructor({scene, spriteKey, speed = MOVE_SPEED, origin}: CharacterConfig) {
        super(scene, origin?.x || 0, origin?.y || 0, spriteKey)

        this.speed = speed;
        this.name = spriteKey;

        scene.physics.world.enableBody(this);
        scene.add.existing(this)


        // this.#scene.input.on('pointermove', (pointer: Pointer) => {
        //     let angle = Math.Angle.Between(this.#sprite.x, this.#sprite.y, pointer.x + this.#scene.cameras.main.scrollX, pointer.y + this.#scene.cameras.main.scrollY)
        //     console.log({angle})
        //     this.#directionAngle = angle;
        // })
    }

    moveToDirection() {


    }


    get direction() {
        return this.#directionAngle;
    }

    set directionAngle(angle: number) {
        this.#directionAngle = angle;
    }
}