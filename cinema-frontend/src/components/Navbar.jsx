import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

function Navbar() {
    const navigate = useNavigate();
    
    // 1. Lấy token
    const token = localStorage.getItem("token");
    
    // 2. Lấy thông tin user (lưu trong localStorage)
    // Lưu ý: Cần dùng JSON.parse vì trong localStorage dữ liệu là chuỗi
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    const handleLogout = () => {
        // Xóa hết token và user khi đăng xuất
        localStorage.removeItem("token");
        localStorage.removeItem("user"); 
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    <img src="/logo.png" alt="Logo" />
                    <span>HUST CINEMA</span>
                </Link>

                <div className="nav-menu"></div> 

                <div className="nav-auth">
                    {/* Kiểm tra nếu có token thì coi như đã đăng nhập */}
                    {token ? (
                        <div className="auth-logged">
                            {/* Bấm vào tên user hoặc icon để sang trang Vé của tôi */}
                            <Link to="/my-tickets" style={{textDecoration:'none', color: 'inherit', display:'flex', alignItems:'center', gap:'5px', cursor:'pointer'}}>
                                <FaUserCircle size={24} /> 
                                {/* Dùng optional chaining (?.) để tránh lỗi nếu user null */}
                                <span>{user?.fullName || user?.username || "Xin chào"}</span>
                            </Link>
                            
                            {/* Nút đăng xuất */}
                            <button onClick={handleLogout} className="btn-logout" title="Đăng xuất">
                                <FaSignOutAlt />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-login">Đăng nhập</Link>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;