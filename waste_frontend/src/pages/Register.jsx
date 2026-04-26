import { useState} from "react";
import keralaData from "../api/kerala.json";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export function Register() {
    const [form, setForm] = useState({
        username: '', password: '', email: '', phone: '',
        district: '', panchayath: '', ward: '', houseNo: '',
    });

    const navigate = useNavigate()

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

    // --- 1. Enhanced Validation Logic ---
    const validate = () => {
        let e = {};
        if (!form.username.trim()) e.username = "Username is required";
        if (form.username.length < 3) e.username = "Username must be at least 3 characters";
        
        if (!form.password) e.password = "Password is required";
        else if (form.password.length < 8) e.password = "Password must be at least 8 characters";

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

    //--- 2. OTP & API Handlers ---
    const sendOtp = async (type, value) => {
        if (!value) {
            setErrors(prev => ({ ...prev, [type]: `Enter ${type} to receive OTP` }));
            return;
        }
        if(type==='email'){
            if (!/^\S+@\S+\.\S+$/.test(value)){
                setErrors(prev => ({ ...prev, [type]: 'Invalid email format' }));
                return;
            }
        }
        if(type==='phone'){
            if (!/^\d{10}$/.test(value)){
                setErrors(prev => ({ ...prev, [type]: 'Enter a valid 10-digit mobile number' }));
                return;
            }
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
            // setErrors(prev => ({ ...prev, [type]: "Invalid OTP code" }));
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
        if (!validate()) return;
        if (!isEmailVerified || !isPhoneVerified) {
            setErrors(prev => ({ ...prev, server: "Email and Phone must be verified first" }));
            return;
        }

        setLoading(true);
        try {
            await API.post("auth/register/", form);

            Swal.fire({
            title: 'Registration completed',
            text: 'Your registration is successfully completed, we are stored the data into the database',
            icon: 'success',
            background:'white',
            showConfirmButton:false,
            timer:1500,
            timerProgressBar:true
        })
        setTimeout(() => {navigate('/login')},1500);
        // window.location.reload();

        } catch (err) {
            const serverData = err.response?.data;
            // If backend says username exists, map it to the username error state
            if (serverData?.username) {
                setErrors(prev => ({ ...prev, username: "This username is already taken try to add _" }));
            } else {
                setErrors(prev => ({ ...prev, server: "Registration failed. Please check all fields." }));
            }
        } finally {
            setLoading(false);
        }
    };

    // Helper for clean class names
    const inputClass = (fieldName) => `w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 ${
        errors[fieldName] ? 'border-red-500 focus:ring-red-100 bg-red-50/30' : 'border-slate-200 focus:ring-green-100 focus:border-green-500'
    }`;

    // Helper for error messages
    const ErrorLabel = ({ field }) => errors[field] ? (
        <p className="text-red-500 text-xs font-bold mt-1.5 ml-1 animate-in fade-in slide-in-from-left-1">
            {errors[field]}
        </p>
    ) : null;

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 flex justify-center">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
                <h2 className="text-3xl font-black text-slate-900 mb-8">Create Account</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.server && <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 font-bold text-sm">{errors.server}</div>}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-bold text-slate-700 block mb-2">Username</label>
                            <input className={inputClass('username')} placeholder="Username" onChange={(e) => { setForm({ ...form, username: e.target.value }); setErrors({ ...errors, username: '' }); }} />
                            <ErrorLabel field="username" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-700 block mb-2">Password</label>
                            <input type="password" value={form.password} className={inputClass('password')} placeholder="••••••••" onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }} />
                            <ErrorLabel field="password" />
                        </div>
                    </div>

                    {/* Email Group */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Verification</label>
                        <div className="flex gap-2">
                            <input 
                                type="email"
                                value={form.email}
                                disabled={isEmailVerified} 
                                className={inputClass('email')} 
                                placeholder="mail@example.com"
                                onChange={(e) => {
                                    setForm({ ...form, email: e.target.value });
                                    setErrors({ ...errors, email: '' });
                                }} 
                            />
                            {!isEmailVerified && (
                                <button type="button" onClick={() => sendOtp('email', form.email)} className="bg-green-700 text-white px-3 !rounded-lg text-sm font-bold hover:bg-green-800 whitespace-nowrap">
                                    {emailOtpSent ? "Resend" : "Get OTP"}
                                </button>
                            )}
                        </div>
                        
                        {/* --- OTP INPUT SPACE --- */}
                        {emailOtpSent && !isEmailVerified && (
                            <div className="flex gap-2 mt-2 animate-in slide-in-from-top-2">
                                <input 
                                    className={inputClass('emailOtp')} // Added specific field name for styling
                                    placeholder="Enter 6-digit OTP" 
                                    value={emailOtp}
                                    onChange={(e) => setEmailOtp(e.target.value)} 
                                />
                                <button type="button" onClick={() => verifyOtp('email', emailOtp)} className="bg-green-700 hover:bg-green-800 text-white px-4 !rounded-lg font-bold">
                                    Verify
                                </button>
                            </div>
                        )}
                        
                        <ErrorLabel field="email" />
                        {isEmailVerified && <p className="text-green-600 text-xs font-bold mt-2 flex items-center gap-1">✓ Verified Email ID</p>}
                        {emailOtpInvalid && !isEmailVerified && <p className="text-red-600 text-xs font-bold mt-2">✘ OTP is wrong</p>}
                    </div>

                    {/* Phone Group */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Phone Verification</label>
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={form.phone}
                                disabled={isPhoneVerified} 
                                className={inputClass('phone')} 
                                placeholder="10-digit number"
                                onChange={(e) => {
                                    setForm({ ...form, phone: e.target.value });
                                    setErrors({ ...errors, phone: '' });
                                }} 
                            />
                            {!isPhoneVerified && (
                                <button type="button" onClick={() => sendOtp('phone', form.phone)} className="bg-green-700 text-white px-3 !rounded-lg text-sm font-bold hover:bg-green-800 whitespace-nowrap">
                                    {phoneOtpSent ? "Resend" : "Get OTP"}
                                </button>
                            )}
                        </div>

                        {/* --- OTP INPUT SPACE --- */}
                        {phoneOtpSent && !isPhoneVerified && (
                            <div className="flex gap-2 mt-2 animate-in slide-in-from-top-2">
                                <input 
                                    className={inputClass('phoneOtp')} 
                                    placeholder="Enter OTP" 
                                    value={phoneOtp}
                                    onChange={(e) => setPhoneOtp(e.target.value)} 
                                />
                                <button type="button" onClick={() => verifyOtp('phone', phoneOtp)} className="bg-green-700 hover:bg-green-800 text-white px-4 !rounded-lg font-bold">
                                    Verify
                                </button>
                            </div>
                        )}

                        <ErrorLabel field="phone" />
                        {isPhoneVerified && <p className="text-green-600 text-xs font-bold mt-2 flex items-center gap-1">✓ Verified Phone no</p>}
                        {phoneOtpInvalid && !isPhoneVerified && <p className="text-red-600 text-xs font-bold mt-2">✘ OTP is wrong</p>}
                    </div>

                    {/* Address Grid */}
                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
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
                                    <option value="">{form.district ? "Select Panchayath" : "Choose District First..."}</option>
                                    {panchayaths.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <ErrorLabel field="panchayath" />
                            </div>
                            <div>
                                <select className={inputClass('ward')} onChange={(e) => { setForm({ ...form, ward: Number(e.target.value) }); setErrors({...errors, ward:''}) }} disabled={!form.panchayath}>
                                    <option value="">{form.panchayath ? "Select Ward" : "Choose Panchayath First..."}</option>
                                    {wards.map((w) => <option key={w.id} value={w.id}>Ward {w.number}</option>)}
                                </select>
                                <ErrorLabel field="ward" />
                            </div>
                            <div>
                                <input className={inputClass('houseNo')} placeholder="House No/Name" disabled={!form.ward} onChange={(e) => { setForm({ ...form, houseNo: e.target.value }); setErrors({...errors, houseNo:''}) }} />
                                <ErrorLabel field="houseNo" />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-4 !rounded-2xl font-black text-white !shadow-lg !shadow-green-500/40 !transition-all active:scale-95 ${
                            loading ? 'bg-slate-300' : 'bg-green-600 hover:bg-green-700 shadow-green-100'
                        }`}
                    >
                        {loading ? 'Creating Account...' : 'Register Now'}
                    </button>
                </form>
            </div>
        </div>
    );
}