import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button'


// Apufunktio: muuntaa sekunnit muotoon "Xd Yh Zm"
const formatUptime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return [d && `${d}d`, h && `${h}h`, m && `${m}m`].filter(Boolean).join(' ');
};

function VMDetails({ vm }) {
    const API_URL = import.meta.env.VITE_API_URL; // Haetaan API-muuttuja .env tiedostosta

  // Funktio lähettää komennon backendille
    const sendCommand = async (command) => {
    const confirm = window.confirm(`Haluatko varmasti suorittaa komennon: ${command}?`);
    if (!confirm) return;

    try {
        const response = await fetch(`${API_URL}/vm/${vm.vmid}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: command })
        });

        const result = await response.json();

        // Näytetään Proxmoxin vastaus alert-ikkunassa
        alert(`Komento "${command}" suoritettu.\nVastaus: ${JSON.stringify(result)}`);
    } catch (error) {
        console.error("Virhe komennossa:", error);
        alert("Virhe komennon suorittamisessa: " + error.message);
    }
    };

    // VM 1017 = game2
    const isEnabled = vm.vmid === 1017;


  return (
    <Container className="mt-4">
      <Card className="vm-details-card">
        <Card.Body>
          <Card.Title>{vm.name} (ID: {vm.vmid})</Card.Title>

          {/* VM:n tiedot taulukkona */}
          <Table striped bordered size="sm" className="mt-3">
            <tbody>
              <tr><td><strong>Status</strong></td><td>{vm.status}</td></tr>
              <tr><td><strong>CPU</strong></td><td>{(vm.cpu * 100).toFixed(2)}% / {vm.cpus} vCPU</td></tr>
              <tr><td><strong>RAM</strong></td><td>{(vm.mem / 1024 ** 2).toFixed(1)} MB / {(vm.maxmem / 1024 ** 2).toFixed(1)} MB</td></tr>
              <tr><td><strong>Uptime</strong></td><td>{formatUptime(vm.uptime)}</td></tr>
              <tr><td><strong>Disk Write</strong></td><td>{(vm.diskwrite / 1024 ** 2).toFixed(1)} MB</td></tr>
              <tr><td><strong>Disk Read</strong></td><td>{(vm.diskread / 1024 ** 2).toFixed(1)} MB</td></tr>
              <tr><td><strong>Net In</strong></td><td>{(vm.netin / 1024 ** 2).toFixed(1)} MB</td></tr>
              <tr><td><strong>Net Out</strong></td><td>{(vm.netout / 1024 ** 2).toFixed(1)} MB</td></tr>
            </tbody>
          </Table>

        <div className="d-flex gap-2 mt-3">
            <Button disabled={!isEnabled} onClick={() => sendCommand('start')}>Power on</Button>
            <Button disabled={!isEnabled} onClick={() => sendCommand('shutdown')}>Shutdown</Button>
            <Button disabled={!isEnabled} onClick={() => sendCommand('reboot')}>Force reboot</Button>
        </div>

        </Card.Body>
      </Card>
    </Container>
  );
}

export default VMDetails;