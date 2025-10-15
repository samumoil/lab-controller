require('dotenv').config();         // Lataa .env-tiedoston muuttujat

const express = require('express'); // Tuodaan Express-moduuli, joka helpottaa HTTP-palvelimen rakentamista
const cors = require('cors');       // Tuodaan CORS-moduuli, joka sallii frontendin ja backendin väliset pyynnöt eri porteista

const app = express();              // Luodaan Express-sovellus
const PORT = process.env.PORT;      // Määritetään portti, jossa backend kuuntelee

app.use(cors());                    // Otetaan käyttöön CORS, jotta frontend (esim. portissa 5173) voi tehdä pyyntöjä backendille

// Simuloitu VM-data, joka palautetaan frontendille
const VMs = [
    { id: 1, name: 'Ubuntu-Server-01', status: 'running' },
    { id: 2, name: 'Windows10-Test', status: 'stopped' },
];

// Määritellään GET-reitti, joka palauttaa VM-datan JSON-muodossa
app.get('/api/vms', (req, res) => {
    res.json(VMs); // Vastataan HTTP-pyyntöön lähettämällä mock-data JSON-muodossa
});

// Käynnistetään palvelin ja kuunnellaan määritetyssä portissa
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});


