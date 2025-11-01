// NodeDetails.jsx
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';

// Apufunktio: muuntaa sekunnit tunneiksi
const formatUptime = (seconds) => `${Math.floor(seconds / 3600)} h`;

function NodeDetails({ data }) {
  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Proxmox-serverin tila</Card.Title>
          <Table striped bordered size="sm" className="mt-3">
            <tbody>
              <tr><td><strong>CPU Load</strong></td><td>{data.cpu.toFixed(2)}</td></tr>
              <tr><td><strong>RAM</strong></td><td>{(data.memory.used / 1024 ** 2).toFixed(1)} MB / {(data.memory.total / 1024 ** 2).toFixed(1)} MB</td></tr>
              <tr><td><strong>Swap</strong></td><td>{(data.swap.used / 1024 ** 2).toFixed(1)} MB / {(data.swap.total / 1024 ** 2).toFixed(1)} MB</td></tr>
              <tr><td><strong>RootFS</strong></td><td>{(data.rootfs.used / 1024 ** 3).toFixed(1)} GB / {(data.rootfs.total / 1024 ** 3).toFixed(1)} GB</td></tr>
              <tr><td><strong>Uptime</strong></td><td>{formatUptime(data.uptime)}</td></tr>
              <tr><td><strong>CPU Model</strong></td><td>{data.cpuinfo.model}</td></tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default NodeDetails;