// /lib/storage.js

// Utility do zapisu plików i deduplikacji
const fs = require('fs-extra');
const path = require('path');

function ensureOutputDir(baseDir) {
  return fs.ensureDir(baseDir).then(() => baseDir);
}

function conversationPath(conversationId, baseDir) {
  return path.join(baseDir, `${conversationId}.json`);
}

function listConversations(baseDir) {
  return fs
    .pathExists(baseDir)
    .then((exists) => (exists ? fs.readdir(baseDir) : []))
    .then((files) => files.filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')));
}

function loadConversationJson(conversationId, baseDir) {
  const src = conversationPath(conversationId, baseDir);
  return fs.pathExists(src).then((exists) => (exists ? fs.readFile(src, 'utf8').then((c) => JSON.parse(c)) : null));
}

function saveConversationJson(conversationId, data, baseDir) {
  const dest = conversationPath(conversationId, baseDir);
  return ensureOutputDir(baseDir).then(() => fs.writeFile(dest, JSON.stringify(data, null, 2), 'utf8')).then(() => dest);
}

// Zapisz wiadomości: jeśli istnieje plik, zmerguj i usuń duplikaty po hash
function upsertConversationMessages(conversationId, incoming, baseDir) {
  return loadConversationJson(conversationId, baseDir).then((existing) => {
    if (!existing) {
      const out = { meta: { source: conversationId, importedAt: new Date().toISOString() }, messages: incoming };
      return saveConversationJson(conversationId, out, baseDir);
    }

    // Mergujemy
    const seen = new Set(existing.messages.map((m) => m.hash).filter(Boolean));
    const merged = existing.messages.slice();
    incoming.forEach((m) => {
      if (!m.hash) {
        merged.push(m);
      } else if (!seen.has(m.hash)) {
        merged.push(m);
        seen.add(m.hash);
      } else {
        // duplicate, skip
      }
    });

    // Aktualizujemy timestamp
    existing.meta = existing.meta || {};
    existing.meta.updatedAt = new Date().toISOString();
    existing.messages = merged;

    return saveConversationJson(conversationId, existing, baseDir);
  });
}

module.exports = { ensureOutputDir, saveConversationJson, loadConversationJson, upsertConversationMessages, listConversations };
