import {BrowserRouter,Routes,Route} from 'react-router-dom'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { RequestPickup } from './pages/RequestPickup'

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/request' element={<RequestPickup />} />
      </Routes>
    </BrowserRouter>
  )
}