import { useState } from "react";
import data from "../api/kerala.json";
import API from "../api/api";

export function Register() {

    const [form, setForm] = useState({
        username: '',
        password: '',
        email: '',
        phone:'',
        district: '',
        panchayath: '',
        ward: '',
        houseNo:'',
    });

    const [panchayaths, setPanchayaths] = useState([]);
    const [wards, setWards] = useState([]);

    // Handle District Change
    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        const foundDistrict = data.find(d => d.id == districtId);

        setForm({
            ...form,
            district: Number(districtId),
            panchayath: '',
            ward: ''
        });


        setPanchayaths(foundDistrict?.panchayaths || []);
        setWards([]);
    };

    // Handle Panchayath Change
    const handlePanchayathChange = (e) => {
        const panchayathId = e.target.value;
        const found = panchayaths.find(p => p.id == panchayathId);

        setForm({
            ...form,
            panchayath: Number(panchayathId),
            ward: ''
        });

        setWards(found?.wards || []);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        try {
            await API.post("auth/register/", form);
            alert("Registration successful");
        } catch (err) {
            console.log(err.response?.data);
        }
        console.log(form);
    };

    return (
        <form onSubmit={handleSubmit}>

            <input placeholder="Username"
                onChange={(e)=> setForm({...form,username:e.target.value})}
            />

            <input placeholder="Email"
                onChange={(e)=> setForm({...form,email:e.target.value})}
            />

            <input placeholder="phoneno"
                onChange={(e)=> setForm({...form,phone:e.target.value})}
            />

            <input type="password" placeholder="Password"
                onChange={(e)=> setForm({...form,password:e.target.value})}
            />

            {/* District */}
            <select onChange={handleDistrictChange}>
                <option value="">Select District</option>
                {data.map((d) => (
                    <option key={d.id} value={d.id}>
                        {d.district}
                    </option>
                ))}
            </select>

            {/* Panchayath */}
            <select onChange={handlePanchayathChange} disabled={!form.district}>
                <option value="">Select Panchayath</option>
                {panchayaths.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.name}
                    </option>
                ))}
            </select>

            {/* Ward */}
            <select onChange={(e)=> setForm({...form, ward:Number(e.target.value)})} disabled={!form.panchayath}>
                <option value="">Select Ward</option>
                {wards.map((w) => (
                    <option key={w.id} value={w.id}>
                        Ward {w.number}
                    </option>
                ))}
            </select>

            <input type="" placeholder="houseNo" disabled={!form.ward}
                onChange={(e)=> setForm({...form,houseNo:e.target.value})}
            />

            <button>Register</button>
        </form>
    );
}