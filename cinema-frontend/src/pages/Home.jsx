import { useState } from 'react';
import Navbar from '../components/Navbar';
import MovieSlider from '../components/MovieSlider';

function Home() {
    const [activeTab, setActiveTab] = useState('movie');

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
                <div className="tab-content">
                    {activeTab === 'movie' ? (
                        <div className="movie-selection">
                            <h2 className="section-title">PHIM ĐANG CHIẾU</h2>
                            <MovieSlider />
                        </div>
                    ) : (
                        <div className="cinema-selection">
                            <h2 className="section-title">CHỌN RẠP CỦA BẠN</h2>
                            <p style={{textAlign: 'center', color: '#666', padding: '20px'}}>
                                Hệ thống đang cập nhật danh sách rạp...
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* PHẦN ƯU ĐÃI (THIẾT KẾ MỚI) */}
            <div className="promotion-section">
                <h2 className="section-title">ƯU ĐÃI</h2>
                
                <div className="promo-grid">
                    {/* Coupon 1 */}
                    <div className="promo-card">
                        <div className="promo-tag">HOT DEAL</div>
                        <div className="promo-percent">10% OFF</div>
                        <h3 className="promo-title">HAPPY TUESDAY</h3>
                        <p className="promo-desc">Giảm giá tất cả vé vào Thứ 3 hàng tuần</p>
                    </div>

                    {/* Coupon 2 */}
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