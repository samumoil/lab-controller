import { useEffect, useState } from "react";
import VMCards from "./VMCards";

function GetVMs() {
  const [VMs, setVMs] = useState([]); // Tilamuuttuja VM-datalle
  const API_URL = import.meta.env.VITE_API_URL;

  const getData = async () => {
    const response = await fetch(`${API_URL}/vms`);
    console.log(response);
    const data = await response.json();
    setVMs(data);
  }

  useEffect(() => {
    getData();
  }, []); //


  return (
    <VMCards vms={VMs} />
  )
}

export default GetVMs;
