import { useEffect,useState } from "react";
import API from "../api/api";

export function AdminDashboard(){
    const [request,setRequest] = useState([])

    useEffect(()=>{
        API.get('waste/requests/')
            .then(res=>setRequest(res.data))
    },[]);

    const updateStatus = async(id, status)=>{
        await API.patch(`waste/requests/${id}`,{status});
        window.location.reload();
    }

    const assignCollector = async (id, collectorId) => {
    await API.patch(`waste/requests/${id}/`, {
        collector: collectorId,
        status: "assigned",
    });
    };

    return(
        <>
            <h2>Admin Dashboard</h2>
            {request.map(req=>(
                <div key={req.id}>
                    <p>{req.category} - {req.status}</p>
                    <button onClick={()=> updateStatus(req.id,'approved')}>Approve</button>
                    <button onClick={()=> updateStatus(req.id,'rejected')}>Reject</button>

                <button
                    onClick={() => assignCollector(req.id)}
                    className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
                >
                    Mark assigned
                </button>
                </div>
            ))}
        </>
    )
}