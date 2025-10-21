require('dotenv').config();         // Lataa .env-tiedoston muuttujat

const { request, Agent } = require('undici'); // request funktio jotta ohitetaan SSL-salaus
const express = require('express'); // Tuodaan Express-moduuli, joka helpottaa HTTP-palvelimen rakentamista
const cors = require('cors');       // Tuodaan CORS-moduuli, joka sallii frontendin ja backendin väliset pyynnöt eri porteista

const app = express();              // Luodaan Express-sovellus
const PORT = process.env.PORT;      // Määritetään portti, jossa backend kuuntelee

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json()); // Mahdollistaa JSON-bodyjen lukemisen POST-pyynnöistä

/////////////////////////////////////////////////////
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
        const errorText = await body.text(); // Haetaan virheviesti
        console.error(`Proxmox API returned status ${statusCode}: ${errorText}`);
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

/////////////////////////////////////////////////////
// Hakee yksittäisen VM:n tiedot Proxmox API:sta
async function fetchVMdetailsFromProxmox(vmId) {
    const url = `https://${process.env.PROXMOX_IP}:${process.env.PROXMOX_PORT}/api2/json/nodes/${process.env.PROXMOX_NAME}/qemu/${vmId}/status/current`;

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

    if (statusCode !== 200) {
        throw new Error(`Proxmox API returned status ${statusCode}`);
    }

    const data = await body.json();
    return data.data; // Palauttaa yksittäisen VM:n tiedot
}

// Reitti, joka palauttaa yksittäisen VM:n tiedot frontendille
app.get('/api/vm/:id', async (req, res) => {
    try {
        const vmId = req.params.id; // Haetaan VM:n ID URL-parametrista
        const VMdetails = await fetchVMdetailsFromProxmox(vmId);
        res.json(VMdetails); // Palautetaan VM:n tiedot
    } catch (error) {
        console.error('Proxmox API error:', error);
        res.status(500).json({
            message: 'Virhe Proxmox-yhteydessä',
            status: 500,
            details: error.message
        });
    }
});

/////////////////////////////////////////////////////
// Hakee fyysisen Proxmox-serverin tilan
async function fetchNodeStatusFromProxmox() {
    const url = `https://${process.env.PROXMOX_IP}:${process.env.PROXMOX_PORT}/api2/json/nodes/${process.env.PROXMOX_NAME}/status`;

    // Tehdään HTTPS-pyyntö Proxmox API:in
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
    return data.data; // Palauttaa serverin tilatiedot
}

// Reitti, joka palauttaa fyysisen serverin tilan frontendille
app.get('/api/node/status', async (req, res) => {
    try {
        const nodeStatus = await fetchNodeStatusFromProxmox();
        res.json(nodeStatus); // Palautetaan serverin tila
    } catch (error) {
        console.error('Proxmox API error:', error);
        res.status(500).json({
            message: 'Virhe Proxmox-yhteydessä',
            status: 500,
            details: error.message
        });
    }
});

/////////////////////////////////////////////////////
// Funktio, joka lähettää komennon Proxmox API:lle. Vain kone nro 1017.
async function controlVM(vmId, action) {
    const validActions = {
        start: 'start',
        shutdown: 'shutdown',
        reboot: 'reboot'
    };

    if (!validActions[action]) {
        throw new Error('Virheellinen komento');
    }

    const url = `https://${process.env.PROXMOX_IP}:${process.env.PROXMOX_PORT}/api2/json/nodes/${process.env.PROXMOX_NAME}/qemu/${vmId}/status/${validActions[action]}`;

    const { statusCode, body } = await request(url, {
        method: 'POST',
        headers: {
            Authorization: `PVEAPIToken=${process.env.PROXMOX_API_TOKEN_FULL}`
        },
        dispatcher: new Agent({
            connect: { rejectUnauthorized: false }
        })
    });

    if (statusCode !== 200) {
        throw new Error(`Proxmox API returned status ${statusCode}`);
    }

    const result = await body.json();
    return result;
}

// Reitti, joka käsittelee VM:n kontrollikomennot
app.post('/api/vm/:id/action', async (req, res) => {
    const vmId = req.params.id;
    const { action } = req.body;

    try {
        const result = await controlVM(vmId, action);
        res.json({ message: 'Komento suoritettu', result });
    } catch (error) {
        console.error('Proxmox-komento error:', error);
        res.status(500).json({
            message: 'Komennon suoritus epäonnistui',
            details: error.message
        });
    }
});

// Käynnistetään palvelin ja kuunnellaan määritetyssä portissa
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});


