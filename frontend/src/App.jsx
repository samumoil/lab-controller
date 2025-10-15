import { useState } from 'react'
import './App.css'
import GetVMs from './GetVMs'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <GetVMs />
    </>
  )
}

export default App
