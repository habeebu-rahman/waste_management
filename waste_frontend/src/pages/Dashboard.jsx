import { useEffect,useState } from "react";
import API from "../api/api";

export function Dashboard(){
    const [schedules,setSchedules] = useState([])

    useEffect(()=>{
        API.get('waste/schedules/')
            .then(res=>setSchedules(res.data))
            .catch(err=>console.log(err))
    },[]);

    return(
        <>
            <h2>Collection Schedules</h2>
            {schedules.map((item)=>(
                <div key={item.id}>
                    <p>{item.category} - {item.data}</p>
                </div>
            ))}
        </>
    )
}