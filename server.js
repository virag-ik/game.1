const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static('.'));  // Add this
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));  // Add this

app.get('/', (req,res)=>res.send('Server running - open client HTML'));  // Keep or remove this old one

const players = {};
const bullets = [];
let safeRadius = 900;
let shrinkTimer = 45;

io.on('connection', socket => {
  console.log('player joined', socket.id);
  players[socket.id] = {
    x: 1000 + Math.random()*400-200,
    y: 1000 + Math.random()*400-200,
    alive: true,
    name: 'guest'+Math.floor(Math.random()*9999)
  };

  socket.on('move', dir => {
    if(!players[socket.id]?.alive) return;
    players[socket.id].x += dir.dx;
    players[socket.id].y += dir.dy;
  });

  socket.on('shoot', target => {
    if(!players[socket.id]?.alive) return;
    bullets.push({
      x: players[socket.id].x,
      y: players[socket.id].y,
      vx: (target.x - players[socket.id].x)/15,
      vy: (target.y - players[socket.id].y)/15,
      owner: socket.id
    });
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
  });
});

// game loop
setInterval(() => {
  // move bullets
  for(let i=bullets.length-1; i>=0; i--){
    const b = bullets[i];
    b.x += b.vx; b.y += b.vy;

    // hit detection
    Object.entries(players).forEach(([id, p])=>{
      if(!p.alive) return;
      if(Math.hypot(p.x-b.x, p.y-b.y) < 20 && id !== b.owner){
        p.alive = false;
        checkWinner();
      }
    });

    if(b.x<0 || b.x>2000 || b.y<0 || b.y>2000) bullets.splice(i,1);
  }

  // shrink zone
  shrinkTimer--;
  if(shrinkTimer <= 0){
    safeRadius *= 0.8;
    shrinkTimer = 45;
    io.emit('shrink', safeRadius);

    // kill players outside zone
    Object.values(players).forEach(p=>{
      if(p.alive && Math.hypot(p.x-1000, p.y-1000) > safeRadius+20){
        p.alive = false;
      }
    });
    checkWinner();
  }
  io.emit('timer', shrinkTimer);

  // broadcast state
  io.emit('state', {players, bullets});
}, 33);

function checkWinner(){
  const alive = Object.values(players).filter(p=>p.alive);
  if(alive.length === 1){
    io.emit('chat', {msg: alive[0].name + ' WINS THE GAME!!!'});
    // reset in 10 sec
    setTimeout(()=>location.reload(), 10000);
  }
}

const port = process.env.PORT || 3000;  // Add this for Render
server.listen(port, () => console.log('SHRINKZONE live on port ' + port));