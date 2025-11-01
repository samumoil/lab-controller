import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Haetaan VM:n ID URL-parametrista
import VMDetails from "./VMDetails"; // Tuodaan yksittäisen VM:n tietojen komponentti

function GetVMdetails() {
  const [VMdetails, setVMdetails] = useState(null); // Tilamuuttuja yksittäiselle VM:lle
  const { id } = useParams(); // Haetaan ID reitistä
  const API_URL = import.meta.env.VITE_API_URL; // Tuodaan docker-compose tarjoama env

  // Hakee yksittäisen VM:n tiedot backendistä
  const getData = async () => {
    try {
      const response = await fetch(`${API_URL}/vm/${id}`);
      const data = await response.json();
      setVMdetails(data); // Tallennetaan VM:n tiedot tilaan
    } catch (error) {
      console.error("Virhe haettaessa VM:n tietoja:", error);
    }
  };

  useEffect(() => {
    getData(); // Haetaan tiedot heti komponentin latautuessa
    const interval = setInterval(getData, 10000); // Päivitetään tiedot 10 sekunnin välein
    return () => clearInterval(interval); // Siivotaan intervalli unmountissa
  }, [id]);

  return (
    <div>
      {VMdetails ? (
        <VMDetails vm={VMdetails} /> // Välitetään yksittäinen VM propsina
      ) : (
        <p>Ladataan tietoja...</p>
      )}
    </div>
  );
}

export default GetVMdetails;