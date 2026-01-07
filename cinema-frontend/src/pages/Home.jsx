import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import MovieSlider from '../components/MovieSlider';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt } from 'react-icons/fa';

function Home() {
    const [activeTab, setActiveTab] = useState('movie');
    const [cinemas, setCinemas] = useState([]);
    const [selectedCity, setSelectedCity] = useState("Hà Nội");
    const navigate = useNavigate();

    useEffect(() => {
        if (activeTab === 'cinema' && cinemas.length === 0) {
            axios.get("http://localhost:8080/api/cinemas")
                .then(res => setCinemas(res.data))
                .catch(err => console.error(err));
        }
    }, [activeTab, cinemas.length]);

    const filteredCinemas = cinemas.filter(c => c.city === selectedCity);

    return (
        <div className="home-page">
            <Navbar />
            <div className="hero-section">
                <h1>TRẢI NGHIỆM ĐIỆN ẢNH ĐỈNH CAO</h1>
            </div>

            <div className="booking-tool-container">
                <div className="booking-tabs">
                    <button className={`tab-btn ${activeTab === 'movie' ? 'active' : ''}`} onClick={() => setActiveTab('movie')}>Chọn PHIM</button>
                    <button className={`tab-btn ${activeTab === 'cinema' ? 'active' : ''}`} onClick={() => setActiveTab('cinema')}>Chọn RẠP</button>
                </div>
                
                <div className="tab-content" style={{ minHeight: '500px' }}>
                    {activeTab === 'movie' ? (
                        <div className="movie-selection fade-in">
                            <h2 className="section-title">DANH SÁCH PHIM</h2>
                            <MovieSlider />
                        </div>
                    ) : (
                        <div className="cinema-selection fade-in" style={{ padding: '20px 0' }}>
                             <h2 className="section-title" style={{ marginTop: '0', marginBottom: '20px' }}>
                                HỆ THỐNG RẠP
                            </h2>
                            
                            {/* Tabs Thành Phố */}
                            <div className="city-tabs-clean">
                                {["Hà Nội", "Hồ Chí Minh"].map(city => (
                                    <button 
                                        key={city}
                                        className={`city-btn-clean ${selectedCity === city ? 'active' : ''}`}
                                        onClick={() => setSelectedCity(city)}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>

                            {/* GRID RẠP DẠNG DỌC (3 CỘT) */}
                            <div className="cinema-grid-vertical">
                                {filteredCinemas.length > 0 ? (
                                    filteredCinemas.map((cinema) => (
                                        <div 
                                            key={cinema.id} 
                                            className="cinema-card-vertical"
                                            onClick={() => navigate(`/cinema-booking/${cinema.id}`)}
                                        >
                                            {/* Phần Ảnh Cao (Portrait style) */}
                                            <div className="card-img-container">
                                                <img src={cinema.imageUrl} alt={cinema.name} />
                                                <div className="card-overlay">
                                                    <span className="btn-view">ĐẶT VÉ NGAY</span>
                                                </div>
                                            </div>

                                            {/* Phần Thông Tin */}
                                            <div className="card-info-vertical">
                                                <h3 className="cinema-name-vertical">{cinema.name}</h3>
                                                <p className="cinema-addr-vertical">
                                                    <FaMapMarkerAlt style={{ marginRight:'6px', color:'#b90000', marginTop:'3px', flexShrink: 0 }}/> 
                                                    {cinema.address || cinema.city}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', color: '#999', padding: '20px' }}>
                                        Đang cập nhật danh sách rạp...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="promotion-section">
                <h2 className="section-title">ƯU ĐÃI</h2>
                <div className="promo-grid">
                    <div className="promo-card">
                        <div className="promo-tag">HOT DEAL</div>
                        <div className="promo-percent">10% OFF</div>
                        <h3 className="promo-title">HAPPY TUESDAY</h3>
                        <p className="promo-desc">Giảm giá tất cả vé vào Thứ 3 hàng tuần</p>
                    </div>
                    <div className="promo-card">
                        <div className="promo-tag">GROUP SALE</div>
                        <div className="promo-percent">10% OFF</div>
                        <h3 className="promo-title">MUA NHIỀU GIẢM SÂU</h3>
                        <p className="promo-desc">Giảm ngay khi đặt từ 5 vé trở lên</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;