import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import API from "../api/api";
import { Footer } from "../components/Footer";

const BASE_URL = "http://127.0.0.1:8000"; 
const PLACEHOLDER = "https://placehold.co/200x200?text=No+Image";

export function CollectorDashboard() {
    // 1. ADD TAB STATE
    const [activeTab, setActiveTab] = useState('requests'); // 'requests' or 'complaints'
    
    const [request, setRequest] = useState([]);
    const [complaint, setComplaint] = useState([]);

    const API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

    useEffect(() => {
        // Fetch Service Requests
        API.get('waste/requests/')
            .then(res => setRequest(res.data))
            .catch(err => console.error("Request Fetch Error:", err));

        // Fetch Public Complaints
        API.get('waste/complaint/')
            .then(res => setComplaint(res.data))
            .catch(err => console.error("Complaint Fetch Error:", err));
    }, []);

    const markCompleted = async (id, type = "request") => {
        const endpoint = type === "complaint" ? `waste/complaint/${id}/` : `waste/requests/${id}/`;
        try {
            await API.patch(endpoint, { status: 'completed' });
            
            // Update local state immediately
            if (type === "request") {
                setRequest(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
            } else {
                setComplaint(prev => prev.map(c => c.id === id ? { ...c, status: 'completed' } : c));
            }
        } catch (err) { 
            console.error("Patch Error:", err.response?.data); 
        }
    }

    return (
        <>
        <div className="p-8 bg-slate-50 min-h-screen max-w-6xl mx-auto">
            <h1 className="text-3xl font-black text-slate-800 mb-8">Collector Panel</h1>

            {/* --- 2. TAB TOGGLE --- */}
            <div className="flex gap-6 mb-8 border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab('requests')}
                    className={`pb-3 px-4 font-bold transition-all ${activeTab === 'requests' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Pickup Requests ({request.length})
                </button>
                <button 
                    onClick={() => setActiveTab('complaints')}
                    className={`pb-3 px-4 font-bold transition-all ${activeTab === 'complaints' ? 'border-b-4 border-red-600 text-red-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Active Complaints ({complaint.length})
                </button>
            </div>

            {/* --- 3. CONDITIONAL RENDERING --- */}

            {activeTab === 'requests' && (
                <div className="grid gap-4">
                    {request.length === 0 && <p className="text-slate-400 italic">No tasks assigned yet.</p>}
                    {request.map(req => (
                        <div key={req.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex justify-between items-center transition-hover hover:shadow-md">
                            <div>
                                <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-2 py-1 rounded uppercase tracking-widest">{req.category_name}</span>
                                <h3 className="text-xl font-bold text-slate-900 mt-2">{req.user_name}</h3>
                                <p className="text-slate-500 font-medium">📍 {req.address}</p>
                                <p className="text-xs mt-2 font-bold uppercase">
                                    Status: <span className={`text-xs mt-2 font-bold uppercase ${req.status === 'completed' ? 'text-green-500' : 'text-blue-500'}`}>{req.status}</span>
                                </p>
                            </div>
                            {req.status !== 'completed' ? (
                                <button 
                                    onClick={() => markCompleted(req.id, "request")} 
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 !rounded-xl !shadow-lg !shadow-green-400/40 transition-transform active:scale-95"
                                >
                                    Mark Done
                                </button>
                            ):(
                                <div className="mt-6 bg-green-50 text-green-700 text-center py-3 px-5 rounded-2xl font-black uppercase text-sm border border-green-100">
                                    Done
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'complaints' && (
                <LoadScript googleMapsApiKey={API_KEY}>
                    <div className="grid gap-6">
                        {complaint.length === 0 && <p className="text-slate-400 italic">No complaints assigned to you.</p>}
                        {complaint.map(comp => (
                            <div key={comp.id} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col justify-between">
                                    <div className="flex gap-5">
                                        <img 
                                            src={comp.image ? (comp.image.startsWith('http') ? comp.image : `${BASE_URL}${comp.image}`) : "https://placehold.co/100"} 
                                            className="w-20 h-20 rounded-lg object-cover shadow-sm"
                                            alt="Waste"
                                        />
                                        <div>
                                            <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-1 rounded uppercase tracking-widest">{comp.category_name}</span>
                                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{comp.user_name}</h3>
                                            <p className="text-slate-500 font-bold">{comp.user_phone}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6 bg-slate-50 py-2 px-4 rounded-2xl border !border-dashed border-slate-200 ">
                                        <p className="text-slate-700 text-sm"><strong>Reported at:</strong> {comp.place}</p>
                                    </div>

                                    {comp.status !== 'completed' ? (
                                        <button 
                                            onClick={() => markCompleted(comp.id, "complaint")} 
                                            className="!mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 !rounded-2xl transition-all active:scale-95 !shadow-lg !shadow-green-400/40"
                                        >
                                            Complete Job
                                        </button>
                                    ) : (
                                        <div className="mt-6 bg-green-50 text-green-700 text-center py-3 rounded-2xl font-black uppercase text-sm border border-green-100">
                                            Resolved
                                        </div>
                                    )}
                                </div>

                                {/* Map Column */}
                                <div className="h-[250px] md:h-full rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner">
                                    {/* <GoogleMap 
                                        center={{ lat: parseFloat(comp.latitude) || 0, lng: parseFloat(comp.longitude) || 0 }} 
                                        zoom={15}
                                        mapContainerStyle={{ height: '100%', width: '100%' }}
                                        options={{ disableDefaultUI: true }}
                                    >
                                        <Marker position={{ lat: parseFloat(comp.latitude) || 0, lng: parseFloat(comp.longitude) || 0 }} />
                                    </GoogleMap> */}
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