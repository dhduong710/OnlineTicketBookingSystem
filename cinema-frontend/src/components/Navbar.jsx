import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
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
                    {token ? (
                        <div className="auth-logged">
                            <FaUserCircle className="icon" />
                            <span>Chào bạn!</span>
                            <button onClick={handleLogout} className="btn-logout"><FaSignOutAlt /></button>
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