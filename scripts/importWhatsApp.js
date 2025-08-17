// /scripts/importWhatsApp.js

// Skrypt importujący pliki .txt z WhatsApp do JSON
// Komentarze po polsku. Stałe teksty po niemiecku.

const fs = require('fs-extra');
const path = require('path');
const { parseWhatsAppTxt } = require('../lib/parseUtils');
const { ensureOutputDir, upsertConversationMessages, listConversations } = require('../lib/storage');

const INPUT_DIR = process.env.INPUT_DIR || path.join(__dirname, '..', 'eingang');
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(__dirname, '..', 'ausgabe', 'whatsapp');

function importOneFile(filePath) {
  console.log('importOneFile: processing', filePath);
  return fs.readFile(filePath, 'utf8')
    .then((content) => parseWhatsAppTxt(content))
    .then((messages) => {
      const convoId = path.basename(filePath, path.extname(filePath));
      return upsertConversationMessages(convoId, messages, OUTPUT_DIR).then((dest) => {
        console.log('importOneFile: saved/merged', dest);
        return dest;
      });
    })
    .catch((err) => console.error('importOneFile error:', err, filePath));
}

function importAll() {
  console.log('importAll: scanning', INPUT_DIR);
  return fs
    .readdir(INPUT_DIR)
    .then((files) => files.filter((f) => f.toLowerCase().endsWith('.txt')))
    .then((txtFiles) => {
      if (txtFiles.length === 0) {
        console.log('importAll: no files found');
        return Promise.resolve();
      }
      const promises = txtFiles.map((f) => importOneFile(path.join(INPUT_DIR, f)));
      return Promise.all(promises);
    })
    .then(() => console.log('importAll: done'))
    .catch((err) => console.error('importAll error:', err));
}

if (require.main === module) {
  importAll().catch((err) => console.error('script error', err));
}

module.exports = { importAll, importOneFile };
