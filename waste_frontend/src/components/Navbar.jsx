import { Link,useNavigate } from "react-router-dom";

export function Navbar(){
    const navigate = useNavigate()

    const role = localStorage.getItem('role')

    const logout = ()=>{
        localStorage.clear()
        navigate('/login')
    }

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