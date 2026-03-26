import { useEffect,useState } from "react";
import API from "../api/api";

export function CollectorDashboard() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        API.get("waste/requests/")
        .then(res => setTasks(res.data));
    }, []);

    return (
        <div>
        <h2>My Tasks</h2>
        {tasks.map(task => (
            <div key={task.id}>
            <p>{task.address}</p>
            <p>Status: {task.status}</p>
            </div>
        ))}
        </div>
    );
}