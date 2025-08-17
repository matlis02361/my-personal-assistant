// /lib/parseUtils.js

// Narzędzia do parsowania i normalizacji wiadomości
// Komentarze po polsku. Stałe teksty po niemiecku.

const crypto = require('crypto');

function normalizeDateString(dateStr, timeStr) {
  // Prosta normalizacja daty: próba parsowania różnych formatów
  // Zwraca ISO string lub oryginalny tekst jeśli nieznany
  const combined = `${dateStr} ${timeStr}`.trim();
  // Common formats: DD.MM.YY, DD.MM.YYYY, YYYY-MM-DD
  const d1 = combined.replace(/\./g, '-');
  const parsed = new Date(d1);
  if (!isNaN(parsed.getTime())) return parsed.toISOString();

  // Fallback: Date.parse
  const parsed2 = Date.parse(combined);
  if (!isNaN(parsed2)) return new Date(parsed2).toISOString();

  return combined; // nieudana normalizacja
}

function hashMessage(msg) {
  const h = crypto.createHash('sha1');
  h.update(`${msg.date}|${msg.time}|${msg.author}|${msg.message}`);
  return h.digest('hex');
}

function cleanText(s) {
  if (!s && s !== '') return s;
  return String(s)
    .replace(/\u00A0/g, ' ')
    .replace(/[\u0000-\u001F]/g, '')
    .trim();
}

function parseWhatsAppTxt(content) {
  // Przyjmuje zawartość pliku jako string, zwraca tablicę wiadomości
  const lines = content.split(/\r?\n/);
  const messages = [];

  lines.forEach((line) => {
    if (!line || !line.trim()) return;

    // Format: "12.01.21, 10:34 - Jan Kowalski: wiadomość"
    const m = line.match(/^(\d{1,2}\.\d{1,2}\.\d{2,4}),?\s*(\d{1,2}:\d{2})\s*-\s*([^:]+):\s*(.*)$/);
    if (m) {
      const dateRaw = m[1];
      const timeRaw = m[2];
      const author = cleanText(m[3]);
      const message = cleanText(m[4]);
      const date = normalizeDateString(dateRaw, timeRaw);
      const obj = { date: date, time: timeRaw, author, message };
      obj.hash = hashMessage(obj);
      messages.push(obj);
      return;
    }

    // Inne przypadki — może to multiline continuation
    messages.push({ raw: cleanText(line), hash: crypto.createHash('sha1').update(line).digest('hex') });
  });

  return messages;
}

module.exports = { parseWhatsAppTxt, normalizeDateString, hashMessage, cleanText };
