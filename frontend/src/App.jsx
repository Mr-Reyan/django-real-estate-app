import React from 'react'
import Properties from './components/Properties'
import Signup from './pages/Signup'
import PropertyDetail from './pages/PropertyDetail'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import ProfilePage from './pages/ProfilePage'
import Agents from './pages/Agents'
import Filter from './components/Filter'
import VisitRequests from './pages/VisitRequests'
import MyVisitRequests from './pages/MyRequests'
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Properties />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/profile/:id" element={<ProfilePage/>} />
        <Route path="/agents/" element={<Agents/>} />
        <Route path="/filter/" element={<Filter/>} />
        <Route path="/requests/" element={<VisitRequests/>} />
        <Route path="/my_requests/" element={<MyVisitRequests/>} />
      </Routes>
    </>
  )
}

export default App