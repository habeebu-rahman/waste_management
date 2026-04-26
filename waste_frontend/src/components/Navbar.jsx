import { Link, useNavigate,useLocation } from "react-router-dom";
import { useState } from "react";

export function AppNavbar({setLogRole}) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const location = useLocation();
    const activeLink = "!text-green-500 !font-bold";
    const inactiveLink = "!text-slate-300 hover:!text-green-500";

    // const token = localStorage.getItem('token'); 
    const role = localStorage.getItem('role');

    const logout = () => {
        localStorage.clear();
        navigate('/login');
        setIsOpen(false)
        setLogRole(false)
    };

    return (
        <nav className="bg-gradient-to-r from-green-700 to-blue-950 border-b border-slate-800 px-6 py-4 shadow-2xl group">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                
                {/* 1. BRAND - No underline, custom colors */}
                <Link to="/" className="flex items-center gap-2 !no-underline ">
                    <div className=" p-1.5 rounded-lg group-hover:rotate-180 transition-transform duration-[1000ms] ease-in">
                        <span className="text-3xl">♻️</span>
                    </div>
                    <span className="text-3xl font-black text-white">
                        KL<span className="text-green-500 ">een</span>
                    </span>
                </Link>

                {/* 2. DESKTOP MENU - Clean spacing, no underlines */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className={`${location.pathname === "/" ? activeLink : inactiveLink} font-medium !no-underline transition-all hover:-translate-y-0.5`} >
                        Home
                    </Link>
                    
                    {!role ? (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className={`${location.pathname === "/login" ? activeLink : inactiveLink} !no-underline font-medium px-4 py-2 rounded-lg hover:bg-slate-800/40 transition-colors`}>
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
                                <Link to="/request" className={`${location.pathname === "/request" ? activeLink : inactiveLink} !no-underline font-medium`}>Schedule Pickup</Link>
                                <Link to="/complaint" className={`${location.pathname === "/complaint" ? activeLink : inactiveLink} !no-underline font-medium`}>Report Issue</Link>
                            </>
                            }
                            {role === "admin" && 
                            <>
                                <Link to="/admin" className={`${location.pathname === "/admin" ? activeLink : inactiveLink} font-medium !no-underline `}>Admin Panel</Link>
                                <Link to="/collection_schedule" className={`${location.pathname === "/collection_schedule" ? activeLink : inactiveLink} font-medium !no-underline `}>Collection Schedule</Link>
                            </>
                            }
                            {role === "collector" && <Link to="/collector" className={`${location.pathname === "/collector" ? activeLink : inactiveLink} font-medium !no-underline `}>Collector Portal</Link>}

                            <Link to="/profile" className={`${location.pathname === "/profile" ? activeLink : inactiveLink} font-medium !no-underline transition-all hover:-translate-y-0.5`}>
                                profile
                            </Link>
                            
                            <button 
                                onClick={logout}
                                className="bg-green-800 hover:bg-red-800 text-white px-3 py-2 !rounded-lg font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* 3. MOBILE TOGGLE */}
                <button 
                    className="md:hidden text-slate-400 hover:text-white p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
                </button>
            </div>

            {/* 4. MOBILE MENU */}
            {isOpen && (
                <div className="md:hidden mt-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-4">
                    <Link to="/" className={`${location.pathname === "/" ? activeLink : inactiveLink} py-3 px-4 rounded-lg hover:bg-slate-800/40 !no-underline `} onClick={() => setIsOpen(false)}>Home</Link>
                    {role ? (
                        <>
                        {role === "citizen" && 
                        <>
                            <Link to="/request" className={`${location.pathname === "/request" ? activeLink : inactiveLink} py-3 px-4 rounded-lg hover:bg-slate-800/40 !no-underline`} onClick={() => setIsOpen(false)}>Schedule Pickup</Link>
                            <Link to="/complaint" className={`${location.pathname === "/complaint" ? activeLink : inactiveLink} py-3 px-4 rounded-lg hover:bg-slate-800/40 !no-underline`} onClick={() => setIsOpen(false)}>Report Issue</Link>
                        </>
                        }
                        {role === "admin" && 
                        <>
                            <Link to="/admin" className={`${location.pathname === "/admin" ? activeLink : inactiveLink} py-3 px-4 rounded-lg hover:bg-slate-800/40 !no-underline`} onClick={() => setIsOpen(false)}>Admin Panel</Link>
                            <Link to="/collection_schedule" className={`${location.pathname === "/collection_schedule" ? activeLink : inactiveLink} font-bold !no-underline`} onClick={() => setIsOpen(false)}>Collection Schedule</Link>
                        </>
                        }
                        {role === "collector" && <Link to="/collector" className={`${location.pathname === "/collector" ? activeLink : inactiveLink} py-3 px-4 rounded-lg hover:bg-slate-800/40 !no-underline`} onClick={() => setIsOpen(false)}>Collector Portal</Link>}

                        <Link to="/profile" className={`${location.pathname === "/profile" ? activeLink : inactiveLink} py-3 px-4 rounded-lg hover:bg-slate-800/40 !no-underline `} onClick={() => setIsOpen(false)}>profile</Link>
                        <button onClick={logout} className="bg-green-800 hover:bg-red-800 text-white p-3 !rounded-lg w-full font-bold mt-2">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`${location.pathname === "/login" ? activeLink : inactiveLink} py-3 px-4 rounded-lg hover:bg-slate-800/40 !no-underline`} onClick={() => setIsOpen(false)}>Login</Link>
                            <Link to="/register" className="bg-green-600 hover:!bg-green-500 focus:!text-green-500 text-white py-3 px-4 rounded-lg text-center font-bold !no-underline mt-2" onClick={() => setIsOpen(false)}>Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}