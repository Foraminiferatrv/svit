import {Game as MainGame} from './scenes/Game';

import {AUTO, Game} from 'phaser';
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js';


//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    plugins: {
        global: []
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0, x: 0},
            // debug: true,
            debugShowBody: true,
            debugShowStaticBody: true
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
