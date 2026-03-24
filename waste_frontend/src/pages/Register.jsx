import { useState } from "react";
import API from "../api/api";

export function Register() {
    const [form, setForm] = useState({
        username:'',
        password:'',
        email:'',
    })

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try{
            await API.post('auth/register/',form);
            alert('registration completed successfully')
        }catch(err){
            console.log(err)
        }
    }

    return(
        <form onSubmit={handleSubmit}>
            <input placeholder="Username" onChange={(e)=> setForm({...form,username:e.target.value})}/>
            <input placeholder="email" onChange={(e)=> setForm({...form,email:e.target.value})}/>
            <input type="password" placeholder="password" onChange={(e)=> setForm({...form,password:e.target.value})}/>
            <button>Register</button>
        </form>
    )
}