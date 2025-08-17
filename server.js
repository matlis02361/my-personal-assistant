// /server.js

// Mały serwer Express ze stubem endpointu /ask
// Komentarze po polsku. Stały tekst po niemiecku.

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const API_TOKEN = process.env.API_TOKEN || 'changeme';

// Middleware prostego zabezpieczenia tokenowego
function requireToken(req, res, next) {
  const token = req.headers['x-api-token'] || req.query.token;
  if (token !== API_TOKEN) {
    console.error('auth: invalid token');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Prosty endpoint /ask — obecnie stub
app.post('/ask', requireToken, (req, res) => {
  console.log('/ask: received', { body: req.body });
  // W przyszłości: parsowanie zapytania, wyszukiwanie w lokalnym JSON/DB, zapytanie do OpenAI
  res.json({ answer: 'Stub response — integrate OpenAI client here' });
});

app.listen(PORT, () => console.log('server: listening on port', PORT));

module.exports = app;
