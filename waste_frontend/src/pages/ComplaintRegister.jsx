import {GoogleMap,LoadScript,Marker} from '@react-google-maps/api';
import { useState } from 'react';
import API from '../api/api';

export function ComplaintRegister(){

    const [location,setLocation] = useState({ lat: 11.2588, lng: 75.7804 })
    const [form,setForm] = useState({place:'',image:null})

    const API_KEY = import.meta.env.GOOGLE_MAPS_API_KEY;

    const handleMapClick = (e)=>{
        const lat = e.latLng.lat()
        const lng = e.latLng.lng()

        setLocation({ lat,lng })
    }

    const handleImageChange = (e)=>{
        setForm({...form, image:e.target.files[0]})
    }

    const handleSubmit = (e)=>{
        e.preventDefault();

        const data = new FormData();
        data.append('place',form.place)
        data.append('image',form.image)
        data.append('latitude',form.lat)
        data.append('longitude',form.lng)

        console.log('submitting: ',Object.fromEntries(data));
        API.post('waste/complaint',data)

    }

    return(
        <form onSubmit={handleSubmit}>

            <input placeholder='enter the place' 
                onChange={(e)=>setForm({...form,place:e.target.value})}
            />

            <input type='file' accept='image/*' capture='enviornment'
                onChange={handleImageChange}
            />

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



