import Phaser from 'phaser';
import BootScene from './scenes/Boot.js';
import PreloadScene from './scenes/Preload.js';
import GameScene from './scenes/GameScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#000000',
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: [BootScene, PreloadScene, GameScene]
};

new Phaser.Game(config);