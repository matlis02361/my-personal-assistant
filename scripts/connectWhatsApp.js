// /scripts/connectWhatsApp.js

// Prosty connector do WhatsApp Web używając puppeteer
// Uwaga: wymaga ręcznego zeskanowania QR kodu przy pierwszym uruchomieniu
// Komentarze po polsku. Stałe teksty po niemiecku.

const fs = require('fs-extra');
const path = require('path');
const puppeteer = require('puppeteer');

const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(__dirname, '..', 'ausgabe', 'whatsapp_web');
const MAX_CHATS = parseInt(process.env.MAX_CHATS || '5', 10);

async function run() {
  console.log('whatsapp:web: starting puppeteer');
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://web.whatsapp.com');
  console.log('whatsapp:web: please scan QR code in the opened browser if needed');

  // Wait for chats list to appear
  await page.waitForSelector('#pane-side', { timeout: 0 });
  console.log('whatsapp:web: logged in, scanning chats');

  // Select chat elements
  const chatSelectors = await page.$$('[data-testid="cell-frame-container"]');
  const limit = Math.min(chatSelectors.length, MAX_CHATS);

  const results = [];

  for (let i = 0; i < limit; i++) {
    const chat = chatSelectors[i];
    const title = await chat.$eval('span[dir="auto"]', (el) => el.innerText).catch(() => 'unknown');
    console.log('whatsapp:web: opening chat', title);
    await chat.click();
    await page.waitForTimeout(1000);

    // Scroll up to load messages
    await page.evaluate(() => {
      const chatPanel = document.querySelector('[data-testid="conversation-panel-messages"]');
      if (chatPanel) chatPanel.scrollTop = 0;
    });

    // Extract last 200 messages (visible)
    const messages = await page.$$eval('[data-testid="msg-container"]', (nodes) =>
      nodes.map((n) => {
        const authorEl = n.querySelector('[data-pre-plain-text]');
        const author = authorEl ? authorEl.getAttribute('data-pre-plain-text') : null;
        const textEl = n.querySelector('[data-testid="conversation-message-text"]');
        const text = textEl ? textEl.innerText : (n.innerText || '');
        return { author, text };
      })
    );

    const convoId = title.replace(/[^a-z0-9-_]/gi, '_').slice(0, 80) || `chat_${i}`;
    const out = { meta: { source: 'whatsapp_web', title, capturedAt: new Date().toISOString() }, messages };
    await fs.ensureDir(OUTPUT_DIR).then(() => fs.writeFile(path.join(OUTPUT_DIR, `${convoId}.json`), JSON.stringify(out, null, 2), 'utf8'));
    console.log('whatsapp:web: saved', convoId);
    results.push(convoId);

    // small delay
    await page.waitForTimeout(500);
  }

  console.log('whatsapp:web: done, closing browser');
  await browser.close();
  return results;
}

if (require.main === module) {
  run()
    .then((r) => console.log('whatsapp:web: result', r))
    .catch((err) => console.error('whatsapp:web error', err));
}

module.exports = { run };
