// /syncData.js

// Prosty skrypt synchronizujący eksport WhatsApp -> JSON
// Komentarze po polsku. Stałe teksty (foldery) po niemiecku.

const fs = require('fs-extra');
const path = require('path');
const cron = require('node-cron');

// Konfiguracja (wartości stałe po niemiecku)
const INPUT_DIR = process.env.INPUT_DIR || path.join(__dirname, 'eingang'); // folder z eksportami
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(__dirname, 'ausgabe'); // miejsce zapisu JSON
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 2 * * *'; // domyślnie codziennie o 02:00

// Parsuje prosty format WhatsApp (linia z datą, autorem i treścią)
function parseWhatsAppTxt(filePath) {
  // Czyta plik i mapuje linie na obiekty wiadomości
  return fs.readFile(filePath, 'utf8').then((content) => {
    const lines = content.split(/\r?\n/).filter(Boolean);
    const messages = lines.map((line) => {
      const m = line.match(/^(\d{1,2}\.\d{1,2}\.\d{2,4}),?\s*(\d{1,2}:\d{2})\s*-\s*([^:]+):\s*(.*)$/);
      if (m) {
        return {
          date: m[1],
          time: m[2],
          author: m[3].trim(),
          message: m[4]
        };
      }
      // Fallback: zachowaj surową linię
      return { raw: line };
    });
    return messages;
  });
}

// Zapisuje JSON do pliku
function saveJSON(data, destPath) {
  return fs
    .ensureDir(path.dirname(destPath))
    .then(() => fs.writeFile(destPath, JSON.stringify(data, null, 2), 'utf8'));
}

// Synchronizuje pojedynczy plik
function syncFile(filePath) {
  console.log('syncFile: start', filePath);
  const basename = path.basename(filePath, path.extname(filePath));
  const outFile = path.join(OUTPUT_DIR, `${basename}.json`);

  return parseWhatsAppTxt(filePath)
    .then((messages) => saveJSON(messages, outFile))
    .then(() => console.log('syncFile: saved', outFile))
    .catch((err) => console.error('syncFile error:', err, filePath));
}

// Główna funkcja synchronizacji — skanuje folder i odpala sync dla plików .txt
function syncNow() {
  console.log('syncNow: scanning', INPUT_DIR);
  return fs
    .readdir(INPUT_DIR)
    .then((files) => files.filter((f) => f.toLowerCase().endsWith('.txt')))
    .then((txtFiles) => {
      if (txtFiles.length === 0) {
        console.log('syncNow: no files to process');
        return Promise.resolve();
      }
      const promises = txtFiles.map((f) => syncFile(path.join(INPUT_DIR, f)));
      return Promise.all(promises);
    })
    .then(() => console.log('syncNow: done'))
    .catch((err) => console.error('syncNow error:', err));
}

// Ustaw cron (domyślnie codziennie o 02:00)
cron.schedule(CRON_SCHEDULE, () => {
  console.log('cron: running scheduled sync', CRON_SCHEDULE);
  syncNow().catch((err) => console.error('cron sync error:', err));
}).start();

// Uruchom natychmiastowo przy starcie
syncNow().catch((err) => console.error('startup sync error:', err));

// Eksport funkcji do testów
module.exports = { syncNow, syncFile, parseWhatsAppTxt, saveJSON };
