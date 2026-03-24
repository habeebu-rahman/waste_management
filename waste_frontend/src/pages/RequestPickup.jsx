import { useState,useEffect } from "react";
import API from "../api/api";

export function RequestPickup(){
    const [categories,setCategories] = useState([])
    const[form,setForm] = useState({
        category : '',
        address : '',
        preferred_date : ''
    })

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
    )
}