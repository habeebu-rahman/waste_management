import { useState,useEffect } from "react";
import API from "../api/api";
import {GoogleMap,LoadScript,Marker} from '@react-google-maps/api';

export function RequestPickup(){
    const [categories,setCategories] = useState([])
    const[form,setForm] = useState({
        category : '',
        address : '',
        preferred_date : ''
    })
    const center =  {lat: 11.2588, lng: 75.7804 }

    useEffect(()=>{
        API.get('waste/categories/')
            .then(res=>setCategories(res.data))
    },[]);

    const handleSubmit = async(e)=>{
        e.preventDefault();
        await API.post('waste/requests/',form);
        alert('request Submitted')
    }

    return(
        <>
        <form onSubmit={handleSubmit}>
            <select onChange={(e)=>setForm({...form,category: e.target.value})}>
                <option>Select Category</option>
                {categories.map((c)=>(
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            <input type="text" placeholder="Address" onChange={(e)=>setForm({...form,address:e.target.value})} />
            <input type="date"  onChange={(e)=>setForm({...form,preferred_date:e.target.value})} />
            <button>Request Pickup</button>
        </form>

        <LoadScript>
            <GoogleMap center={center} zoom={12} mapContainerStyle={{ height:'400px' }}>
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
        </>
    )
}