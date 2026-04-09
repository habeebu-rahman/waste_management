import { useEffect, useState } from "react";
import API from "../api/api";

export function Dashboard() {
    const [schedules, setSchedules] = useState([]);
    const [request, setRequest] = useState([]);
    const [activeTab, setActiveTab] = useState('schedules');

    useEffect(() => {
        // Fetch universal schedules
        API.get('waste/schedules/')
            .then(res => setSchedules(res.data))
            .catch(err => console.log(err));

        // Fetch user-specific requests
        API.get(`waste/requests/`)
            .then(res => setRequest(res.data));
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto min-h-screen bg-slate-50">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-slate-800">My Dashboard</h1>
                <p className="text-slate-500 font-medium">Track waste collection and your requests.</p>
            </header>

            {/* --- TAB NAVIGATION --- */}
            <div className="flex gap-6 mb-8 border-b border-slate-200">
                <button 
                    onClick={() => setActiveTab('schedules')}
                    className={`pb-3 px-2 font-bold transition-all ${activeTab === 'schedules' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-slate-400'}`}
                >
                    Collection Schedules
                </button>
                <button 
                    onClick={() => setActiveTab('requests')}
                    className={`pb-3 px-2 font-bold transition-all ${activeTab === 'requests' ? 'border-b-4 border-green-600 text-green-600' : 'text-slate-400'}`}
                >
                    My Requests ({request.length})
                </button>
            </div>

            {/* --- SCHEDULES PANEL --- */}
            {activeTab === 'schedules' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {schedules.length === 0 && <p className="text-slate-400 italic">No schedules available.</p>}
                    {schedules.map((item) => (
                        <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                            <div className="bg-blue-50 p-3 rounded-xl text-2xl">📅</div>
                            <div>
                                <p className="text-xs font-black text-blue-500 uppercase">{item.waste_type}</p>
                                <h4 className="font-bold text-slate-700">Ward {item.ward}, {item.panchayath_name}</h4>
                                <p className="text-sm text-slate-500">Collector: {item.collector_name || 'Not Assigned'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-black text-slate-800">{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                <p className="text-xs font-bold text-slate-400">2026</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- REQUESTS PANEL --- */}
            {activeTab === 'requests' && (
                <div className="space-y-4">
                    {request.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-medium">You haven't sent any pickup requests yet.</p>
                        </div>
                    )}
                    {request.map(req => (
                        <div key={req.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${req.status === 'completed' ? 'bg-green-50' : 'bg-orange-50'}`}>
                                    {req.status === 'completed' ? '✅' : '⏳'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-tighter">
                                            {req.category_name}
                                        </span>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                                            req.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                            req.status === 'assigned' ? 'bg-blue-100 text-blue-700' : 
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 mt-1">{req.address}</h3>
                                    <p className="text-xs text-slate-500 font-medium mt-1">
                                        Preferred: <strong>{req.preferred_date}</strong>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="text-right border-t md:border-t-0 pt-3 md:pt-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Request ID</p>
                                <p className="font-mono text-sm text-slate-600">#00{req.id}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}