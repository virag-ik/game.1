export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }
  create() {
    // Roof floor (gray tiles)
    this.add.tileSprite(0, 0, 800, 600, 'roof-bg').setOrigin(0);

    // Player assassin
    this.player = this.add.sprite(400, 300, 'assassin-idle').setScale(2).play('idle');
    this.cursors = this.input.keyboard.createCursorKeys();

    // Camera follow
    this.cameras.main.startFollow(this.player);
  }
  update() {
    const speed = 200;
    if (this.cursors.left.isDown) this.player.setVelocityX(-speed).play('walk', true).flipX = true;
    else if (this.cursors.right.isDown) this.player.setVelocityX(speed).play('walk', true).flipX = false;
    else if (this.cursors.up.isDown) this.player.setVelocityY(-speed).play('walk', true);
    else if (this.cursors.down.isDown) this.player.setVelocityY(speed).play('walk', true);
    else {
      this.player.setVelocity(0).play('idle', true);
    }
  }
}