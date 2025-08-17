// /my-personal-assistant/syncData.js

const cron = require('node-cron');
const fs = require('fs-extra');

// Tu możesz ustawić ścieżkę do swojego pliku z danymi, na razie na przykład
const dataFilePath = './whatsapp-data.txt';

cron.schedule('0 0 * * *', () => {
  console.log('Running the data sync job...');

  // Tu w przyszłości dodamy logikę do wczytywania i parsowania pliku
  if (fs.existsSync(dataFilePath)) {
    console.log('Data file found, processing...');
    // Tutaj możesz dodać logikę przetwarzania pliku
  } else {
    console.log('Data file not found, nothing to process.');
  }
});

console.log('Data sync scheduled. The script is running.');
