import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { RequestPickup } from './pages/RequestPickup'
import { Navbar } from './components/Navbar'
import { AdminDashboard } from './pages/AdminDashboard'
import { CollectorDashboard } from './pages/CollectorDashboard'
import { ProtectedRoute } from './pages/ProtectedRoute'

export default function App(){
  return(
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/request' element={<RequestPickup />} />

        <Route 
          path='/admin' 
          element={
            <ProtectedRoute roleRequired = 'admin'>
              <AdminDashboard />
            </ProtectedRoute>
            } />
        <Route 
          path='/collector' 
          element={
            <ProtectedRoute roleRequired = 'collector'>
              <CollectorDashboard />
            </ProtectedRoute>
            } />
      </Routes>
    </BrowserRouter>
  )
}