export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }
  preload() {
    this.load.image('phaser-logo', 'https://labs.phaser.io/assets/sprites/phaser-logo-small.png');
  }
  create() {
    this.add.image(400, 300, 'phaser-logo');
    this.time.delayedCall(2000, () => this.scene.start('PreloadScene'));
  }
}