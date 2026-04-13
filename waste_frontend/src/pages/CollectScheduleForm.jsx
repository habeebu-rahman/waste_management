import { useState, useEffect } from "react";
import API from "../api/api";
import keralaData from "../api/kerala.json";

export function CollectScheduleForm() {
    const [categories, setCategories] = useState([]);
    const [panchayaths, setPanchayaths] = useState([]);
    const [wards, setWards] = useState([]);
    const [collectors, setCollectors] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        date: "",
        category: "",
        district: "",
        panchayath: "",
        ward: "",
        collector: ""
    });

    useEffect(() => {
        // Fetch collectors and categories on mount
        API.get('auth/users/collectors/').then(res => setCollectors(res.data));
        API.get('waste/categories/')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        const selectedDist = keralaData.find(d => d.id == districtId);
        setPanchayaths(selectedDist?.panchayaths || []);
        setWards([]); 
        setForm({ ...form, district: districtId, panchayath: "", ward: "" });
    };

    const handlePanchayathChange = (e) => {
        const panId = e.target.value;
        const selectedPan = panchayaths.find(p => p.id == panId);
        setWards(selectedPan?.wards || []);
        setForm({ ...form, panchayath: panId, ward: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("waste/schedules/", form);
            alert("New Collection Schedule Published!");
            setForm({ date: "", category: "", district: "", panchayath: "", ward: "", collector: "" });
        } catch (err) {
            console.error("Creation failed:", err);
            alert("Check if all fields are filled correctly.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-slate-900">Schedule Management</h1>
            
            <div className="bg-white bg-opacity-80 border rounded-2xl p-8 shadow-md">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-800">Create New Collection Schedule</h2>
                    <p className="text-sm text-gray-500">Set dates and assign collectors for specific wards.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Top Row: Date and Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Collection Date</label>
                            <input 
                                type="date" 
                                required
                                className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                value={form.date}
                                onChange={(e) => setForm({...form, date: e.target.value})}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Waste Category</label>
                            <select 
                                required
                                className="border rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                value={form.category}
                                onChange={(e) => setForm({...form, category: e.target.value})}
                            >
                                <option value="">Select Category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Location Selection: Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase">District</label>
                            <select 
                                required
                                className="border rounded-lg p-2 text-sm bg-white"
                                onChange={handleDistrictChange}
                                value={form.district}
                            >
                                <option value="">Select District</option>
                                {keralaData.map(d => <option key={d.id} value={d.id}>{d.district}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className={`text-[10px] font-black text-slate-400 uppercase`}>Panchayath</label>
                            <select 
                                required
                                disabled={!form.district}
                                className="border rounded-lg p-2 text-sm bg-white disabled:bg-gray-100"
                                onChange={handlePanchayathChange}
                                value={form.panchayath}
                            >
                                <option value="">{form.district ? "Select Panchayath" : "Choose District First..."}</option>
                                {panchayaths.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase">Ward</label>
                            <select 
                                required
                                disabled={!form.panchayath}
                                className="border rounded-lg p-2 text-sm bg-white disabled:bg-gray-100"
                                onChange={(e) => setForm({...form, ward: e.target.value})}
                                value={form.ward}
                            >
                                <option value="">{form.panchayath ? "Select Ward" : "Choose Panchayath First..."}</option>
                                {wards.map(w => <option key={w.id} value={w.id}>Ward {w.number}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Collector Assignment Card */}
                    <div className="flex items-center justify-between bg-blue-50 p-5 rounded-2xl border border-blue-100">
                        <div className="hidden md:block">
                            <h3 className="text-sm font-bold text-blue-900">Assign Field Staff</h3>
                            <p className="text-xs text-blue-600">Choose the collector for this area</p>
                        </div>
                        <div className="flex flex-1 md:flex-none gap-3">
                            <select 
                                required
                                className="flex-1 border-blue-200 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                                onChange={(e) => setForm({...form, collector: e.target.value})}
                                value={form.collector}
                            >
                                <option value="">Choose a Collector</option>
                                {collectors.map(col => (
                                    <option key={col.id} value={col.id}>{col.username}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg active:scale-[0.98] disabled:bg-slate-400"
                    >
                        {loading ? "PROCESSING..." : "PUBLISH SCHEDULE"}
                    </button>
                </form>
            </div>
        </div>
    );
}