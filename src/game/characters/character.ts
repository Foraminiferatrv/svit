import {type Scene} from "phaser";
import {MOVE_SPEED} from "../constants.ts";
import SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;


export interface CharacterConfig {
    scene: Scene;
    spriteKey: string;
    speed?: number;
    origin?: {
        x: number;
        y: number;
    },

}

export class Character {
    #directionAngle: number = 0;
    public readonly speed: number;

    readonly #scene: Scene;
    readonly #sprite: SpriteWithDynamicBody;


    constructor({scene, spriteKey, speed = MOVE_SPEED, origin}: CharacterConfig) {
        this.#scene = scene;
        this.speed = speed;


        this.#sprite = this.#scene.physics.add.sprite(0, 0, spriteKey).setOrigin(origin?.x || 0, origin?.y || 0);


        // this.#scene.input.on('pointermove', (pointer: Pointer) => {
        //     let angle = Math.Angle.Between(this.#sprite.x, this.#sprite.y, pointer.x + this.#scene.cameras.main.scrollX, pointer.y + this.#scene.cameras.main.scrollY)
        //     console.log({angle})
        //     this.#directionAngle = angle;
        // })
    }

    moveToDirection() {


    }

    get sprite() {
        return this.#sprite;
    }

    get scene() {
        return this.#scene;
    }

    get direction() {
        return this.#directionAngle;
    }

    set directionAngle(angle: number) {
        this.#directionAngle = angle;
    }
}