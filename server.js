// server.js → now just serves files (super lightweight)
const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(__dirname));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`SHRINKZONE SOLO live on ${port}`));