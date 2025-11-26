DESCENT/
├── src/
│   ├── scenes/
│   │   ├── Boot.js
│   │   ├── Preload.js
│   │   ├── MainMenu.js
│   │   ├── GameScene.js          (the big one – all floors, bots, collapse)
│   │   ├── HUD.js
│   │   ├── GameOver.js
│   │   └── Victory.js
│   ├── players/
│   │   ├── Player.js
│   │   ├── BotAI.js
│   │   └── AssassinSprite.js     (Hunter Assassin-style animations)
│   ├── weapons/
│   │   ├── WeaponBase.js
│   │   ├── Pistol.js, AK.js, Sniper.js, Knife.js …
│   ├── systems/
│   │   ├── FloorManager.js       (collapses floor every 2 min)
│   │   ├── LootSystem.js
│   │   ├── ParachuteDrop.js
│   │   └── ElevatorSystem.js
│   ├── ui/
│   │   ├── Minimap.js
│   │   ├── KillFeed.js
│   │   └── Joystick.js           (mobile controls)
│   └── utils/
│       ├── Constants.js
│       └── Helpers.js
│
├── assets/
│   ├── spritesheets/
│   │   ├── assassin_walk.png     (8-dir, 8 frames each – exactly Hunter Assassin style)
│   │   ├── assassin_idle.png
│   │   ├── assassin_shoot.png
│   │   └── death_squash.png
│   ├── tiles/
│   │   └── floors_01.png         (10 unique floor themes)
│   ├── audio/
│   │   ├── sfx_shoot.mp3
│   │   ├── floor_collapse.mp3
│   │   └── bgm_tension.mp3
│   └── fonts/
│       └── cyber.ttf
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── config/
│   └── webpack.config.js
│
└── package.json