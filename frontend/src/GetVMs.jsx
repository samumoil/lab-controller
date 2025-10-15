import VMCards from "./VMCards";


function GetVMs() {

  // Simuloitu VM-data
  const VMs = [
    { id: 1, name: 'Ubuntu-Server-01', status: 'running' },
    { id: 2, name: 'Windows10-Test', status: 'stopped' },
  ] 


  return (
    <VMCards vms={VMs} />
  )
}

export default GetVMs;
