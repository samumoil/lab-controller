// src/Navbar.jsx
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{
      position: 'fixed',       // Kiinnitetään yläpalkki sivun yläreunaan
      top: 0,
      width: '100%',
      backgroundColor: '#333', // Tumma taustaväri
      padding: '10px',
      display: 'flex',
      justifyContent: 'center', // Keskittää napit vaakasuunnassa
      gap: '20px',
      zIndex: 1000
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>VMs</Link>
      <Link to="/node" style={{ color: 'white', textDecoration: 'none' }}>Node</Link>
    </nav>
  );
}

export default Navbar;