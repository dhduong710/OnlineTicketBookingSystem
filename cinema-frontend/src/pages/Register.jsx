import { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser(email, phone, password);
            alert("Register successful! Please login.");
            navigate('/login');
        } catch (error) {
            alert("Registration failed: " + (error.message || "Unknown error"));
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>Register Account</h2>
            <form onSubmit={handleRegister}>
                <div><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '10px', margin: '10px' }}/></div>
                <div><input type="text" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ padding: '10px', margin: '10px' }}/></div>
                <div><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px', margin: '10px' }}/></div>
                <button type="submit" style={{ padding: '10px 20px' }}>Register</button>
            </form>
        </div>
    );
}

export default Register;