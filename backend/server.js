require('dotenv').config();         // Lataa .env-tiedoston muuttujat

const { request, Agent } = require('undici'); // request funktio jotta ohitetaan SSL-salaus
const express = require('express'); // Tuodaan Express-moduuli, joka helpottaa HTTP-palvelimen rakentamista
const cors = require('cors');       // Tuodaan CORS-moduuli, joka sallii frontendin ja backendin väliset pyynnöt eri porteista

const app = express();              // Luodaan Express-sovellus
const PORT = process.env.PORT;      // Määritetään portti, jossa backend kuuntelee

app.use(cors());                    // Otetaan käyttöön CORS, jotta frontend (esim. portissa 5173) voi tehdä pyyntöjä backendille

// Hakee VM-tiedot Proxmox API:sta
async function fetchVMsFromProxmox() {
    const url = `https://${process.env.PROXMOX_IP}:${process.env.PROXMOX_PORT}/api2/json/nodes/${process.env.PROXMOX_NAME}/qemu`;

    // Request palauttaa kaiken tiedon, otetaan vastauksesta vain statusCode ja body.
    const { statusCode, body } = await request(url, {
        method: 'GET',
        headers: {
            Authorization: `PVEAPIToken=${process.env.PROXMOX_API_TOKEN_FULL}`
        },
        dispatcher: new Agent({
            connect: {
                rejectUnauthorized: false // SSL-varoituksen ohitus
            }
        })
    });

    // Tarkistetaan HTTP-status
    if (statusCode !== 200) {
        throw new Error(`Proxmox API returned status ${statusCode}`);
    }

    const data = await body.json();
    return data.data; // Palauttaa VM-listan
}

app.get('/api/vms', async (req, res) => {
    try {
        const VMs = await fetchVMsFromProxmox();
        res.json(VMs); // Palautetaan VM-data
    } catch (error) {
        console.error('Proxmox API error:', error);

        // Palautetaan virhe frontendille
        res.status(500).json({
            message: 'Virhe Proxmox-yhteydessä',
            status: 500,
            details: error.message // esim. "Proxmox API returned status 403"
        });
    }
});

// Käynnistetään palvelin ja kuunnellaan määritetyssä portissa
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});


