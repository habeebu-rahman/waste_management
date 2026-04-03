import { useEffect,useState } from "react";
import API from "../api/api";

export function Dashboard(){
    const [schedules,setSchedules] = useState([])

    useEffect(()=>{
        API.get('waste/schedules/')
            .then(res=>setSchedules(res.data))
            .catch(err=>console.log(err))
    },[]);

    const [request,setRequest] = useState([])

    useEffect(()=>{
        API.get(`waste/requests/`)
            .then(res=>setRequest(res.data))
    },[]);

    return(
        <>
            <h2>Collection Schedules</h2>
            {schedules.map((item)=>(
                <div key={item.id}>
                    <p>{item.category} - {item.data}</p>
                </div>
            ))}

            
            <div>
                <h2>Request sended</h2>
            {request.map(req=>(
                <div key={req.id}>
                    <p>
                        <strong> Category:</strong> {req.category_name} | 
                        <strong> Status:</strong> {req.status}
                    </p>
                    <p>
                        <strong>preferred_date:</strong> {req.preferred_date} |
                        <strong> Address:</strong> {req.address}
                    </p><hr />
                </div>
            ))}
            </div>
        </>
    )
}