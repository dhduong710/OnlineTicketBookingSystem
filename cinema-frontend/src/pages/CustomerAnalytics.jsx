import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CustomerAnalytics = () => {
  const [activeView, setActiveView] = useState('search'); // 'search' or 'top'
  
  // Search states
  const [searchEmail, setSearchEmail] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [customerData, setCustomerData] = useState(null);

  // Top customers states
  const [topCustomers, setTopCustomers] = useState([]);
  const [topLoading, setTopLoading] = useState(false);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    if (activeView === 'top') {
      fetchTopCustomers();
    }
  }, [activeView]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchEmail.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }

    setSearchLoading(true);
    setCustomerData(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/customers/spending?email=${encodeURIComponent(searchEmail)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 404) {
        toast.error('Không tìm thấy khách hàng với email này');
        return;
      }

      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu');
      }

      const data = await response.json();
      setCustomerData(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchTopCustomers = async () => {
    setTopLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/admin/customers/top?limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải dữ liệu');
      }

      const data = await response.json();
      setTopCustomers(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTopLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="customer-analytics-container">
      <h2 className="customer-title">Quản lý Khách hàng</h2>

      {/* Tabs */}
      <div className="customer-tabs">
        <button 
          className={`customer-tab ${activeView === 'search' ? 'active' : ''}`}
          onClick={() => setActiveView('search')}
        >
          Tra cứu Chi tiêu
        </button>
        <button 
          className={`customer-tab ${activeView === 'top' ? 'active' : ''}`}
          onClick={() => setActiveView('top')}
        >
          Top Khách hàng
        </button>
      </div>

      {/* Search View */}
      {activeView === 'search' && (
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="email"
                placeholder="Nhập email khách hàng..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="search-input"
              />
              <button type="submit" disabled={searchLoading} className="btn-search">
                {searchLoading ? 'Đang tìm...' : 'Tra cứu'}
              </button>
            </div>
          </form>

          {customerData && (
            <div className="customer-card">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <p style={{ fontSize: '18px', fontWeight: '600', color: '#333' }}>{customerData.email}</p>
              </div>
              
              <div className="customer-stats-grid">
                <div className="customer-stat-item">
                  <div className="stat-label">Tổng chi tiêu</div>
                  <div className="stat-value-large">{formatCurrency(customerData.totalSpending)}</div>
                </div>

                <div className="customer-stat-item">
                  <div className="stat-label">Số đơn đặt</div>
                  <div className="stat-value-medium">{customerData.totalBookings}</div>
                </div>

                <div className="customer-stat-item">
                  <div className="stat-label">Số vé đã mua</div>
                  <div className="stat-value-medium">{customerData.totalTickets}</div>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <div className="stat-label">Trung bình/Đơn</div>
                <div className="stat-value-medium">
                  {formatCurrency(customerData.totalBookings > 0 ? customerData.totalSpending / customerData.totalBookings : 0)}
                </div>
              </div>
            </div>
          )}

          {!customerData && !searchLoading && (
            <div className="empty-search">
              <p>Nhập email để tra cứu thông tin chi tiêu</p>
            </div>
          )}
        </div>
      )}

      {/* Top Customers View */}
      {activeView === 'top' && (
        <div className="top-section">
          <div className="top-controls">
            <label>Hiển thị:</label>
            <select 
              value={limit} 
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setTimeout(() => fetchTopCustomers(), 100);
              }}
              className="limit-select"
            >
              <option value="10">Top 10</option>
              <option value="20">Top 20</option>
              <option value="50">Top 50</option>
            </select>
          </div>

          {topLoading ? (
            <div className="loading-state">Đang tải...</div>
          ) : (
            <div className="top-table">
              <table>
                <thead>
                  <tr>
                    <th>Hạng</th>
                    <th>Email</th>
                    <th>Tổng chi tiêu</th>
                    <th>Số đơn</th>
                    <th>Số vé</th>
                  </tr>
                </thead>
                <tbody>
                  {topCustomers.map((customer, index) => (
                    <tr key={customer.email} className={index < 3 ? 'medal-row' : ''}>
                      <td className="rank-cell">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index >= 3 && (index + 1)}
                      </td>
                      <td className="email-cell">{customer.email}</td>
                      <td className="amount-cell">{formatCurrency(customer.totalSpending)}</td>
                      <td>{customer.totalBookings}</td>
                      <td>{customer.totalTickets}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!topLoading && topCustomers.length === 0 && (
            <div className="empty-state">
              <p>Chưa có dữ liệu khách hàng</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerAnalytics;
