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

            const userRes = await API.get('auth/me')
            const role = userRes.data.role;

            localStorage.setItem('role',role)

            alert('login success')

            if (role === 'admin'){
                navigate('/admin');
                return;
            }else if(role === 'collector'){
                navigate('/collector')
                return;
            }else if(role === 'citizen'){
                navigate('/')
                return;
            }
            else{
                navigate('/')
                return;
            }
        }catch(err){
            console.log(err)
        }
    }

    

    return(
        <form onSubmit={handleLogin}>
            <input type="text" placeholder="username" onChange={(e)=>setForm({...form,username:e.target.value})}/>
            <input type="password" placeholder="password" onChange={(e)=>setForm({...form,password:e.target.value})}/>
            <button>Login</button>
        </form>
    )
}