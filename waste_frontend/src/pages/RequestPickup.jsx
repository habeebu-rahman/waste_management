import { useState, useEffect } from "react";
import API from "../api/api";
import { Footer } from "../components/Footer";
import Swal from "sweetalert2";

export function RequestPickup() {
    const [categories, setCategories] = useState([]);
    const [formRequest, setFormRequest] = useState({
        category: '',
        preferred_date: '',
    });

    const getMinDate = () => {
        const dt = new Date();
        dt.setDate(dt.getDate() + 2); // Minimum 2 days from now
        return dt.toISOString().split('T')[0];
    };

    useEffect(() => {
        API.get('waste/categories/')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleSubmitRequest = async (e) => {
        e.preventDefault();
        
        // Basic Validation
        if(!formRequest.category|| !formRequest.preferred_date) {
            alert("Please fill all fields");
            return;
        }

        try {
            await API.post("waste/requests/", formRequest);
            
            Swal.fire({
                title: 'submitted',
                text: 'Pickup Request Submitted Successfully!',
                icon: 'success',
                background:'white',
                showConfirmButton:true,
                timer:1000,
                timerProgressBar:true
            })
            // Reset form
            setFormRequest({ category: '', preferred_date: ''});
        } catch (err) {
            console.error(err.response?.data);
            alert("Submission failed. Please check your connection.");
        }
    };

    return (
        <>
        <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-100">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-blue-100 rounded-2xl mb-4">
                        <span className="text-3xl">🚛</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800">Schedule a Pickup</h2>
                    <p className="text-slate-500 font-medium">Professional waste collection at your doorstep.</p>
                </div>

                <form onSubmit={handleSubmitRequest} className="space-y-5">
                    {/* Category Selection */}
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Waste Category</label>
                        <select 
                            value={formRequest.category}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                            onChange={(e) => setFormRequest({ ...formRequest, category: e.target.value })}
                        >
                            <option value="">Select Category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Address Field */}
                    {/* <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Collection Address</label>
                        <textarea 
                            value={formRequest.address}
                            placeholder="Enter your full address"
                            rows="3"
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                            onChange={(e) => setFormRequest({ ...formRequest, address: e.target.value })}
                        />
                    </div> */}

                    {/* Date Field */}
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Preferred Date</label>
                        <input 
                            type="date" 
                            min={getMinDate()} 
                            value={formRequest.preferred_date}
                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                            onChange={(e) => setFormRequest({ ...formRequest, preferred_date: e.target.value })} 
                        />
                        <p className="text-[10px] text-slate-400 mt-2 italic font-medium">*Pickups must be scheduled at least 2 days in advance.</p>
                    </div>

                    {/* Submit Button */}
                    <button className="w-full bg-green-700 hover:bg-green-600 !shadow-lg !shadow-green-500/40 text-white font-extrabold py-4 !rounded-2xl  transition-all active:scale-95 mt-4">
                        REQUEST PICKUP
                    </button>
                </form>
            </div>
        </div>
        <Footer />
        </>
    );
}