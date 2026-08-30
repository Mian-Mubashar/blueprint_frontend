const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

const candidates = [
  path.join(__dirname, '..', 'build'),
  path.join(__dirname, 'build'),
];

const buildPath = candidates.find((dir) => fs.existsSync(path.join(dir, 'index.html')));

if (!buildPath) {
  console.error('React build folder not found. Looked in:', candidates);
  process.exit(1);
}

app.use(express.static(buildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend serving ${buildPath} on port ${PORT}`);
});

module.exports = app;
