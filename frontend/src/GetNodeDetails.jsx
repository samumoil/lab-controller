// GetNodeDetails.jsx
import { useEffect, useState } from "react";
import NodeDetails from "./NodeDetails.jsx"; // Tuodaan esityskomponentti

function GetNodeDetails() {
    const [nodeStatus, setNodeStatus] = useState();
    const API_URL = import.meta.env.VITE_API_URL; // Tuodaan docker-compose tarjoama env

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(`${API_URL}/node/status`);
        const data = await response.json();
        setNodeStatus(data); // Tallennetaan tila
      } catch (error) {
        console.error("Virhe haettaessa serverin tilaa:", error);
      }
    };

    getData();
    const interval = setInterval(getData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {nodeStatus ? <NodeDetails data={nodeStatus} /> : <p>Ladataan serverin tilaa...</p>}
    </div>
  );
}

export default GetNodeDetails;