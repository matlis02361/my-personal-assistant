// /server.js

// Mały serwer Express z endpointem /ask z integracją OpenAI
// Komentarze po polsku. Stały tekst po niemiecku.

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config({ path: process.env.ENV_PATH || '/home/matlis02361/.env' }); // pozwól na globalny .env

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const API_TOKEN = process.env.API_TOKEN || 'changeme';
const OPENAI_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || null;

let openaiClient = null;
if (OPENAI_KEY) {
  openaiClient = new OpenAI({ apiKey: OPENAI_KEY });
  console.log('openai: client initialized');
} else {
  console.log('openai: API key not provided, endpoint will return stub');
}

// Middleware prostego zabezpieczenia tokenowego
function requireToken(req, res, next) {
  const token = req.headers['x-api-token'] || req.query.token;
  if (token !== API_TOKEN) {
    console.error('auth: invalid token');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Prosty endpoint /ask — wywołuje OpenAI jeśli dostępny
app.post('/ask', requireToken, (req, res) => {
  console.log('/ask: received', { body: req.body });
  const question = req.body && (req.body.question || req.body.prompt);

  if (!question) {
    console.error('/ask: missing question in request body');
    return res.status(400).json({ error: 'Missing question in body' });
  }

  if (!openaiClient) {
    console.log('/ask: OpenAI client not available, returning stub');
    return res.json({ answer: 'Stub response — OpenAI key not configured on server' });
  }

  // Wysyłamy zapytanie do OpenAI Chat Completions
  // Używamy promiseów i .catch() (bez try-catch)
  openaiClient.chat.completions
    .create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that answers based on user data.' },
        { role: 'user', content: question }
      ],
      max_tokens: 400
    })
    .then((response) => {
      // Odczyt odpowiedzi w różnych formatach
      const text =
        (response && response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content) ||
        (response && response.output && response.output[0] && response.output[0].content && response.output[0].content[0] && response.output[0].content[0].text) ||
        JSON.stringify(response);

      console.log('/ask: openai responded');
      res.json({ answer: text });
    })
    .catch((err) => {
      console.error('/ask: openai error', err && err.message ? err.message : err);
      res.status(500).json({ error: 'OpenAI error' });
    });
});

app.listen(PORT, () => console.log('server: listening on port', PORT));

module.exports = app;
