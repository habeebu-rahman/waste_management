import { useEffect, useState } from "react";
import API from "../api/api";
import keralaData from "../api/kerala.json";

export function Profile() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({ requests: 0, complaints: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({});


    const [errors, setErrors] = useState({}); // Stores errors for EVERY field
    const [loading, setLoading] = useState(false);

    // Verification States
    const [emailOtp, setEmailOtp] = useState("");
    const [phoneOtp, setPhoneOtp] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [emailOtpInvalid, setEmailOtpInvalid] = useState(false);
    const [phoneOtpInvalid, setPhoneOtpInvalid] = useState(false);

    const [panchayaths, setPanchayaths] = useState([]);
    const [wards, setWards] = useState([]);

    useEffect(()=>{
        // Fetch current user details
        API.get('auth/me/')
            .then(res => {
                setUser(res.data);
                setForm(res.data); // Initialize form with user data

                if (res.data.district) {
                    const found = keralaData.find(d => d.id == res.data.district);
                    setPanchayaths(found?.panchayaths || []);
                    
                    // If they have a panchayath, pre-load the wards
                    if (res.data.panchayath) {
                        const pFound = found?.panchayaths.find(p => p.id == res.data.panchayath);
                        setWards(pFound?.wards || []);
                    }
                }
                return Promise.all([
                    API.get('waste/requests/'),
                    API.get('waste/complaint/')
                ]);
            })
            .then(([reqs, comps]) => {
                setStats({
                    requests: reqs.data.length,
                    complaints: comps.data.length
                });
            })
            .catch(err => console.error("Profile Fetch Error:", err));
    }, []);


    const validate = () => {
        let e = {};
        if (!form.username.trim()) e.username = "Username is required";
        if (form.username.length < 3) e.username = "Username must be at least 3 characters";
        
        // if (!form.password) e.password = "Password is required";
        // else if (form.password.length < 8) e.password = "Password must be at least 8 characters";

        if (!form.email) e.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email format";

        if (!form.phone) e.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit mobile number";

        if (!form.district) e.district = "Please select a district";
        if (!form.panchayath) e.panchayath = "Please select a panchayath";
        if (!form.ward) e.ward = "Please select a ward";
        if (!form.houseNo.trim()) e.houseNo = "House number/name is required";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    // --- 2. OTP & API Handlers ---
    const sendOtp = async (type, value) => {
        if (!value) {
            setErrors(prev => ({ ...prev, [type]: `Enter ${type} to receive OTP` }));
            return;
        }
        try {
            await API.post("auth/send-otp/", { type, value });
            type === 'email' ? setEmailOtpSent(true) : setPhoneOtpSent(true);
        } catch (err) {
            setErrors(prev => ({ ...prev, [type]: "Failed to send OTP. Try again." }));
            console.log(err)
        }
    };


    const verifyOtp = async (type, otp) => {
        const value = type === 'email' ? form.email : form.phone;
        try {
            const res = await API.post("auth/verify-otp/", { type, otp, value });
            if (res.data.status === 'verified') {
                type === 'email' ? setIsEmailVerified(true) : setIsPhoneVerified(true);
                type === 'email' ? setEmailOtpInvalid(false) : setPhoneOtpInvalid(false);
                setErrors(prev => ({ ...prev, [type]: "" })); // Clear error on success
            }
        } catch (err) {
            setErrors(prev => ({ ...prev, [type]: "Invalid OTP code" }));
            console.log(err)
            type === 'email' ? setEmailOtpInvalid(true) : setPhoneOtpInvalid(true);
        }
    };

    const handleDistrictChange = (e) => {
        const id = e.target.value;
        const found = keralaData.find(d => d.id == id);
        setForm({ ...form, district: Number(id), panchayath: '', ward: '' });
        setPanchayaths(found?.panchayaths || []);
        setWards([]);
        setErrors(prev => ({ ...prev, district: "" })); // Clear error
    };
    const handlePanchayathChange = (e) => {
        const id = e.target.value;
        const found = panchayaths.find(p => p.id == id);
        setForm({ ...form, panchayath: Number(id), ward: '' });
        setWards(found?.wards || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submit clicked! Current Form State:", form);

        if (!isEmailVerified || !isPhoneVerified) {
            setErrors(prev => ({ ...prev, server: "Email and Phone must be verified first" }));
            return;
        }
    
        if (!validate()) {
            console.log("Validation Failed! Errors:", errors);
            return;
        }

        setLoading(true);
        try {
            // CHANGE 1: Use .patch instead of .post
            // CHANGE 2: Use the 'me' endpoint, not 'register'
            const res = await API.patch("auth/me/", form); 
            
            setUser(res.data); // Update the profile UI with new data
            setForm(res.data); // Update the form state
            setIsEditing(false); 
            alert("Profile Updated Successfully!");
        } catch (err) {
            console.error("Update Error:", err.response?.data);
            const serverErrors = err.response?.data;
            setErrors(serverErrors || { server: "Update failed." });
        } finally {
            setLoading(false);
        }
    };

    const inputClass = (fieldName) => `w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 ${
        errors[fieldName] ? 'border-red-500 focus:ring-red-100 bg-red-50/30' : 'border-slate-200 focus:ring-green-100 focus:border-green-500'
    }`;

    // Helper for error messages
    const ErrorLabel = ({ field }) => errors[field] ? (
        <p className="text-red-500 text-xs font-bold mt-1.5 ml-1 animate-in fade-in slide-in-from-left-1">
            {errors[field]}
        </p>
    ) : null;

    if (!user) return <div className="p-10 text-center font-bold">Loading Profile...</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                
                {/* --- HEADER / COVER --- */}
                <div className="relative bg-green-800 h-48 bg-gradient-to-r from-green-700 to-blue-950 rounded-t-3xl shadow-lg">
                    <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                        <div className="w-32 h-32 bg-white rounded-3xl p-1 shadow-xl">
                            <div className="w-full h-full bg-slate-300 rounded-2xl flex items-center justify-center text-4xl border-4 border-white">
                                👤
                            </div>
                            {/* {isEditing && (
                                <button className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full text-xs shadow-lg">
                                    📷
                                </button>
                            )} */}
                        </div>
                        <div className="mb-2">
                            <h1 className="text-3xl font-black text-white drop-shadow-md">{user.username}</h1>
                            <p className="!text-green-500 font-bold uppercase tracking-widest text-xs drop-shadow-md">
                                {user.role || 'Member'} • Joined 2026
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- CONTENT GRID --- */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left Column: Stats */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Activity Stats</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-2xl">
                                    <p className="text-2xl font-black text-blue-600">{stats.requests}</p>
                                    <p className="text-[10px] font-bold text-blue-400 uppercase">Pickups</p>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-2xl">
                                    <p className="text-2xl font-black text-red-600">{stats.complaints}</p>
                                    <p className="text-[10px] font-bold text-red-400 uppercase">Reports</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <button className="w-full text-left p-3 hover:bg-slate-50 rounded-xl transition-colors font-bold text-slate-700 flex items-center gap-3">
                                ⚙️ <span className="text-sm">Account Settings</span>
                            </button>
                            <button 
                                onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                                className="w-full text-left p-3 hover:bg-red-50 rounded-xl transition-colors font-bold text-red-500 flex items-center gap-3 mt-2"
                            >
                                🚪 <span className="text-sm">Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Detailed Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-black text-slate-800">Personal Information</h3>
                                <button 
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`text-xs font-black px-4 py-2 !rounded-xl transition-all ${isEditing ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                                >
                                    {isEditing ? 'CANCEL' : 'EDIT PROFILE'}
                                </button>
                            </div>

                            {/* user details */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {errors.server && <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-bold text-sm">{errors.server}</div>}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* name */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">User Name</label>
                                        <input 
                                            disabled={!isEditing}
                                            className={`w-full p-3 rounded-xl border ${isEditing ? 'bg-white border-blue-200' : 'bg-slate-50 border-transparent'} font-bold text-slate-700 outline-none transition-all ${inputClass('username')}`}
                                            value={form.username || ''}
                                            onChange={(e) => {setForm({...form, username: e.target.value}); setErrors({ ...errors, username: '' });}}
                                        />
                                        <ErrorLabel field="username" />
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Email Address</label>
                                        <input 
                                            disabled={!isEditing || isEmailVerified}
                                            className={`w-full p-3 rounded-xl border ${isEditing ? 'bg-white border-blue-200' : 'bg-slate-50 border-transparent'} font-bold text-slate-700 outline-none transition-all ${inputClass(errors.email)}`}
                                            value={form.email || ''}
                                            onChange={(e) => setForm({...form, email: e.target.value})}
                                        />
                                        {(!isEmailVerified && isEditing) && (
                                            <button type="button" onClick={() => sendOtp('email', form.email)} className="bg-slate-800 text-white px-4 rounded-lg text-sm font-bold hover:bg-slate-700 whitespace-nowrap">
                                                {emailOtpSent ? "Resend" : "Get OTP"}
                                            </button>
                                        )}
                                        {emailOtpSent && !isEmailVerified && (
                                            <div className="flex gap-2 mt-2 animate-in slide-in-from-top-2">
                                                <input className={inputClass()} placeholder="Enter 6-digit OTP" onChange={(e) => setEmailOtp(e.target.value)} />
                                                <button type="button" onClick={() => verifyOtp('email', emailOtp)} className="bg-green-600 text-white px-6 rounded-lg font-bold">Verify</button>
                                            </div>
                                        )}
                                        {isEmailVerified ? <p className="text-green-600 text-xs font-bold mt-2 flex items-center gap-1">✓ Verified Email ID</p> :
                                        emailOtpInvalid && <p className="text-red-600 text-xs font-bold mt-2 flex items-center gap-1">✘ OTP is wrong</p>}
                                    </div>
                                    {/* Phone */}
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Phone Number</label>
                                        <input 
                                            disabled={!isEditing || isPhoneVerified}
                                            className={`${inputClass(errors.phone)} w-full p-3 rounded-xl border ${isEditing ? 'bg-white border-blue-200' : 'bg-slate-50 border-transparent'} font-bold text-slate-700 outline-none transition-all`}
                                            value={form.phone ? `${form.phone}` : '+91 00000 00000'}
                                            onChange={(e) => setForm({...form, phone: e.target.value})}
                                        />
                                        {(!isPhoneVerified && isEditing) && (
                                            <button type="button" onClick={() => sendOtp('phone', form.phone)} className="bg-slate-800 text-white px-4 rounded-lg text-sm font-bold hover:bg-slate-700 whitespace-nowrap">
                                                {phoneOtpSent ? "Resend" : "Get OTP"}
                                            </button>
                                        )}
                                        {phoneOtpSent && !isPhoneVerified &&  (
                                            <div className="flex gap-2 mt-2">
                                                <input className={inputClass()} placeholder="Enter OTP" onChange={(e) => setPhoneOtp(e.target.value)} />
                                                <button type="button" onClick={() => verifyOtp('phone', phoneOtp)} className="bg-green-600 text-white px-6 rounded-lg font-bold">Verify</button>
                                            </div>
                                        )}
                                        {phoneOtpInvalid && <p className="text-red-600 text-xs font-bold mt-2 flex items-center gap-1">✘ OTP is wrong</p>}
                                        {isPhoneVerified && <p className="text-green-600 text-xs font-bold mt-2 flex items-center gap-1">✓ Verified Phone no</p>}
                                    </div>
                                    {/* Role (Read Only) */}
                                    <div className="mt-4">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase mt-7">Assigned Role</label>
                                        <p className="py-2 px-3 ml-2 bg-slate-100 rounded-xl text-slate-500 font-black text-xs uppercase inline-block">
                                            {user.role}
                                        </p>
                                    </div>
                                </div>

                                {/* Full Address Display */}
                                <div className="pt-4 border-t border-slate-50">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Current System Address</label>
                                    <p className="text-sm font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        {user.address || "No address generated. Please update your Ward/Panchayath details."}
                                    </p>
                                </div>
                                {isEditing &&(
                                    <>
                                    <label className="text-xs font-black uppercase text-slate-400">Address Details</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <select className={inputClass('district')} onChange={handleDistrictChange}>
                                                <option value="">Select District</option>
                                                {keralaData.map((d) => <option key={d.id} value={d.id}>{d.district}</option>)}
                                            </select>
                                            <ErrorLabel field="district" />
                                        </div>
                                        <div>
                                            <select className={inputClass('panchayath')} onChange={handlePanchayathChange} disabled={!form.district}>
                                                <option value="">Select Panchayath</option>
                                                {panchayaths.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                            <ErrorLabel field="panchayath" />
                                        </div>
                                        <div>
                                            <select className={inputClass('ward')} onChange={(e) => { setForm({ ...form, ward: Number(e.target.value) }); setErrors({...errors, ward:''}) }} disabled={!form.panchayath}>
                                                <option value=""> Select Ward</option>
                                                {wards.map((w) => <option key={w.id} value={w.id}>Ward {w.number}</option>)}
                                            </select>
                                            <ErrorLabel field="ward" />
                                        </div>
                                        <div>
                                            <input className={inputClass('houseNo')} disabled={!form.ward} onChange={(e) => { setForm({ ...form, houseNo: e.target.value }); setErrors({...errors, houseNo:''}) }} />
                                            <ErrorLabel field="houseNo" />
                                        </div>
                                    </div>
                                    </>
                                )}

                                {isEditing && (
                                    <button type="submit" disabled={loading} className="w-full bg-green-700 hover:bg-green-600 !shadow-lg !shadow-green-500/40 text-white font-black py-4 !rounded-2xl shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all">
                                        {loading ? 'Saving Changes...' : 'SAVE CHANGES'}
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* Recent Notification / Tips */}
                        <div className="bg-indigo-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-2">Environmental Impact</h3>
                                <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
                                    By using this platform, you've helped correctly dispose of {stats.requests * 50 + stats.complaints * 25}kg of waste this month. Keep it up!
                                </p>
                            </div>
                            <div className="absolute top-[-20%] right-[-10%] text-9xl opacity-10 rotate-12">
                                🌿
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}