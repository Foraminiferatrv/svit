import {Game as MainGame} from './scenes/Game';

import {Game} from 'phaser';
import Zoom = Phaser.Scale.Zoom;


//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.WEBGL,
    width: 1024,
    height: 768,
    parent: 'game-container',
    scale: {
        zoom: Zoom.ZOOM_4X
    },
    backgroundColor: '#028af8',
    plugins: {
        global: []
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0, x: 0},
            debug: true,
            debugShowBody: true,
            debugShowStaticBody: true,
            debugShowVelocity: true
        }
    },
    scene: [
        MainGame,
    ]
};

const StartGame = (parent: string) => {

    return new Game({...config, parent});

}

export default StartGame;
