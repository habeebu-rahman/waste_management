import { useEffect, useState } from "react";
import API from "../api/api";
import { PaymentButton } from "../components/PaymentButton";
import keralaData from "../api/kerala.json";

export function Dashboard() {
    const [schedules, setSchedules] = useState([]);
    const [request, setRequest] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [activeTab, setActiveTab] = useState('schedules');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterValues, setFilterValues] = useState({ district: '', panchayath: '', ward: '' });
    const [panchayaths, setPanchayaths] = useState([]);
    const [wards, setWards] = useState([]);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const role = localStorage.getItem('role');

    useEffect(() => {
        // Fetch universal schedules
        API.get('waste/schedules/')
            .then(res => setSchedules(res.data))
            .catch(err => console.log(err));

        // Fetch user-specific requests
        API.get(`waste/requests/`)
            .then(res => setRequest(res.data));

        API.get(`waste/complaint/`)
            .then(res => setComplaints(res.data));

        // API.get(`auth/me/`)
        //     .then(res => setUser(res.data));

    }, []);

    const handleDistrictChange = (e) => {
        const id = e.target.value; // This will be "01"
        const found = keralaData.find(d => d.id === id); // String comparison
        
        setFilterValues({ 
            ...filterValues, 
            district: id, // Keep as string "01"
            panchayath: '', 
            ward: '' 
        });
        
        setPanchayaths(found?.panchayaths || []);
        setWards([]);
    };

    const handlePanchayathChange = (e) => {
        const id = e.target.value; // This will be "011"
        const found = panchayaths.find(p => p.id === id);
        
        setFilterValues({ 
            ...filterValues, 
            panchayath: id, 
            ward: '' 
        });
        
        setWards(found?.wards || []);
    };

    // Search Bar Logic (District, Panchayath, Ward, Collector)
    const filteredSchedules = schedules.filter(item => {
        // 1. Search Bar Logic
        const matchesSearch = 
            item.district_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.panchayath_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.ward_number.toString().includes(searchTerm) ||
            (item.collector_name && item.collector_name.toLowerCase().includes(searchTerm.toLowerCase()));

        // 2. Filter Modal Logic (Using == to handle string/number differences)
        const matchesDistrict = filterValues.district ? item.district == filterValues.district : true;
    const matchesPanchayath = filterValues.panchayath ? item.panchayath == filterValues.panchayath : true;
        const matchesWard = filterValues.ward ? item.ward == filterValues.ward : true;

        return matchesSearch && matchesDistrict && matchesPanchayath && matchesWard;
    });

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
                    className={`pb-3 px-2 font-bold transition-all ${activeTab === 'schedules' ? 'border-b-4 border-green-400 text-green-400' : 'text-slate-400'}`}
                >
                    Collection Schedules
                </button>
                <button 
                    onClick={() => setActiveTab('requests')}
                    className={`pb-3 px-2 font-bold transition-all ${activeTab === 'requests' ? 'border-b-4 border-green-500 text-green-500' : 'text-slate-400'}`}
                >
                    My Requests ({request.length})
                </button>
                {role ==='citizen' && <button 
                    onClick={() => setActiveTab('complaints')}
                    className={`pb-3 px-2 font-bold transition-all ${activeTab === 'complaints' ? 'border-b-4 border-green-600 text-green-600' : 'text-slate-400'}`}
                >
                    My Reports ({complaints.length})
                </button>}
            </div>

            {/* --- SCHEDULES PANEL --- */}
            {role === 'admin' && activeTab === 'schedules' && (
                <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
                    {/* Search Bar */}
                    <div className="relative flex-1 w-full">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                        <input 
                            type="text"
                            placeholder="Search district, panchayath, ward or collector..."
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Filter Button */}
                    <button 
                        onClick={() => {
                            // Re-populate the lists based on existing filterValues before opening
                            if (filterValues.district) {
                                const foundDistrict = keralaData.find(d => d.id == filterValues.district);
                                setPanchayaths(foundDistrict?.panchayaths || []);
                                
                                if (filterValues.panchayath) {
                                    const foundPanchayath = foundDistrict?.panchayaths.find(p => p.id == filterValues.panchayath);
                                    setWards(foundPanchayath?.wards || []);
                                }
                            }
                            setShowFilters(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white !rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
                    >
                        {!(filterValues.district || filterValues.panchayath || filterValues.ward) && <span>✨</span>} Filter
                        {(filterValues.district || filterValues.panchayath || filterValues.ward) && (
                            <span className="w-3 h-3 mt-1 bg-blue-400 rounded-full animate-pulse"></span>
                        )}
                    </button>
                </div>
            )}
            {activeTab === 'schedules' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schedules.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-slate-400 italic font-medium">No collection schedules found for your area.</p>
                        </div>
                    )}
                    
                    {filteredSchedules.map((item) => (
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

                    {/* --- FILTER MODAL --- */}
                    {showFilters && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl scale-in-center transition-transform">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-slate-800">Filter Schedules</h3>
                                    <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                                </div>

                                <div className="space-y-4">
                                    {/* District Select */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase">District</label>
                                        <select 
                                            className="border rounded-xl p-3 bg-slate-50 outline-none focus:border-blue-500"
                                            onChange={handleDistrictChange} 
                                            value={filterValues.district}
                                        >
                                            <option value="">All Districts</option>
                                            {keralaData.map((d) => (
                                                <option key={d.id} value={d.id}>{d.district}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Panchayath Select - Disabled if no district */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase">Panchayath</label>
                                        <select 
                                            disabled={!filterValues.district}
                                            className="border rounded-xl p-3 bg-slate-50 disabled:opacity-50"
                                            // value={filterValues.panchayath}
                                            onChange={handlePanchayathChange}
                                        >
                                            <option value="">{filterValues.district ? "Select Panchayath" : "Choose District First..."}</option>
                                            {panchayaths.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>

                                    {/* Ward Select - Disabled if no panchayath */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase">Ward</label>
                                        <select 
                                            disabled={!filterValues.panchayath}
                                            className="border rounded-xl p-3 bg-slate-50 disabled:opacity-50"
                                            // value={filterValues.ward}
                                            onChange={(e) => { setFilterValues({ ...filterValues, ward: Number(e.target.value) });}}
                                        >
                                            <option value="">All Wards</option>
                                            {wards.map((w) => <option key={w.id} value={w.id}>Ward {w.number}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <button 
                                        onClick={() => { setFilterValues({district:'', panchayath:'', ward:''}); setShowFilters(false); }}
                                        className="flex-1 py-3 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all"
                                    >
                                        Reset
                                    </button>
                                    <button 
                                        onClick={() => setShowFilters(false)}
                                        className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                                    >
                                        Apply Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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
                                    {req.status === 'completed' ? '✅' : req.status === 'pending' ? '⏳':'🏷️'}
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

                            {req.status !== 'completed' && <PaymentButton amount={100} requestId={req.id}/>}
                        </div>
                    ))}
                </div>
            )}

            {/* complaints panel */}
            {activeTab === 'complaints' && (
                <div className="space-y-4">
                    {complaints.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <p className="text-slate-400 font-medium">You haven't sent any pickup requests yet.</p>
                        </div>
                    )}
                    {complaints.map(comp => (
                        <div key={comp.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-xl ${comp.status === 'completed' ? 'bg-green-50' : 'bg-orange-50'}`}>
                                    {comp.status === 'completed' ? '✅' : comp.status === 'pending' ? '⏳':'🏷️'}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-tighter">
                                            {comp.category_name}
                                        </span>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                                            comp.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                            comp.status === 'assigned' ? 'bg-blue-100 text-blue-700' : 
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                            {comp.status}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 mt-1">{comp.place}</h3>
                                </div>
                            </div>
                            <div>
                                <img 
                                    src={comp.image ? (comp.image.startsWith('http') ? comp.image : `${BASE_URL}${comp.image}`) : "https://placehold.co/100"} 
                                    className="w-20 h-20 rounded-lg object-cover shadow-sm"
                                    alt="Waste"
                                />
                            </div>
                            
                            <div className="text-right border-t md:border-t-0 pt-3 md:pt-0">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">complaint ID</p>
                                <p className="font-mono text-sm text-slate-600">#00{comp.id}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}