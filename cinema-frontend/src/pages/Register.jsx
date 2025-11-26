import { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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
            toast.success("Đăng ký thành công! Hãy đăng nhập.");
            navigate('/login');
        } catch (error) {
            toast.error("Lỗi: " + (error.message || "Không thể đăng ký"));
        }
    };

    const sliderSettings = { dots: true, infinite: true, speed: 800, slidesToShow: 1, slidesToScroll: 1, autoplay: true, autoplaySpeed: 4000, arrows: false };

    return (
        <div className="split-screen-container">
            {/* TRÁI: FORM */}
            <div className="split-left">
                <div className="login-card">
                    <img src="/logo.png" alt="HUST Logo" className="hust-logo" />
                    <h1 className="brand-title">HUST CINEMA</h1>
                    <h2>Tạo tài khoản mới</h2>
                    
                    <form onSubmit={handleRegister}>
                        <div className="input-wrapper">
                            <FaEnvelope className="input-icon" />
                            <input type="email" placeholder="Email của bạn" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div className="input-wrapper">
                            <FaPhone className="input-icon" />
                            <input type="text" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                        </div>

                        <div className="input-wrapper">
                            <FaLock className="input-icon" />
                            <input type={showPassword ? "text" : "password"} placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <div className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary">ĐĂNG KÝ NGAY</button>
                    </form>

                    <div className="auth-link">
                        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                    </div>
                </div>
            </div>

            {/* PHẢI: BANNER */}
            <div className="split-right">
                <div className="promo-slider-wrapper">
                    <Slider {...sliderSettings}>
                        <div className="p-4">
                            <div className="promo-card-login">
                                <span className="promo-tag">WELCOME</span>
                                <div className="promo-percent">MEMBER</div>
                                <h3 className="promo-title">THÀNH VIÊN MỚI</h3>
                                <p className="promo-desc">Đăng ký ngay để tích điểm đổi quà</p>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="promo-card-login">
                                <span className="promo-tag">STUDENT</span>
                                <div className="promo-percent">FREE</div>
                                <h3 className="promo-title">BẮP NGỌT</h3>
                                <p className="promo-desc">Tặng 1 bắp cho thẻ sinh viên HUST</p>
                            </div>
                        </div>
                    </Slider>
                </div>
            </div>
        </div>
    );
}

export default Register;