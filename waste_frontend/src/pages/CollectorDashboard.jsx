import { useEffect,useState } from "react";
import API from "../api/api";

export function CollectorDashboard() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        API.get("waste/requests/")
        .then(res => setTasks(res.data));
    }, []);

    const markCompleted = async(id)=>{
        await API.patch(`waste/requests/${id}/`,{
            status:'completed'
        })
        window.location.reload()
    }

    return (
    <div className="p-5">
        <h2 className="text-xl font-bold mb-4">Collector Dashboard</h2>

        {tasks.map(task => (
            <div key={task.id} className="border p-3 mb-2 rounded">
            <p><b>Address:</b> {task.address}</p>
            <p><b>Status:</b> {task.status}</p>

            <button
                onClick={() => markCompleted(task.id)}
                className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
            >
                Mark Completed
            </button>
            </div>
        ))}
        </div>
    );
}