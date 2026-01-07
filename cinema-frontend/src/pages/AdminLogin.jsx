import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }

      const data = await response.json();
      
      // Lưu token và đánh dấu là admin
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAdmin', 'true');
      
      // Chuyển đến trang admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-header">
          <img src="/logo.png" alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '20px' }} />
          <h1 className="admin-login-title">Hust Cinema</h1>
          <p className="admin-login-subtitle">Hệ thống quản trị rạp chiếu phim</p>
        </div>

        {error && (
          <div className="admin-error-message">
            <span className="admin-error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-input-group">
            <label>Tên đăng nhập</label>
            <div className="admin-input-wrapper">
              <FaUser className="admin-input-icon" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập username"
                required
              />
            </div>
          </div>

          <div className="admin-input-group">
            <label>Mật khẩu</label>
            <div className="admin-input-wrapper">
              <FaLock className="admin-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập password"
                required
              />
              <div 
                className="toggle-password" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <MdVisibility /> : <MdVisibilityOff />}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-btn-login"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
