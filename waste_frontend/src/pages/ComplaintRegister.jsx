import {GoogleMap,LoadScript,Marker} from '@react-google-maps/api';
import { useState,useEffect } from 'react';
import API from '../api/api';

export function ComplaintRegister(){

    const [location,setLocation] = useState({ lat: 11.2588, lng: 75.7804 })
    const [form,setForm] = useState({place:'',image:null,category:''})
    const [categories,setCategories] = useState([])

    const API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

    useEffect(()=>{
        API.get('waste/categories/')
            .then(res=>setCategories(res.data))
    },[]);

    const handleMapClick = (e)=>{
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()

        setLocation({ lat,lng })
    }

    const handleImageChange = (e)=>{
        setForm({...form, image:e.target.files[0]})
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();

        const data = new FormData();
        data.append('place',form.place)
        data.append('image',form.image)
        data.append('category',form.category)
        data.append('latitude',location.lat)
        data.append('longitude',location.lng)

        try {
            await API.post("waste/complaint/", data);
        } catch (err) {
            console.log(err.response?.data); // 🔥 shows real error
        }

        console.log('submitting: ',Object.fromEntries(data));

    }

    return(
        <form onSubmit={handleSubmit}>

            <input placeholder='enter the place' 
                onChange={(e)=>setForm({...form,place:e.target.value})}
            />

            <input type='file' accept='image/*' capture='enviornment'
                onChange={handleImageChange}
            />

            <select onChange={(e)=>setForm({...form,category: e.target.value})}>
                <option>Select Category</option>
                {categories.map((c)=>(
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            <LoadScript googleMapsApiKey= {API_KEY}>
            <GoogleMap center={location} zoom={12} 
                mapContainerStyle={{ height:'400px' }} onClick={handleMapClick}
            >
                <Marker position={location} />
            </GoogleMap>
            </LoadScript>

            <button>Submit Complaint</button>
        </form>
        
    )
}



