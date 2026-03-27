import { Children } from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute(){
    const role = localStorage.getItem('role')

    if (!role) return <Navigate to='/login' />

    if (roleRequired && role !== roleRequired) return <Navigate to='/' />

    return Children
}