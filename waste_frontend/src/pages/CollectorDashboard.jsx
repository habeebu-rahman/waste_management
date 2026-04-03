import { useEffect,useState } from "react";
import API from "../api/api";

export function CollectorDashboard() {
    const [request, setRequest] = useState([]);

    useEffect(()=>{
        API.get('waste/requests/')
            .then(res=>setRequest(res.data))
    },[]);

    const markCompleted = async (id) => {
        try {
            await API.patch(`waste/requests/${id}/`, { status: 'completed' });
            // Update the list without reloading the page
            setRequest(request.map(t => t.id === id ? { ...t, status: 'completed' } : t));
        } catch (err) {
            console.log(err);
        }
    }

    return (
    <div className="p-5">
        <h2 className="text-xl font-bold mb-4">Collector Dashboard</h2>

        {request.map(req => (
            <div key={req.id} className="border p-3 mb-2 rounded">
            <p>
                <strong>User:</strong> {req.user_name} |
                <strong> Category:</strong> {req.category_name} | 
                <strong> Status:</strong> {req.status}
            </p>
            <p><strong> Address:</strong> {req.address}</p>

            <button
                onClick={() => markCompleted(req.id)}
                className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
            >
                Mark Completed
            </button>
            </div>
        ))}
        </div>
    );
}