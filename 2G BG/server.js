const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: "*" }
});

const players = {};
const bullets = [];
let safeRadius = 900;
let shrinkTimer = 45;

io.on('connection', socket => {
  console.log('Player joined:', socket.id);

  players[socket.id] = {
    x: 1000 + (Math.random()-0.5)*400,
    y: 1000 + (Math.random()-0.5)*400,
    alive: true,
    name: 'Player' + Math.floor(Math.random()*9999)
  };

  socket.on('move', dir => {
    if (!players[socket.id]?.alive) return;
    players[socket.id].x += dir.dx;
    players[socket.id].y += dir.dy;
  });

  socket.on('shoot', target => {
    if (!players[socket.id]?.alive) return;
    bullets.push({
      x: players[socket.id].x,
      y: players[socket.id].y,
      vx: (target.x - players[socket.id].x) / 12,
      vy: (target.y - players[socket.id].y) / 12,
      owner: socket.id
    });
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    console.log('Player left:', socket.id);
  });
});

// Game loop (30 FPS)
setInterval(() => {
  // Move bullets
  for (let i = bullets.length-1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx;
    b.y += b.vy;

    // Hit detection
    for (const id in players) {
      const p = players[id];
      if (p.alive && id !== b.owner && Math.hypot(p.x-b.x, p.y-b.y) < 25) {
        p.alive = false;
        io.emit('chat', {msg: `${players[b.owner]?.name || 'Someone'} killed ${p.name}!`});
        checkWinner();
      }
    }

    if (b.x < 0 || b.x > 2000 || b.y < 0 || b.y > 2000) bullets.splice(i,1);
  }

  // Shrink zone
  shrinkTimer--;
  if (shrinkTimer <= 0) {
    safeRadius *= 0.85;
    shrinkTimer = 45;
    io.emit('shrink', safeRadius);

    // Kill outside zone
    for (const id in players) {
      const p = players[id];
      if (p.alive && Math.hypot(p.x-1000, p.y-1000) > safeRadius + 30) {
        p.alive = false;
        io.emit('chat', {msg: `${p.name} died to the zone!`});
      }
    }
    checkWinner();
  }
  io.emit('timer', shrinkTimer);
  io.emit('state', {players, bullets});
}, 33);

function checkWinner() {
  const alive = Object.values(players).filter(p => p.alive);
  if (alive.length === 1) {
    io.emit('chat', {msg: `🎉 ${alive[0].name} WINS THE GAME! 🎉`});
    setTimeout(() => {
      // Reset game
      Object.keys(players).forEach(id => {
        players[id].x = 1000 + (Math.random()-0.5)*400;
        players[id].y = 1000 + (Math.random()-0.5)*400;
        players[id].alive = true;
      });
      safeRadius = 900;
      shrinkTimer = 45;
    }, 8000);
  }
}

server.listen(3000, () => console.log('SHRINKZONE running → http://localhost:3000'));