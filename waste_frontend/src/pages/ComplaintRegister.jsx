import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import API from '../api/api';

export function ComplaintRegister() {
    const [location, setLocation] = useState({ lat: 11.2588, lng: 75.7804 });
    const [form, setForm] = useState({ place: '', image: null, category: '' });
    const [categories, setCategories] = useState([]);
    const [preview, setPreview] = useState(null); // For image preview

    const API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

    useEffect(() => {
        API.get('waste/categories/')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleMapClick = (e) => {
        setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setForm({ ...form, image: file });
        // Create a local URL for image preview
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('place', form.place);
        data.append('image', form.image);
        data.append('category', form.category);
        data.append('latitude', location.lat);
        data.append('longitude', location.lng);

        try {
            await API.post("waste/complaint/", data);
            alert("Complaint submitted successfully!");
            // Optional: reset form or redirect
        } catch (err) {
            console.log(err.response?.data);
            alert("Submission failed. Check details.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-4xl w-full border border-slate-100">
                <h2 className="text-3xl font-black text-slate-800 mb-2">Report Waste</h2>
                <p className="text-slate-500 mb-8 font-medium">Pin the location and upload an image to help us clean up.</p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Side: Inputs */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Place / Landmark</label>
                            <input 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. Near City Hospital Park" 
                                onChange={(e) => setForm({ ...form, place: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Waste Category</label>
                            <select 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Upload Photo</label>
                            <div className="relative group">
                                <input 
                                    type='file' accept='image/*' capture='environment'
                                    onChange={handleImageChange}
                                    className="hidden" 
                                    id="file-upload"
                                />
                                <label 
                                    htmlFor="file-upload"
                                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all"
                                >
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-2xl" />
                                    ) : (
                                        <div className="text-center">
                                            <span className="text-4xl">📸</span>
                                            <p className="text-sm text-slate-500 font-bold mt-2">Click to take a photo</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Map */}
                    <div className="flex flex-col">
                        <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Tap to Pin Location</label>
                        <div className="rounded-3xl overflow-hidden border-4 border-slate-50 shadow-inner flex-grow h-[300px] md:h-full">
                            <LoadScript googleMapsApiKey={API_KEY}>
                                <GoogleMap 
                                    center={location} 
                                    zoom={14} 
                                    mapContainerStyle={{ height: '100%', width: '100%' }} 
                                    onClick={handleMapClick}
                                    options={{ disableDefaultUI: true }}
                                >
                                    <Marker position={location} />
                                </GoogleMap>
                            </LoadScript>
                        </div>
                        <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 transition-transform active:scale-95">
                            SUBMIT COMPLAINT
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}