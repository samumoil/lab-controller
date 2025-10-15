import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function VMCards(props) {

  return (
    <>
      {props.vms.map(vm => (

        <Card key={vm.id} style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{vm.name}</Card.Title>
            <Card.Text>
              This text tells more about VM {vm.id}.<br />
              VM is: {vm.status}
            </Card.Text>
            <Button variant="primary">Show me more</Button>
          </Card.Body>
        </Card>


      ))}
      

  </>
  )
}

export default VMCards;


