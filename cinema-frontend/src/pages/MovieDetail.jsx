import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { FaPlay, FaTicketAlt, FaClock, FaCalendarAlt } from 'react-icons/fa';

function MovieDetail() {
    const { id } = useParams(); // Lấy ID phim từ URL
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [activeTab, setActiveTab] = useState('summary'); // 'summary' hoặc 'trailer'

    useEffect(() => {
        // Gọi API lấy chi tiết phim
        axios.get(`http://localhost:8080/api/movies/${id}`)
            .then(res => setMovie(res.data))
            .catch(err => toast.error("Không tìm thấy phim!"));
    }, [id]);

    const handleBuyTicket = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.info("Vui lòng đăng nhập để mua vé!");
            navigate("/login");
        } else {
            // Logic chuyển sang trang chọn suất chiếu (Làm ở bước sau)
            toast.success("Chuyển đến trang chọn suất chiếu...");
        }
    };

    // Hàm chuyển đổi link Youtube thường thành link Embed để chạy được trên web
    const getYoutubeEmbedUrl = (url) => {
        if (!url) return "";
        const videoId = url.split('v=')[1] || url.split('/').pop();
        const cleanId = videoId?.split('&')[0]; // Xử lý nếu link có tham số phụ
        return `https://www.youtube.com/embed/${cleanId}`;
    };

    if (!movie) return <div style={{textAlign:'center', marginTop: '100px'}}>Đang tải...</div>;

    return (
        <div className="movie-detail-page">
            <Navbar />
            
            <div className="movie-detail-container">
                {/* --- PHẦN 1: THÔNG TIN CƠ BẢN --- */}
                <div className="movie-header">
                    <div className="movie-poster-wrapper">
                        <img src={movie.posterUrl} alt={movie.title} className="detail-poster" />
                    </div>
                    
                    <div className="movie-info-box">
                        <h1 className="detail-title">{movie.title}</h1>
                        
                        <div className="detail-meta">
                            <div className="meta-item"><FaClock className="icon"/> {movie.duration} phút</div>
                            <div className="meta-item"><FaCalendarAlt className="icon"/> Đang chiếu</div>
                        </div>

                        {/* Vì database chưa có bảng Genre/Director nên tạm ẩn */}
                        <div className="detail-description">
                            <p><strong>Đạo diễn:</strong> (Đang cập nhật)</p>
                            <p><strong>Diễn viên:</strong> (Đang cập nhật)</p>
                            <p><strong>Thể loại:</strong> (Đang cập nhật)</p>
                        </div>

                        <div className="detail-actions">
                            
                            <button className="btn-buy-now" onClick={handleBuyTicket}>
                                <FaTicketAlt style={{marginRight: '8px'}}/> MUA VÉ
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- PHẦN 2: TABS CHI TIẾT / TRAILER --- */}
                <div className="movie-content-tabs">
                    <div className="tabs-header">
                        <button 
                            className={`tab-item ${activeTab === 'summary' ? 'active' : ''}`}
                            onClick={() => setActiveTab('summary')}
                        >
                            CHI TIẾT
                        </button>
                        <button 
                            className={`tab-item ${activeTab === 'trailer' ? 'active' : ''}`}
                            onClick={() => setActiveTab('trailer')}
                        >
                            TRAILER
                        </button>
                    </div>

                    <div className="tab-body">
                        {activeTab === 'summary' ? (
                            <div className="tab-summary">
                                <p>{movie.summary}</p>
                            </div>
                        ) : (
                            <div className="tab-trailer">
                                {movie.trailerUrl ? (
                                    <iframe 
                                        width="100%" 
                                        height="500" 
                                        src={getYoutubeEmbedUrl(movie.trailerUrl)} 
                                        title="Trailer" 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <p>Chưa có trailer cho phim này.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetail;