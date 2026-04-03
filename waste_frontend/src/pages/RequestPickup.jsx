import { useState,useEffect } from "react";
import API from "../api/api";
import {GoogleMap,LoadScript,Marker} from '@react-google-maps/api';


export function RequestPickup(){
    // request
    const [categories,setCategories] = useState([])
    const[formRequest,setFormRequest] = useState({
        category : '',
        address : '',
        preferred_date : ''
    })

    useEffect(()=>{
        API.get('waste/categories/')
            .then(res=>setCategories(res.data))
    },[]);

    const handleSubmitRequest = async(e)=>{
        e.preventDefault();
        try {
            await API.post("waste/requests/", formRequest);
            } catch (err) {
            console.log(err.response.data);
            }
        alert('request Submitted')
    }

    // complaint

    const [location,setLocation] = useState({ lat: 11.2588, lng: 75.7804 })
    const [formComplaint,setFormComplaint] = useState({place:'',image:null,category:''})
    const API_KEY = import.meta.env.VITE_GOOGLE_MAP_API_KEY;

    const handleMapClick = (e)=>{
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()

        setLocation({ lat,lng })
    }

    const handleImageChange = (e)=>{
        setFormComplaint({...formComplaint, image:e.target.files[0]})
    }

    const handleSubmitComplaint = async(e)=>{
        e.preventDefault();

        const data = new FormData();
        data.append('place',formComplaint.place)
        data.append('image',formComplaint.image)
        data.append('category',formComplaint.category)
        data.append('latitude',location.lat)
        data.append('longitude',location.lng)

        try {
            await API.post("waste/complaint/", data);
        } catch (err) {
            console.log(err.response?.data); // 🔥 shows real error
        }alert('complaint Submitted')

        // console.log('submitting: ',Object.fromEntries(data));

    }

    return(
        <>
        {/* request */}
        <form onSubmit={handleSubmitRequest}>
            <select onChange={(e)=>setFormRequest({...formRequest,category: e.target.value})}>
                <option>Select Category</option>
                {categories.map((c)=>(
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            {/* <input type="text" placeholder="Address" onChange={(e)=>setFormRequest({...formRequest,address:e.target.value})} /> */}
            <input type="date"  onChange={(e)=>setFormRequest({...formRequest,preferred_date:e.target.value})} />
            <button>Request Pickup</button>
        </form>
        
        <hr />

        {/* complaint */}
        <form onSubmit={handleSubmitComplaint}>

            <input placeholder='enter the place' 
                onChange={(e)=>setFormComplaint({...formComplaint,place:e.target.value})}
            />

            <input type='file' accept='image/*' capture='enviornment'
                onChange={handleImageChange}
            />

            <select onChange={(e)=>setFormComplaint({...formComplaint,category: e.target.value})}>
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
        </>
    )
}