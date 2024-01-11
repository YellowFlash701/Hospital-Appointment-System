import './App.css'
import React from 'react'
import { compile } from "@fileforge/react-print";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage/HomePage.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import EditAppointment from './components/UpdateAppointment.jsx'
import AddAppointment from './components/AddAppointment.jsx'
import GeneratReport from './components/Dashboard/GenerateReport.jsx';
import DoctorRegister from './components/Register/DoctorRegister.jsx';
import DashLogin from './components/DashLogin.jsx';
import ProtectedRoute from './services/ProtectedRoute.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage/>} />
          <Route path='/home' element={<HomePage/>} />
          <Route path='/report' element={<GeneratReport/>} />
          <Route element={<ProtectedRoute allowedRole="admin" />}>
              <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route path='/add-appointment' element={<AddAppointment/>} />
          <Route path="/edit-appointment/:id" element={<EditAppointment />} />
          <Route path="/register-doctor" element={<DoctorRegister />} />
          <Route path="/login-dash" element={<DashLogin />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
