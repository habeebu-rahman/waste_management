import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { RequestPickup } from './pages/RequestPickup'
import { AppNavbar } from './components/Navbar'
import { AdminDashboard } from './pages/AdminDashboard'
import { CollectorDashboard } from './pages/CollectorDashboard'
import { ProtectedRoute } from './pages/ProtectedRoute'
import { ComplaintRegister } from './pages/ComplaintRegister'
import { Profile } from './pages/profile'
import { CollectScheduleForm } from './pages/CollectScheduleForm'

export default function App(){
  return(
    <BrowserRouter>
    <AppNavbar />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />

        <Route 
          path='/' 
          element={
            <ProtectedRoute >
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path='/request' 
          element={
            <ProtectedRoute roleRequired = 'citizen'>
              <RequestPickup />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/complaint' 
          element={
            <ProtectedRoute roleRequired = 'citizen'>
              <ComplaintRegister />
            </ProtectedRoute>
          } 
        />

        <Route 
          path='/admin' 
          element={
            <ProtectedRoute roleRequired = 'admin'>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/collection_schedule' 
          element={
            <ProtectedRoute roleRequired = 'admin'>
              <CollectScheduleForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/collector' 
          element={
            <ProtectedRoute roleRequired = 'collector'>
              <CollectorDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}