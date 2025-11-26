// server.js  (put this in the root, same level as package.json)

const express = require('express');
const path = require('path');
const app = express();

// Serve all static files from the dist folder (after vite build)
app.use(express.static(path.join(__dirname, 'dist')));

// For any route, send the main index.html (SPA handling)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Render gives us process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DESCENT live on port ${PORT}`);
});