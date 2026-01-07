import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieManagement from './MovieManagement';
import RevenueStatistics from './RevenueStatistics';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('movies'); // 'movies', 'revenue', 'customers'

  useEffect(() => {
    // Kiểm tra xem user có phải admin không
    const isAdmin = localStorage.getItem('isAdmin');
    const token = localStorage.getItem('token');
    
    if (!isAdmin || !token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <img src="/logo.png" alt="Logo" style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '15px' }} />
            <h1 className="admin-header-title">Hệ thống quản trị</h1>
          </div>
          <button onClick={handleLogout} className="admin-btn-logout">
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Main Content - Sidebar + Content */}
      <div className="admin-layout">
        {/* Sidebar with Cards */}
        <aside className="admin-sidebar">
          {/* Card 1: Quản lý Phim */}
          <div 
            className={`admin-feature-card ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveTab('movies')}
          >
            <div className="admin-card-icon blue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="admin-card-title">Quản lý Phim</h3>
            <p className="admin-card-description">
              Đăng tải phim mới và lên lịch chiếu hàng loạt
            </p>
          </div>

          {/* Card 2: Thống kê Doanh thu */}
          <div 
            className={`admin-feature-card ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            <div className="admin-card-icon green">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="admin-card-title">Thống kê Doanh thu</h3>
            <p className="admin-card-description">
              Xem báo cáo doanh thu tổng quan và chi tiết
            </p>
          </div>

          {/* Card 3: Quản lý Khách hàng */}
          <div 
            className={`admin-feature-card ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <div className="admin-card-icon purple">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="admin-card-title">Quản lý Khách hàng</h3>
            <p className="admin-card-description">
              Kiểm tra chi tiêu và top khách hàng
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="admin-content">
          {activeTab === 'movies' && <MovieManagement />}
          {activeTab === 'revenue' && <RevenueStatistics />}
          {activeTab === 'customers' && (
            <div className="placeholder-content">
              <h2>👥 Quản lý Khách hàng</h2>
              <p>Chức năng đang phát triển...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
