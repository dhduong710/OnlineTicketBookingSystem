import { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { FaEnvelope, FaPhone, FaLock } from 'react-icons/fa';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

function Register() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser(email, phone, password);
            toast.success("Register successful! Please login.");
            navigate('/login');
        } catch (error) {
            toast.error("Registration failed: " + (error.message || "Unknown error"));
        }
    };

    return (
        <div className="auth-container">
            <img src="/logo.png" alt="HUST Logo" className="hust-logo" />
            <h1 className="brand-title">HUST CINEMA</h1>
            <h2>Create Account</h2>
            
            <form onSubmit={handleRegister}>
                <div className="input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input 
                        type="email" 
                        placeholder="Your Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>

                <div className="input-wrapper">
                    <FaPhone className="input-icon" />
                    <input 
                        type="text" 
                        placeholder="Phone Number" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                    />
                </div>

                <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <div 
                        className="toggle-password" 
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                    </div>
                </div>

                <button type="submit" className="btn-primary">REGISTER</button>
            </form>

            <div className="auth-link">
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </div>
    );
}

export default Register;