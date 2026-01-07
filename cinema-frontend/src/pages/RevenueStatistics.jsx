import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const RevenueStatistics = () => {
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCinema, setSelectedCinema] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');

  // Data states
  const [cities, setCities] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [movies, setMovies] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchFilterData();
    // Set default dates: last 30 days
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setEndDate(end.toISOString().split('T')[0]);
    setStartDate(start.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchStats();
    }
  }, [startDate, endDate]);

  const fetchFilterData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [citiesRes, moviesRes] = await Promise.all([
        fetch('http://localhost:8080/api/admin/cities', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:8080/api/admin/movies', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (citiesRes.ok) setCities(await citiesRes.json());
      if (moviesRes.ok) setMovies(await moviesRes.json());
    } catch (err) {
      console.error('Error fetching filter data:', err);
    }
  };

  const handleCityChange = async (city) => {
    setSelectedCity(city);
    setSelectedCinema('');
    
    if (city) {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8080/api/admin/cinemas?city=${city}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCinemas(await res.json());
      }
    } else {
      setCinemas([]);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    const requestData = {
      startDate,
      endDate,
      city: selectedCity || null,
      cinemaId: selectedCinema || null,
      movieId: selectedMovie || null
    };

    try {
      const response = await fetch('http://localhost:8080/api/admin/revenue/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Không thể tải thống kê');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    fetchStats();
  };

  const handleResetFilters = () => {
    setSelectedCity('');
    setSelectedCinema('');
    setSelectedMovie('');
    setCinemas([]);
    fetchStats();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="revenue-container">
      <h2 className="revenue-title">Thống kê Doanh thu</h2>

      {/* Filters */}
      <div className="revenue-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Từ ngày</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Đến ngày</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Tỉnh thành</label>
            <select value={selectedCity} onChange={(e) => handleCityChange(e.target.value)}>
              <option value="">Tất cả</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Rạp chiếu</label>
            <select 
              value={selectedCinema} 
              onChange={(e) => setSelectedCinema(e.target.value)}
              disabled={!selectedCity}
            >
              <option value="">Tất cả</option>
              {cinemas.map(cinema => (
                <option key={cinema.id} value={cinema.id}>{cinema.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Phim</label>
            <select value={selectedMovie} onChange={(e) => setSelectedMovie(e.target.value)}>
              <option value="">Tất cả</option>
              {movies.map(movie => (
                <option key={movie.id} value={movie.id}>{movie.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button onClick={handleApplyFilters} className="btn-apply" disabled={loading}>
            {loading ? 'Đang tải...' : 'Áp dụng'}
          </button>
          <button onClick={handleResetFilters} className="btn-reset">
            Đặt lại
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      {stats && (
        <>
          <div className="stats-overview">
            <div className="stat-card total">
              <div className="stat-info">
                <h3>Tổng Doanh thu</h3>
                <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>

            <div className="stat-card bookings">
              <div className="stat-info">
                <h3>Số Đơn đặt</h3>
                <p className="stat-value">{stats.totalBookings.toLocaleString()}</p>
              </div>
            </div>

            <div className="stat-card tickets">
              <div className="stat-info">
                <h3>Số Vé bán</h3>
                <p className="stat-value">{stats.totalTickets.toLocaleString()}</p>
              </div>
            </div>

            <div className="stat-card average">
              <div className="stat-info">
                <h3>Trung bình/Đơn</h3>
                <p className="stat-value">
                  {formatCurrency(stats.totalBookings > 0 ? stats.totalRevenue / stats.totalBookings : 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Revenue by City */}
          {stats.revenueByCity.length > 0 && (
            <div className="revenue-section">
              <h3 className="section-title">Doanh thu theo Tỉnh thành</h3>
              <div className="revenue-table">
                <table>
                  <thead>
                    <tr>
                      <th>Tỉnh thành</th>
                      <th>Doanh thu</th>
                      <th>Số đơn</th>
                      <th>Tỷ lệ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.revenueByCity.map((item, index) => (
                      <tr key={index}>
                        <td>{item.city}</td>
                        <td className="amount">{formatCurrency(item.revenue)}</td>
                        <td>{item.bookings}</td>
                        <td>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ width: `${(item.revenue / stats.totalRevenue * 100)}%` }}
                            ></div>
                            <span className="progress-text">
                              {((item.revenue / stats.totalRevenue * 100).toFixed(1))}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Revenue by Cinema */}
          {stats.revenueByCinema.length > 0 && (
            <div className="revenue-section">
              <h3 className="section-title">Doanh thu theo Rạp chiếu</h3>
              <div className="revenue-table">
                <table>
                  <thead>
                    <tr>
                      <th>Rạp chiếu</th>
                      <th>Tỉnh thành</th>
                      <th>Doanh thu</th>
                      <th>Số đơn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.revenueByCinema.slice(0, 10).map((item, index) => (
                      <tr key={index}>
                        <td>{item.cinemaName}</td>
                        <td>{item.city}</td>
                        <td className="amount">{formatCurrency(item.revenue)}</td>
                        <td>{item.bookings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Revenue by Movie */}
          {stats.revenueByMovie.length > 0 && (
            <div className="revenue-section">
              <h3 className="section-title">Doanh thu theo Phim</h3>
              <div className="revenue-table">
                <table>
                  <thead>
                    <tr>
                      <th>Phim</th>
                      <th>Doanh thu</th>
                      <th>Số vé</th>
                      <th>Giá TB/vé</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.revenueByMovie.slice(0, 10).map((item, index) => (
                      <tr key={index}>
                        <td>{item.movieTitle}</td>
                        <td className="amount">{formatCurrency(item.revenue)}</td>
                        <td>{item.tickets}</td>
                        <td className="amount">
                          {formatCurrency(item.tickets > 0 ? item.revenue / item.tickets : 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!stats && !loading && (
        <div className="no-data">
          <p>Chọn khoảng thời gian để xem thống kê</p>
        </div>
      )}
    </div>
  );
};

export default RevenueStatistics;
