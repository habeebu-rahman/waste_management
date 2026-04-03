import { useEffect,useState } from "react";
import API from "../api/api";
import {GoogleMap,LoadScript,Marker} from '@react-google-maps/api';

export function AdminDashboard(){
    // collector
    const [collectors, setCollectors] = useState([]);
    const [selectedCollectors, setSelectedCollectors] = useState({});

    useEffect(() => {
    // Fetch only users with the role 'collector'
        API.get('auth/users/collectors/')
            .then(res => setCollectors(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleSelectChange = (requestId, collectorId) => {
        setSelectedCollectors(prev => ({
            ...prev,
            [requestId]: collectorId
        }));
    };
    // request
    const [request,setRequest] = useState([])

    useEffect(()=>{
        API.get('waste/requests/')
            .then(res=>setRequest(res.data))
    },[]);

    const updateStatus = async(id, status)=>{
        await API.patch(`waste/requests/${id}/`,{status});
        window.location.reload();
    }

    const assignCollector = async (id, collectorId) => {
        if(!collectorId){
            alert("Please select a collector first!");
        return;
        }
        try{
            await API.patch(`waste/requests/${id}/`, {
                collector: collectorId,
                status: "assigned",
            });alert("Collector assigned successfully!");
                // Refresh data or update local state here
                window.location.reload(); 
            } catch (err) {
                console.error("Assignment failed:", err.response?.data);
            }
        }

    // complaint
    const [complaint,setComplaint] = useState([])
    const API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

    useEffect(()=>{
        API.get('waste/complaint/')
            .then(res=>setComplaint(res.data))
    },[]);

    const updateStatusComplaint = async(id, status)=>{
        await API.patch(`waste/complaint/${id}/`,{status});
        window.location.reload();
    }

    const assignCollectorComplaint = async (id, collectorId) => {
        await API.patch(`waste/complaint/${id}/`, {
            collector: collectorId,
            status: "assigned",
        });
    }
    


    return(
        <>
            <h2>Admin Dashboard</h2>
            <div>
            {request.map(req=>(
                <div key={req.id}>
                    <p>
                        <strong>User:</strong> {req.user_name} |
                        <strong> Category:</strong> {req.category_name} | 
                        <strong> Status:</strong> {req.status}
                    </p>
                    <p>
                        <strong>preferred_date:</strong> {req.preferred_date} |
                        <strong> Address:</strong> {req.address}
                    </p>
                    <button onClick={()=> updateStatus(req.id,'approved')}>Approve</button>
                    <button onClick={()=> updateStatus(req.id,'rejected')}>Reject</button>

                <select 
                    className="border rounded px-2 py-1"
                    onChange={(e) => handleSelectChange(req.id, e.target.value)}
                    value={selectedCollectors[req.id] || ""}
                >
                    <option value="">Select Collector</option>
                    {collectors.map(col => (
                        <option key={col.id} value={col.id}>
                            {col.username}
                        </option>
                    ))}
                </select>
                <button
                    onClick={() => assignCollector(req.id, selectedCollectors[req.id])}
                    className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
                >
                    Mark assigned
                </button>
                </div>
            ))}
            </div>

            {/* complaints */}
            <div>
                <h2>Complaints</h2>
                {complaint.map(comp=>(
                <div key={comp.id}>
                    <p>
                        <strong>User:</strong> {comp.user_name} |
                        <strong> Category:</strong> {comp.category_name} | 
                        <strong> Status:</strong> {comp.status}
                    </p>
                    <p>
                        <strong>place:</strong> {comp.place} |
                        <strong>phone:</strong> {comp.user_phone} |
                        <strong> location:</strong> 
                    </p>
                    {/* <LoadScript googleMapsApiKey= {API_KEY}>
                        <GoogleMap center={{ lat: comp.latitude, lng: comp.longitude }} zoom={12}
                            mapContainerStyle={{ height:'100px', width:'100px'}}
                        >
                            <Marker position={{ lat: comp.latitude, lng: comp.longitude }} />
                        </GoogleMap>
                    </LoadScript><br /> */}
                    <button onClick={()=> updateStatusComplaint(comp.id,'approved')}>Approve</button>
                    <button onClick={()=> updateStatusComplaint(comp.id,'rejected')}>Reject</button>

                <button
                    onClick={() => assignCollectorComplaint(comp.id)}
                    className="bg-green-500 text-white px-3 py-1 mt-2 rounded"
                >
                    Mark assigned
                </button>
                </div>
            ))}
            </div>
        </>
    )
}