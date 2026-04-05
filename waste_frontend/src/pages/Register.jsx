import { useState } from "react";
import data from "../api/kerala.json";
import API from "../api/api";

export function Register() {
    const [form, setForm] = useState({
        username: '', password: '', email: '', phone: '',
        district: '', panchayath: '', ward: '', houseNo: '',
    });

    // Verification States
    const [emailOtp, setEmailOtp] = useState("");
    const [phoneOtp, setPhoneOtp] = useState("");
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);

    const [panchayaths, setPanchayaths] = useState([]);
    const [wards, setWards] = useState([]);

    // --- OTP Handlers ---
    const sendOtp = async (type, value) => {
        console.log(`Sending OTP for ${type}. Value is:`, value);
        if (!value) return alert(`Please enter ${type} first`);
        try {
            await API.post("auth/send-otp/", { type, value });
            type === 'email' ? setEmailOtpSent(true) : setPhoneOtpSent(true);
            alert(`OTP sent to your ${type}`);
        } catch (err) { console.log(`Failed to send OTP ${err}`); }
    };

    const verifyOtp = async (type, otp) => {
        try {
            // Get the actual email or phone string from the form state
            const value = type === 'email' ? form.email : form.phone;

            // Send 'value' along with the otp
            const res = await API.post("auth/verify-otp/", { type, otp, value });
            
            if (res.data.status === 'verified') {
                type === 'email' ? setIsEmailVerified(true) : setIsPhoneVerified(true);
                alert(`${type} verified successfully!`);
            }
        } catch (err) {
            console.error("Verification Error:", err.response?.data);
            alert("Invalid OTP");
        }
    };

    // --- Existing Handlers ---
    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        const foundDistrict = data.find(d => d.id == districtId);
        setForm({ ...form, district: Number(districtId), panchayath: '', ward: '' });
        setPanchayaths(foundDistrict?.panchayaths || []);
        setWards([]);
    };

    const handlePanchayathChange = (e) => {
        const panchayathId = e.target.value;
        const found = panchayaths.find(p => p.id == panchayathId);
        setForm({ ...form, panchayath: Number(panchayathId), ward: '' });
        setWards(found?.wards || []);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isEmailVerified || !isPhoneVerified) {
            return alert("Please verify both Email and Phone before registering");
        }
        try {
            await API.post("auth/register/", form);
            alert("Registration successful");
        } catch (err) { console.log(err.response?.data); }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
            <h2>Register</h2>
            
            <input placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />

            {/* EMAIL SECTION */}
            <div className="verify-group">
                <div style={{ display: 'flex', gap: '5px' }}>
                    <input 
                        placeholder="Email" 
                        disabled={isEmailVerified}
                        onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    />
                    {!isEmailVerified && (
                        <button type="button" onClick={() => sendOtp('email', form.email)}>
                            {emailOtpSent ? "Resend" : "Generate OTP"}
                        </button>
                    )}
                </div>
                {emailOtpSent && !isEmailVerified && (
                    <div style={{ marginTop: '5px' }}>
                        <input placeholder="Enter Email OTP" onChange={(e) => setEmailOtp(e.target.value)} />
                        <button type="button" onClick={() => verifyOtp('email', emailOtp)}>Verify</button>
                    </div>
                )}
                {isEmailVerified && <span style={{ color: 'green' }}>✓ Email Verified</span>}
            </div>

            {/* PHONE SECTION */}
            <div className="verify-group">
                <div style={{ display: 'flex', gap: '5px' }}>
                    <input 
                        placeholder="Phone No" 
                        disabled={isPhoneVerified}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                    />
                    {!isPhoneVerified && (
                        <button type="button" onClick={() => sendOtp('phone', form.phone)}>
                            {phoneOtpSent ? "Resend" : "Generate OTP"}
                        </button>
                    )}
                </div>
                {phoneOtpSent && !isPhoneVerified && (
                    <div style={{ marginTop: '5px' }}>
                        <input placeholder="Enter Phone OTP" onChange={(e) => setPhoneOtp(e.target.value)} />
                        <button type="button" onClick={() => verifyOtp('phone', phoneOtp)}>Verify</button>
                    </div>
                )}
                {isPhoneVerified && <span style={{ color: 'green' }}>✓ Phone Verified</span>}
            </div>

            <input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />

            {/* Address Selects */}
            <select onChange={handleDistrictChange}>
                <option value="">Select District</option>
                {data.map((d) => <option key={d.id} value={d.id}>{d.district}</option>)}
            </select>

            <select onChange={handlePanchayathChange} disabled={!form.district}>
                <option value="">Select Panchayath</option>
                {panchayaths.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            <select onChange={(e) => setForm({ ...form, ward: Number(e.target.value) })} disabled={!form.panchayath}>
                <option value="">Select Ward</option>
                {wards.map((w) => <option key={w.id} value={w.id}>Ward {w.number}</option>)}
            </select>

            <input placeholder="House No" disabled={!form.ward} onChange={(e) => setForm({ ...form, houseNo: e.target.value })} />

            <button 
                type="submit" 
                disabled={!isEmailVerified || !isPhoneVerified}
                style={{ backgroundColor: (isEmailVerified && isPhoneVerified) ? 'blue' : 'gray', color: 'white' }}
            >
                Register
            </button>
        </form>
    );
}