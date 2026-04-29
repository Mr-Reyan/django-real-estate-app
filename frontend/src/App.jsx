import React from 'react'
import Properties from './components/Properties'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Properties />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  )
}

export default App