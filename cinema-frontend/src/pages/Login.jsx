import { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaUser, FaLock } from 'react-icons/fa';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

function Login() {
    const [identifier, setIdentifier] = useState(''); // Email
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // identifier có thể là email hoặc số điện thoại
            const data = await loginUser(identifier, password);
            
            // Lưu thông tin user để Navbar hiển thị
            const userStore = { username: identifier };
            localStorage.setItem("user", JSON.stringify(userStore));

            toast.success("Đăng nhập thành công!");
            navigate('/'); 
        } catch (error) {
            toast.error("Lỗi: " + (error.message || "Sai thông tin đăng nhập"));
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
                    <h2>Chào mừng bạn quay trở lại!</h2>
                    
                    <form onSubmit={handleLogin}>
                        <div className="input-wrapper">
                            <FaUser className="input-icon" />
                            <input type="text" placeholder="Email hoặc số điện thoại" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
                        </div>
                        <div className="input-wrapper">
                            <FaLock className="input-icon" />
                            <input type={showPassword ? "text" : "password"} placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            <div className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
                            </div>
                        </div>
                        <button type="submit" className="btn-primary">ĐĂNG NHẬP</button>
                    </form>

                    <div className="auth-link">
                        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                    </div>
                </div>
            </div>

            {/* PHẢI: BANNER */}
            <div className="split-right">
                <div className="promo-slider-wrapper">
                    <Slider {...sliderSettings}>
                        {/* Nội dung Slider giữ nguyên */}
                         <div className="p-4"><div className="promo-card-login"><span className="promo-tag">HOT DEAL</span><div className="promo-percent">10% OFF</div><h3 className="promo-title">HAPPY TUESDAY</h3><p className="promo-desc">Giảm giá tất cả vé vào Thứ 3 hàng tuần</p></div></div>
                         <div className="p-4"><div className="promo-card-login"><span className="promo-tag">GROUP SALE</span><div className="promo-percent">10% OFF</div><h3 className="promo-title">MUA NHIỀU GIẢM SÂU</h3><p className="promo-desc">Ưu đãi khi đặt từ 5 vé trở lên</p></div></div>
                    </Slider>
                </div>
            </div>
        </div>
    );
}
export default Login;