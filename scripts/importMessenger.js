// /scripts/importMessenger.js

// Skrypt importujący pliki JSON z Facebook Messenger (Facebook data download)
// Komentarze po polsku. Stałe teksty po niemiecku.

const fs = require('fs-extra');
const path = require('path');
const { parseMessengerJson } = require('../lib/parseUtils');
const { upsertConversationMessages } = require('../lib/storage');

const INPUT_DIR = process.env.MESSENGER_INPUT_DIR || path.join(__dirname, '..', 'eingang_messenger');
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(__dirname, '..', 'ausgabe', 'messenger');

function importOneFile(filePath) {
  console.log('importMessenger: processing', filePath);
  return fs.readFile(filePath, 'utf8')
    .then((content) => parseMessengerJson(content))
    .then((parsed) => {
      const convoId = (parsed.title || path.basename(filePath, path.extname(filePath))).replace(/[^a-z0-9-_]/gi, '_').slice(0, 80);
      return upsertConversationMessages(convoId, parsed.messages, OUTPUT_DIR).then((dest) => {
        console.log('importMessenger: saved/merged', dest);
        return dest;
      });
    })
    .catch((err) => console.error('importMessenger error:', err, filePath));
}

function importAll() {
  console.log('importMessenger: scanning', INPUT_DIR);
  return fs
    .readdir(INPUT_DIR)
    .then((files) => files.filter((f) => f.toLowerCase().endsWith('.json')))
    .then((jsonFiles) => {
      if (jsonFiles.length === 0) {
        console.log('importMessenger: no files found');
        return Promise.resolve();
      }
      const promises = jsonFiles.map((f) => importOneFile(path.join(INPUT_DIR, f)));
      return Promise.all(promises);
    })
    .then(() => console.log('importMessenger: done'))
    .catch((err) => console.error('importMessenger error:', err));
}

if (require.main === module) {
  importAll().catch((err) => console.error('script error', err));
}

module.exports = { importAll, importOneFile };
