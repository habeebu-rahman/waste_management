import { useEffect, useState } from "react";
import API from "../api/api";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Footer } from "../components/Footer";
import Swal from "sweetalert2";

export function AdminDashboard() {
    // 1. ADD TAB STATE
    const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'complaints'
    
    const [collectors, setCollectors] = useState([]);
    const [selectedCollectors, setSelectedCollectors] = useState({});
    const [request, setRequest] = useState([]);
    const [complaint, setComplaint] = useState([]);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

    useEffect(() => {
        API.get('auth/users/collectors/').then(res => setCollectors(res.data));
        API.get('waste/requests/').then(res => setRequest(res.data));
        API.get('waste/complaint/').then(res => setComplaint(res.data));
    }, []);

    const handleSelectChange = (id, collectorId) => {
        setSelectedCollectors(prev => ({ ...prev, [id]: collectorId }));
    };

    const assignCollector = async (id, collectorId, type = "requests") => {
        if (!collectorId) { alert("Select a collector!"); return; }

        const pathName = type === "complaint" ? "complaint" : "requests";
        
        // Ensure the ID is part of the path and ends with a slash
        const endpoint = `waste/${pathName}/${id}/`; 
        
        try {
            await API.patch(endpoint, { 
                collector: parseInt(collectorId), 
                status: "assigned" 
            });

            if (type === "requests") {
                setRequest(prev => prev.map(t => t.id === id ? { ...t, status: 'assigned' } : t));
            } else {
                setComplaint(prev => prev.map(c => c.id === id ? { ...c, status: 'assigned' } : c));
            }
            Swal.fire({
                title: 'Assigned',
                // text: 'Your login is successfully completed',
                icon: 'success',
                background:'white',
                showConfirmButton:true,
                timer:1000,
                timerProgressBar:true
            })
            // ... state updates
        } catch (err) { 
            console.error("Error Response:", err.response?.data); 
        }
    };

    return (
        <>
        <div className="p-6 max-w-6xl mx-auto min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Admin Management</h1>

            {/* --- 2. THE TAB TOGGLE PANEL --- */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
                <button 
                    onClick={() => setActiveTab('requests')}
                    className={`pb-2 px-4 font-semibold transition-all ${activeTab === 'requests' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Pickup Requests ({request.length})
                </button>
                <button 
                    onClick={() => setActiveTab('complaints')}
                    className={`pb-2 px-4 font-semibold transition-all ${activeTab === 'complaints' ? 'border-b-4 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Public Complaints ({complaint.length})
                </button>
            </div>

            {/* --- 3. CONDITIONAL RENDERING --- */}
            
            {activeTab === 'requests' && (
                <div className="grid gap-4">
                    {request.length === 0 && <p className="text-gray-400">No requests found.</p>}
                    {request.map(req => (
                        <div key={req.id} className="bg-white bg-opacity-80 border rounded-xl p-5 shadow-sm flex justify-between items-center">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">{req.category_name}</span>
                                <h3 className="font-bold text-lg mt-1">{req.user_name}</h3>
                                <p className="text-sm text-gray-500">📍 {req.address}</p>
                                <p className="text-xs mt-2 font-bold uppercase">
                                    Status: <span className={`text-xs mt-2 font-bold uppercase ${req.status === 'completed' ? 'text-green-500' :req.status === 'assigned' ? 'text-blue-500':'text-red-500'}`}>{req.status}</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                {req.status === 'pending' ?(
                                    <>
                                    <select 
                                        className="border rounded p-2 text-sm"
                                        onChange={(e) => handleSelectChange(req.id, e.target.value)}
                                        value={selectedCollectors[req.id] || ""}
                                    >
                                        <option value="">Select Collector</option>
                                        {collectors.map(col => <option key={col.id} value={col.id}>{col.username}</option>)}
                                    </select>
                                
                                    <button 
                                        onClick={() => assignCollector(req.id, selectedCollectors[req.id], "requests")}
                                        className="bg-blue-600 text-white px-4 py-2 !rounded-lg text-sm hover:bg-blue-700"
                                    >
                                        Assign
                                    </button>
                                    </>
                                    ):(
                                        <div className="mt-6 bg-green-50 text-green-700 text-center py-3 px-5 rounded-2xl font-black uppercase text-sm border border-green-100">
                                            Done
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'complaints' && (
                <LoadScript googleMapsApiKey={API_KEY}>
                    <div className="grid gap-6">
                        {complaint.length === 0 && <p className="text-gray-400">No complaints found.</p>}
                        {complaint.map(comp => (
                            <div key={comp.id} className="bg-white bg-opacity-80 border rounded-2xl p-6 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left: Info */}
                                <div>
                                    <div className="flex gap-3 mb-3">
                                        <img 
                                            src={comp.image ? (comp.image.startsWith('http') ? comp.image : `${BASE_URL}${comp.image}`) : "https://placehold.co/200"} 
                                            className="w-20 h-20 rounded-lg object-cover shadow-sm"
                                            alt="Waste"
                                        />
                                        <div>
                                            <h3 className="font-bold">{comp.category_name}</h3>
                                            <p className="text-xs text-gray-500">{comp.user_name}</p>
                                            <p>
                                                <span className={`inline-block mt-2 text-xs font-black px-2 py-1 rounded ${comp.status === 'completed' ? 'bg-green-100 text-green-700' : comp.status === 'assigned' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                                {comp.status.toUpperCase()}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 italic">"{comp.place}"</p>
                                </div>

                                {/* Center: Map */}
                                <div className="h-40 rounded-xl overflow-hidden border">
                                    <GoogleMap 
                                        center={{ lat: parseFloat(comp.latitude) || 0, lng: parseFloat(comp.longitude) || 0 }} 
                                        zoom={14}
                                        mapContainerStyle={{ height: '100%', width: '100%' }}
                                        options={{ disableDefaultUI: true }}
                                    >
                                        <Marker position={{ lat: parseFloat(comp.latitude) || 0, lng: parseFloat(comp.longitude) || 0 }} />
                                    </GoogleMap>
                                </div>

                                {/* Right: Assign */}
                                <div className="flex flex-col justify-center">
                                    {comp.status !== 'assigned' ? (
                                    <>
                                        <select 
                                            className="border rounded p-2 text-sm mb-2"
                                            onChange={(e) => handleSelectChange(comp.id, e.target.value)}
                                            value={selectedCollectors[comp.id] || ""}
                                        >
                                            <option value="">Select Collector</option>
                                            {collectors.map(col => <option key={col.id} value={col.id}>{col.username}</option>)}
                                        </select>
                                    
                                        <button 
                                            onClick={() => assignCollector(comp.id, selectedCollectors[comp.id], "complaint")} 
                                            className="mt-3 bg-slate-900 hover:bg-black text-white font-bold py-3 !rounded-2xl transition-all active:scale-95 shadow-xl shadow-slate-200"
                                        >
                                            Assign Collector
                                        </button>
                                    </>
                                    ) : (
                                        <div className="mt-2 bg-green-50 text-green-700 text-center py-3 rounded-2xl font-black uppercase text-sm border border-green-100">
                                            Assigned
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </LoadScript>
            )}
        </div>
        <Footer />
        </>
    );
}