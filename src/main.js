import Phaser from 'phaser'

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: { default: 'arcade', arcade: { debug: false } },
  scene: { preload, create, update }
}

new Phaser.Game(config)

let player, bots = [], bullets = [], walls = []
let floor = 0, collapseTimer = 120, kills = 0, health = 100
let timerText, aliveText, killText, floorText

function preload() {
  // Hunter Assassin exact sprites (free)
  this.load.spritesheet('assassin', 'https://i.imgur.com/2tR7v9N.png', { frameWidth: 64, frameHeight: 64 })
  this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullet.png')
  this.load.image('wall', 'https://labs.phaser.io/assets/sprites/block.png')
}

function create() {
  this.cameras.main.setBackgroundColor('#0a0a1a')

  // Walls (cover)
  for(let i = 0; i < 80; i++) {
    const w = this.add.rectangle(Math.random()*4000, Math.random()*4000, 180, 180, 0x333344)
    this.physics.add.existing(w, true)
    walls.push(w)
  }

  // Player parachute
  player = this.physics.add.sprite(2000, -200, 'assassin').setScale(2.2)
  player.health = 100
  this.tweens.add({ targets: player, y: 800, duration: 2500, ease: 'Power2' })

  // 99 Bots
  for(let i = 0; i < 99; i++) {
    const bot = this.physics.add.sprite(1500 + Math.random()*1000, -200 - i*10, 'assassin').setScale(2.2)
    bot.health = 100
    this.tweens.add({ targets: bot, y: 800, duration: 2500 + i*10, ease: 'Power2' })
    bots.push(bot)
  }

  // Animations
  this.anims.create({ key: 'walk', frames: this.anims.generateFrameNumbers('assassin', { start: 0, end: 7 }), frameRate: 12, repeat: -1 })
  player.anims.play('walk', true)
  bots.forEach(b => b.anims.play('walk', true))

  // UI
  timerText = this.add.text(20, 20, 'COLLAPSE: 120s', { fontSize: '28px', color: '#ff0044' }).setScrollFactor(0)
  aliveText = this.add.text(20, 70, 'ALIVE: 100', { fontSize: '28px', color: '#0f0' }).setScrollFactor(0)
  killText = this.add.text(20, 120, 'KILLS: 0', { fontSize: '28px', color: '#ff0' }).setScrollFactor(0)
  floorText = this.add.text(20, 170, 'FLOOR: 0', { fontSize: '28px', color: '#00f' }).setScrollFactor(0)

  // Mobile joystick (touch)
  this.input.addPointer(2)

  // Shooting
  this.input.on('pointerdown', pointer => shoot(player, pointer))

  this.cameras.main.startFollow(player, true, 0.09, 0.09)
  this.cameras.main.setBounds(0, 0, 4000, 4000)
}

function shoot(shooter, pointer) {
  if (!shooter.active) return
  const angle = Phaser.Math.Angle.Between(shooter.x, shooter.y, pointer.worldX, pointer.worldY)
  const bullet = this.physics.add.sprite(shooter.x, shooter.y, 'bullet').setScale(1.5)
  bullet.setVelocity(Math.cos(angle)*900, Math.sin(angle)*900)
  bullets.push(bullet)
}

function update(time, delta) {
  // Player movement
  const cursors = this.input.keyboard.createCursorKeys()
  const speed = 280
  player.setVelocity(0)
  if (cursors.left.isDown || this.input.pointer1.isDown && this.input.pointer1.x < innerWidth/2) player.setVelocityX(-speed)
  if (cursors.right.isDown || this.input.pointer1.isDown && this.input.pointer1.x > innerWidth/2) player.setVelocityX(speed)
  if (cursors.up.isDown) player.setVelocityY(-speed)
  if (cursors.down.isDown) player.setVelocityY(speed)

  // Bot AI
  bots.forEach(bot => {
    if (!bot.active || bot.health <= 0) return
    const angle = Phaser.Math.Angle.Between(bot.x, bot.y, player.x, player.y)
    const dist = Phaser.Math.Distance.Between(bot.x, bot.y, player.x, player.y)
    if (dist < 500) {
      bot.setVelocity(Math.cos(angle)*180, Math.sin(angle)*180)
      if (Math.random() < 0.03) shoot(bot, { worldX: player.x, worldY: player.y })
    } else {
      bot.setVelocity((Math.random()-0.5)*100, (Math.random()-0.5)*100)
    }
  })

  // Bullets
  bullets = bullets.filter(b => {
    if (b.x < 0 || b.x > 4000 || b.y < 0 || b.y > 4000) { b.destroy(); return false }
    // Hit player
    if (Phaser.Math.Distance.Between(b.x, b.y, player.x, player.y) < 40) {
      player.health -= 34; b.destroy(); return false
    }
    // Hit bots
    bots.forEach(bot => {
      if (bot.health > 0 && Phaser.Math.Distance.Between(b.x, b.y, bot.x, bot.y) < 40) {
        bot.health -= 34; b.destroy();
        if (bot.health <= 0) { bot.setTint(0x000000); kills++ }
      }
    })
    return true
  })

  // Floor collapse
  collapseTimer -= delta/1000
  timerText.setText(`COLLAPSE: ${Math.ceil(collapseTimer)}s`)
  if (collapseTimer <= 0) {
    collapseTimer = 120
    floor++
    this.add.text(player.x, player.y - 200, `FLOOR ${floor} COLLAPSED!`, { fontSize: '48px', color: '#ff0044' }).setOrigin(0.5).setLifetime(3000)
  }
  floorText.setText(`FLOOR: ${floor}`)

  // Kill low-floor bots
  bots = bots.filter(b => b.health > 0 && b.y < (floor + 8) * 400)

  aliveText.setText(`ALIVE: ${bots.filter(b => b.health > 0).length + 1}`)
  killText.setText(`KILLS: ${kills}`)

  if (player.health <= 0) {
    this.add.text(innerWidth/2, innerHeight/2, 'YOU DIED', { fontSize: '80px', color: '#ff0000' }).setScrollFactor(0).setOrigin(0.5)
    this.scene.pause()
  }
  if (bots.filter(b => b.health > 0).length === 0) {
    this.add.text(innerWidth/2, innerHeight/2, 'VICTORY ROYALE!', { fontSize: '80px', color: '#00ff00' }).setScrollFactor(0).setOrigin(0.5)
    this.scene.pause()
  }
}