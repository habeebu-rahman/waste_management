import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 1. Validation Logic
    const validate = () => {
        let newErrors = {};
        if (!form.username.trim()) newErrors.username = "Username is required";
        if (form.password.length < 8) newErrors.password = "Password must be at least 8 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validate()) return; // Stop if validation fails

        setLoading(true);
        try {
            const res = await API.post('token/', form);
            // Sync with your Navbar key!
            localStorage.setItem('access_token', res.data.access);

            const userRes = await API.get('auth/me');
            const role = userRes.data.role;
            localStorage.setItem('role', role);

            if (role === 'admin') navigate('/admin');
            else if (role === 'collector') navigate('/collector');
            else navigate('/');
            
        } catch (err) {
            console.error(err);
            setErrors({ server: "Invalid username or password. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-100">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 mt-2">Enter your credentials to access the system</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Server Error Message */}
                    {errors.server && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                            {errors.server}
                        </div>
                    )}

                    {/* Username Field */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                        <input 
                            type="text" 
                            placeholder="Enter your username" 
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 ${
                                errors.username ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-green-100 focus:border-green-500'
                            }`}
                            onChange={(e) => {
                                setForm({ ...form, username: e.target.value });
                                if (errors.username) setErrors({...errors, username: ''});
                            }}
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1 font-medium">{errors.username}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 ${
                                errors.password ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-green-100 focus:border-green-500'
                            }`}
                            onChange={(e) => {
                                setForm({ ...form, password: e.target.value });
                                if (errors.password) setErrors({...errors, password: ''});
                            }}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                    </div>

                    {/* Login Button */}
                    <button 
                        disabled={loading}
                        className={`w-full py-3 !rounded-xl font-bold text-white !shadow-lg !shadow-green-500/40 transition-all active:scale-95 flex justify-center items-center gap-2 ${
                            loading ? 'bg-green-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm !mt-8">
                    Don't have an account? <a href="/register" className="!text-green-600 font-bold hover:!underline !no-underline">Register here</a>
                </p>
            </div>
        </div>
    );
}