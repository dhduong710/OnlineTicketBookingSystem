import { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { FaUser, FaLock } from 'react-icons/fa';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginUser(identifier, password);
            toast.success("Login successful!");
            navigate('/'); 
        } catch (error) {
            toast.error("Login failed: " + (error.message || "Incorrect information"));
        }
    };

    return (
        <div className="auth-container">
            <img src="/logo.png" alt="HUST Logo" className="hust-logo" />
            <h1 className="brand-title">HUST CINEMA</h1>
            <h2>Welcome Back</h2>
            
            <form onSubmit={handleLogin}>
      
                <div className="input-wrapper">
                    <FaUser className="input-icon" />
                    <input 
                        type="text" 
                        placeholder="Email or Phone number" 
                        value={identifier} 
                        onChange={(e) => setIdentifier(e.target.value)} 
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


                <button type="submit" className="btn-primary" style={{marginTop: '20px'}}>
                    LOGIN
                </button>
            </form>

            <div className="auth-link">
                Don't have an account? <Link to="/register">Create Account</Link>
            </div>
        </div>
    );
}

export default Login;