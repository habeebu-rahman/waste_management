import { Navigate } from "react-router-dom";

export function ProtectedRoute({children,roleRequired}){
    const token = localStorage.getItem('access_token')
    const role = localStorage.getItem('role')

    if (!token){
        return <Navigate to='/login' />
    }

    if (roleRequired && role !== roleRequired){
        return <Navigate to='/' />
    }

    return children
}