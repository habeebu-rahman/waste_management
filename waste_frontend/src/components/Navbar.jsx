import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export function AppNavbar() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    // const token = localStorage.getItem('token'); 
    const role = localStorage.getItem('role');

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="bg-[#0f172a] border-b border-slate-800 px-6 py-4 shadow-2xl">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                
                {/* 1. BRAND - No underline, custom colors */}
                <Link to="/" className="flex items-center gap-2 !no-underline group">
                    <div className="bg-green-500 p-1.5 rounded-lg shadow-lg group-hover:rotate-12 transition-transform">
                        <span className="text-xl">♻️</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">
                        KL<span className="text-green-500">eeno</span>
                    </span>
                </Link>

                {/* 2. DESKTOP MENU - Clean spacing, no underlines */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="!text-slate-300 hover:!text-white font-medium !no-underline transition-all hover:-translate-y-0.5">
                        Home
                    </Link>
                    
                    {!role ? (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="!text-slate-300 hover:!text-green-500 !no-underline font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="bg-green-600 hover:!bg-green-500 text-white !no-underline font-bold px-6 py-2 rounded-full shadow-lg transition-all active:scale-95">
                                Register
                            </Link>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            {role === "citizen" && 
                            <>
                                <Link to="/request" className="!text-slate-300 hover:!text-green-500 !no-underline font-medium">Report Issue</Link>
                                <Link to="/complaint" className="!text-slate-300 hover:!text-green-500 !no-underline font-medium">complaint Issue</Link>
                            </>
                            }
                            {role === "admin" && <Link to="/admin" className="!text-slate-300 hover:!text-green-500 font-bold !no-underline">Admin Panel</Link>}
                            {role === "collector" && <Link to="/collector" className="!text-slate-300 hover:!text-green-500 font-bold !no-underline">Collector Portal</Link>}

                            <Link to="/profile" className="!text-slate-300 hover:!text-white font-medium !no-underline transition-all hover:-translate-y-0.5">
                                profile
                            </Link>
                            
                            <button 
                                onClick={logout}
                                className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-2 !rounded-lg font-bold !text-xs uppercase tracking-widest shadow-lg transition-all active:scale-95"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* 3. MOBILE TOGGLE */}
                <button 
                    className="md:hidden text-slate-300 hover:text-white p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
                </button>
            </div>

            {/* 4. MOBILE MENU */}
            {isOpen && (
                <div className="md:hidden mt-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-4">
                    <Link to="/" className="!text-slate-300 hover:!text-green-500 py-3 px-4 rounded-lg hover:bg-slate-800 !no-underline" onClick={() => setIsOpen(false)}>Home</Link>
                    {role ? (
                        <>
                        {role === "citizen" && 
                        <>
                            <Link to="/request" className="!text-slate-300 hover:!text-green-500 py-3 px-4 rounded-lg hover:bg-slate-800 !no-underline">Report Issue</Link>
                            <Link to="/complaint" className="!text-slate-300 hover:!text-green-500 py-3 px-4 rounded-lg hover:bg-slate-800 !no-underline">complaint Issue</Link>
                        </>
                        }
                        {role === "admin" && <Link to="/admin" className="!text-slate-300 hover:!text-green-500 py-3 px-4 rounded-lg hover:bg-slate-800 !no-underline">Admin Panel</Link>}
                        {role === "collector" && <Link to="/collector" className="!text-slate-300 hover:!text-green-500 py-3 px-4 rounded-lg hover:bg-slate-800 !no-underline">Collector Portal</Link>}

                        <Link to="/profile" className="!text-slate-300 hover:!text-green-500 py-3 px-4 rounded-lg hover:bg-slate-800 !no-underline" onClick={() => setIsOpen(false)}>profile</Link>
                        <button onClick={logout} className="bg-rose-600 text-white p-3 rounded-lg w-full font-bold mt-2">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="!text-slate-300 hover:!text-green-500 py-3 px-4 rounded-lg hover:bg-slate-800 !no-underline" onClick={() => setIsOpen(false)}>Login</Link>
                            <Link to="/register" className="bg-green-600 hover:!bg-green-500 text-white py-3 px-4 rounded-lg text-center font-bold !no-underline mt-2" onClick={() => setIsOpen(false)}>Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}