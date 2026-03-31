import { Link,useNavigate } from "react-router-dom";
import { tokenize } from './../../node_modules/espree/espree';

export function Navbar(){
    const navigate = useNavigate()

    const token = localStorage.getItem
    const role = localStorage.getItem('role')

    const logout = ()=>{
        localStorage.clear()
        navigate('/login')
    }

    if (!token) return null;

    return(
        <div className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-lg">
            <h1 className="text-xl font-bold">Waste System</h1>

            <div className="flex gap-4">
                <Link to="/">Home</Link>

                {role === "citizen" && (
                <Link to="/request">Request Pickup</Link>
                )}

                {role === "admin" && (
                <Link to="/admin">Admin Dashboard</Link>
                )}

                {role === "collector" && (
                <Link to="/collector">Collector Dashboard</Link>
                )}

                <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded"
                >
                Logout
                </button>
            </div>
        </div>
    )
}