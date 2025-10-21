import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom'; 

function VMCards(props) {
  // Apufunktio: muuntaa sekunnit muotoon "Xd Yh Zm" tai "Xs" jos alle minuutin
  const formatUptime = (seconds) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }

    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    const parts = [];
    if (d > 0) parts.push(`${d}d`);
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);

    return parts.join(' ');
  };

  // Erotellaan VM:t statuksen mukaan ja järjestetään ID:n mukaan
  const runningVMs = props.vms
    .filter(vm => vm.status === 'running')
    .sort((a, b) => a.vmid - b.vmid);

  const stoppedVMs = props.vms
    .filter(vm => vm.status === 'stopped')
    .sort((a, b) => a.vmid - b.vmid);

  // Renderöidään kortit molemmille ryhmille
  const renderCards = (vmList) => (
    vmList.map(vm => (
      <Col key={vm.vmid} className='d-flex'>
        <Card className='vm-card flex-fill'>
          <Card.Body className='p-2 d-flex flex-column'>
            <Card.Title>{vm.name}</Card.Title>

            {/* VM-tiedot taulukkona */}
            <Card.Text as="div">
              <table className="table table-sm mb-2">
                <tbody>
                  <tr>
                    <td><strong>ID</strong></td>
                    <td>{vm.vmid}</td>
                  </tr>
                  <tr>
                    <td><strong>Status</strong></td>
                    <td>{vm.status}</td>
                  </tr>
                  <tr>
                    <td><strong>CPU</strong></td>
                    <td>{(vm.cpu * 100).toFixed(1)}% /<br/> {vm.cpus} vCPU</td>
                  </tr>
                  <tr>
                    <td><strong>RAM</strong></td>
                    <td>{(vm.mem / (1024 ** 2)).toFixed(0)} MB / { (vm.maxmem / (1024 ** 2)).toFixed(0)} MB</td>
                  </tr>
                  <tr>
                    <td><strong>Uptime</strong></td>
                    <td>{formatUptime(vm.uptime)}</td>
                  </tr>
                </tbody>
              </table>
            </Card.Text>
            <Button
              as={Link} // Käytetään Link-komponenttia napin sisällä
              to={`/vm/${vm.vmid}`} // Ohjataan VM:n ID:n mukaan
              variant="primary"
              className='mt-auto'
            >
              Details
            </Button>
          </Card.Body>
        </Card>
      </Col>
    ))
  );

  return (
    <Container>
      {/* Running-osio vihreällä taustalla */}
      <div className="vm-section-running mb-4">
        <h5>Running</h5>
        <Row xs={1} sm={2} md={3} lg={4} className="g-2">
          {renderCards(runningVMs)}
        </Row>
      </div>

      {/* Stopped-osio punaisella taustalla */}
      <div className="vm-section-stopped">
        <h5>Stopped</h5>
        <Row xs={1} sm={2} md={3} lg={4} className="g-2">
          {renderCards(stoppedVMs)}
        </Row>
      </div>
    </Container>
  );
}

export default VMCards;