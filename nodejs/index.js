const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const candidates = [
  path.join(__dirname, 'build'),
  path.join(__dirname, '..', 'build'),
  path.join(process.cwd(), 'build'),
];

const buildPath = candidates.find((dir) => fs.existsSync(path.join(dir, 'index.html')));

if (!buildPath) {
  console.error('React build folder not found. Looked in:', candidates);
  app.get('*', (req, res) => {
    res.status(500).send('Build folder missing. Check Hostinger output directory is set to build.');
  });
  app.listen(PORT);
  module.exports = app;
  return;
}

app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend serving ${buildPath} on port ${PORT}`);
});

module.exports = app;
