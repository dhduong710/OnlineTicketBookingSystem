import { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginUser(email, password);
            alert("Đăng nhập thành công!");
            navigate('/'); // Chuyển về trang chủ
        } catch (error) {
            alert("Đăng nhập thất bại: " + (error.message || "Sai thông tin"));
        }
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>Đăng Nhập Hệ Thống Vé</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        style={{ padding: '10px', margin: '10px' }}
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="Mật khẩu" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        style={{ padding: '10px', margin: '10px' }}
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px' }}>Đăng nhập</button>
            </form>
        </div>
    );
}

export default Login;