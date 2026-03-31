import { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export function Login(){
    const [form,setForm] = useState({
        username : '',
        password : '',
    })

    const navigate = useNavigate()

    const handleLogin = async(e)=>{
        e.preventDefault();
        try{
            const res = await API.post('token/',form);
            localStorage.setItem('access_token',res.data.access);

            const useRes = await API.get('auth/me')
            localStorage.setItem('role',useRes.data.role)

            alert('login success')
        }catch(err){
            console.log(err)
        }
    }

    if (userRes.data.role === 'admin'){
        navigate('/admin');
    }else if(userRes.data.role === 'collector'){
        navigate('/collector')
    }else{
        navigate('/')
    }

    return(
        <form onSubmit={handleLogin}>
            <input type="text" placeholder="username" onChange={(e)=>setForm({...form,username:e.target.value})}/>
            <input type="password" placeholder="password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
            <button>Login</button>
        </form>
    )
}