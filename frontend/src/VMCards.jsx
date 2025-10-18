import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

function VMCards(props) {

  // Apufunktio: muuntaa sekunnit muotoon "X päivää Y tuntia Z minuuttia W sekuntia"
  const formatUptime = (seconds) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  return (
    <Container>
    <Row xs={1} sm={2} md={3} lg={4} className="g-1">
      {props.vms.map(vm => (
        <Col key={vm.vmid} className='d-flex'>
          <Card className='vm-card flex-fill'>
            <Card.Body className='p-2 d-flex flex-column'>
              <Card.Title>{vm.name}</Card.Title>

              <Card.Text>
                <strong>ID:</strong> {vm.vmid} <br />
                <strong>Status:</strong> {vm.status} <br />
                <strong>CPU:</strong> {(vm.cpu * 100).toFixed(1)}% / {vm.cpus} vCPU <br />
                <strong>RAM:</strong> {(vm.mem / (1024 ** 2)).toFixed(1)} MB /<br/> {(vm.maxmem / (1024 ** 2)).toFixed(1)} MB <br />
                <strong>Uptime:</strong> {formatUptime(vm.uptime)}
              </Card.Text>

              <Button variant="primary" className='mt-auto'>Näytä lisätiedot</Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
    </Container>
  );
}

export default VMCards;