import { useState } from 'react'
import './App.css'
import GetVMs from './GetVMs'
import GetVMdetails from './GetVMdetails'
import GetNodeDetails from './GetNodeDetails'
import Navbar from './Navbar'

import { BrowserRouter, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <div className="content-container">
        <Routes>
          <Route path="/" element={<GetVMs />} />
          <Route path="/vm/:id" element={<GetVMdetails />} />
          <Route path="/node" element={<GetNodeDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
