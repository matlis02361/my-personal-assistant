// /lib/storage.js

// Utility do zapisu plików i deduplikacji
const fs = require('fs-extra');
const path = require('path');

function ensureOutputDir(baseDir) {
  return fs.ensureDir(baseDir).then(() => baseDir);
}

function saveConversationJson(conversationId, data, baseDir) {
  const dest = path.join(baseDir, `${conversationId}.json`);
  return ensureOutputDir(baseDir).then(() => fs.writeFile(dest, JSON.stringify(data, null, 2), 'utf8')).then(() => dest);
}

function loadConversationJson(conversationId, baseDir) {
  const src = path.join(baseDir, `${conversationId}.json`);
  return fs.pathExists(src).then((exists) => (exists ? fs.readFile(src, 'utf8').then((c) => JSON.parse(c)) : null));
}

module.exports = { ensureOutputDir, saveConversationJson, loadConversationJson };
