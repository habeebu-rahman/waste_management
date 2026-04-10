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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schedules.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-400 italic font-medium">No collection schedules found for your area.</p>
                        </div>
                    )}
                    
                    {schedules.map((item) => (
                        <div 
                            key={item.id} 
                            className="group relative bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                        >
                            {/* Top Row: Category Tag & Date */}
                            <div className="flex justify-between items-start mb-6">
                                <span className="px-3 py-1 bg-blue-50 text-[10px] font-black text-blue-600 uppercase tracking-widest rounded-full border border-blue-100">
                                    {item.category_name}
                                </span>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-slate-900 leading-none">
                                        {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric' })}
                                    </p>
                                    <p className="text-xs font-bold text-slate-400 uppercase">
                                        {new Date(item.date).toLocaleDateString('en-IN', { month: 'short' })}
                                    </p>
                                </div>
                            </div>

                            {/* Middle: Main Location Info */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    📍
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-800 text-lg leading-tight">
                                        Ward {item.ward_number}
                                    </h4>
                                    <p className="text-sm font-medium text-slate-500 capitalize">
                                        {item.panchayath_name}, {item.district_name}
                                    </p>
                                </div>
                            </div>

                            {/* Bottom: Staff Assignment */}
                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">
                                        👤
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                        Collector
                                    </p>
                                </div>
                                <p className="text-sm font-black text-slate-700">
                                    {item.collector_name || 'Unassigned'}
                                </p>
                            </div>
                            
                            {/* Subtle Gradient Accent */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
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