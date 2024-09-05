


const { google } = require('googleapis');
const keys = require('./service-account-key.json'); // JSON-filen från Service Account
const sheets = google.sheets('v4');

// Autentisera med Service Account
async function authenticate() {
  const auth = new google.auth.GoogleAuth({
    credentials: keys,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return auth.getClient();
}

// Funktion för att läsa från Google Sheets
async function readSheet(auth) {
  const sheetsApi = google.sheets({ version: 'v4', auth });
  const response = await sheetsApi.spreadsheets.values.get({
    spreadsheetId: '1nD68OUcfVXCNBNBshXEtQYz1iefDGc5dkc96qPXxffA',
    range: 'Sheet1!A1:D10', // Ange ditt intervall här
  });
  return response.data.values;
}

// Funktion för att skriva till Google Sheets
async function writeSheet(auth, values) {
  const sheetsApi = google.sheets({ version: 'v4', auth });
  const response = await sheetsApi.spreadsheets.values.update({
    spreadsheetId: '1nD68OUcfVXCNBNBshXEtQYz1iefDGc5dkc96qPXxffA',
    range: 'Sheet1!A1:D10', // Ange ditt intervall här
    valueInputOption: 'RAW',
    resource: { values },
  });
  return response;
}

// Express-server
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Endpoint för att hämta data från Google Sheets
app.get('/read', async (req, res) => {
  try {
    const auth = await authenticate();
    const data = await readSheet(auth);
    res.json(data);
  } catch (error) {
    res.status(500).send('Error reading from Google Sheets');
  }
});

// Endpoint för att skriva data till Google Sheets
app.post('/write', async (req, res) => {
  try {
    const auth = await authenticate();
    const { values } = req.body;
    await writeSheet(auth, values);
    res.status(200).send('Data written to Google Sheets');
  } catch (error) {
    res.status(500).send('Error writing to Google Sheets');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
