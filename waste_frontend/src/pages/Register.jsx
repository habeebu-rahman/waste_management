import { useState } from "react";
import data from "../api/kerala.json";

export function Register() {

    const [form, setForm] = useState({
        username: '',
        password: '',
        email: '',
        district: '',
        panchayath: '',
        ward: '',
        houseNo:'',
    });

    const [panchayaths, setPanchayaths] = useState([]);
    const [wards, setWards] = useState([]);

    // Handle District Change
    const handleDistrictChange = (e) => {
        const selectedDistrict = e.target.value;

        setForm({
            ...form,
            district: selectedDistrict,
            panchayath: '',
            ward: ''
        });

        const foundDistrict = data.find(d => d.district === selectedDistrict);

        setPanchayaths(foundDistrict ? foundDistrict.panchayaths : []);
        setWards([]);
    };

    // Handle Panchayath Change
    const handlePanchayathChange = (e) => {
        const selectedPanchayath = e.target.value;

        setForm({
            ...form,
            panchayath: selectedPanchayath,
            ward: ''
        });

        const found = panchayaths.find(p => p.name === selectedPanchayath);

        setWards(found ? found.wards : []);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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

            <input type="password" placeholder="Password"
                onChange={(e)=> setForm({...form,password:e.target.value})}
            />

            {/* District */}
            <select onChange={handleDistrictChange}>
                <option value="">Select District</option>
                {data.map((d, index) => (
                    <option key={index} value={d.district}>
                        {d.district}
                    </option>
                ))}
            </select>

            {/* Panchayath */}
            <select onChange={handlePanchayathChange} disabled={!form.district}>
                <option value="">Select Panchayath</option>
                {panchayaths.map((p, index) => (
                    <option key={index} value={p.name}>
                        {p.name}
                    </option>
                ))}
            </select>

            {/* Ward */}
            <select onChange={(e)=> setForm({...form, ward:e.target.value})} disabled={!form.panchayath}>
                <option value="">Select Ward</option>
                {wards.map((w, index) => (
                    <option key={index} value={w}>
                        Ward {w}
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