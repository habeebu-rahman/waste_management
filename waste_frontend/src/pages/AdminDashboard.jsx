import { useEffect,useState } from "react";
import API from "../api/api";

export function AdminDashboard(){
    const [request,setRequest] = useState([])

    useEffect(()=>{
        API.get('waste/request/')
            .then(res=>setRequest(res.data))
    },[]);

    const updateStatus = async(id, status)=>{
        await API.patch(`waste/request/${id}`,{status});
        window.location.reload();
    }

    return(
        <>
            <h2>Admin Dashboard</h2>
            {request.map(req=>(
                <div key={req.id}>
                    <p>{req.category} - {req.status}</p>
                    <button onClick={()=> updateStatus(req.id,'approved')}>Approve</button>
                    <button onClick={()=> updateStatus(req.id,'rejected')}>Reject</button>
                </div>
            ))}
        </>
    )
}