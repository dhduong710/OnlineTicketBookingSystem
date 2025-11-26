import { useEffect, useState } from 'react';
import Slider from "react-slick";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function MovieSlider() {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8080/api/movies")
            .then(res => setMovies(res.data))
            .catch(err => console.error("Lỗi tải phim:", err));
    }, []);

    // Xử lý khi bấm mua vé ---
    const handleBuyTicket = (movieId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            // Chưa đăng nhập -> Thông báo và đẩy sang trang Login
            toast.info("Vui lòng đăng nhập để đặt vé!");
            navigate("/login");
        } else {
            // Đã đăng nhập -> Sau này sẽ chuyển sang trang chọn ghế
            // Tạm thời thông báo OK
            toast.success(`Đang mở trang đặt vé!`);
            // navigate(`/booking/${movieId}`); // (Dành cho bước sau)
        }
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 600, settings: { slidesToShow: 2 } }
        ]
    };

    return (
        <div className="movie-slider-container">
            <Slider {...settings}>
                {movies.map((movie) => (
                    <div key={movie.id} className="movie-card">
                        <div className="movie-img-wrapper">
                            <img src={movie.posterUrl} alt={movie.title} />
                            <div className="overlay">
                                {/* Gắn hàm xử lý vào nút Mua Vé */}
                                <button 
                                    className="btn-buy-ticket"
                                    onClick={() => handleBuyTicket(movie.id)}
                                >
                                    MUA VÉ
                                </button>
                            </div>
                        </div>
                        <h3 className="movie-title">{movie.title}</h3>
                        <p className="movie-info">{movie.duration} phút</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default MovieSlider;