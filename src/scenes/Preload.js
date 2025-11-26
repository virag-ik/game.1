export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }
  preload() {
    // Assassin sprites (we'll add real PNGs next)
    this.load.spritesheet('assassin-idle', 'assets/spritesheets/assassin_idle.png', { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('assassin-walk', 'assets/spritesheets/assassin_walk.png', { frameWidth: 32, frameHeight: 48 });
  }
  create() {
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('assassin-idle', { start: 0, end: 3 }),
      frameRate: 5,
      repeat: -1
    });
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('assassin-walk', { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
    this.scene.start('GameScene');
  }
}