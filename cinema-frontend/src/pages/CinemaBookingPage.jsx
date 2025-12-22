import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { format, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';

function CinemaBookingPage() {
    const { cinemaId } = useParams();
    const navigate = useNavigate();
    
    // State lưu dữ liệu
    const [cinema, setCinema] = useState(null);
    const [showtimes, setShowtimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Tạo mảng 14 ngày tới để chọn lịch
    const days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

    // 1. Lấy thông tin chi tiết Rạp (Tìm trong list rạp)
    useEffect(() => {
        axios.get("http://localhost:8080/api/cinemas")
            .then(res => {
                const found = res.data.find(c => c.id === Number(cinemaId));
                setCinema(found);
            })
            .catch(err => console.error("Lỗi lấy thông tin rạp:", err));
    }, [cinemaId]);

    // 2. Lấy danh sách suất chiếu theo Rạp & Ngày
    useEffect(() => {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        axios.get(`http://localhost:8080/api/showtimes/cinema?cinemaId=${cinemaId}&date=${formattedDate}`)
            .then(res => setShowtimes(res.data))
            .catch(err => console.error("Lỗi lấy suất chiếu:", err));
    }, [cinemaId, selectedDate]);

    // 3. Logic Gom nhóm: List Suất chiếu -> Group by Movie -> Group by Format (2D/3D)
    const groupShowtimesByMovie = () => {
        const movies = {};
        
        showtimes.forEach(show => {
            const movieId = show.movie.id;
            // Nếu phim chưa có trong list tạm, tạo mới
            if (!movies[movieId]) {
                movies[movieId] = {
                    info: show.movie,
                    formats: {} 
                };
            }
            
            const fmt = show.format; 
            if (!movies[movieId].formats[fmt]) {
                movies[movieId].formats[fmt] = [];
            }
            movies[movieId].formats[fmt].push(show);
        });

        // Trả về mảng các value (danh sách phim)
        return Object.values(movies); 
    };

    const groupedMovies = groupShowtimesByMovie();

    // Xử lý khi chọn giờ chiếu
    const handleSelectShowtime = (showtimeId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.info("Vui lòng đăng nhập để chọn ghế!");
            navigate("/login");
        } else {
            navigate(`/seat-selection/${showtimeId}`);
        }
    };

    if (!cinema) return <div style={{ paddingTop:'100px', textAlign:'center', color:'#666' }}>Đang tải thông tin rạp...</div>;

    return (
        <div className="booking-page">
            <Navbar />
            
            <div className="booking-container">
                {/* Header Thông tin Rạp */}
                <div className="booking-header">
                    <h1>{cinema.name}</h1>
                    <p>Địa chỉ: {cinema.city}</p>
                </div>

                {/* Thanh chọn ngày */}
                <div className="date-selector">
                    {days.map((date, index) => (
                        <button 
                            key={index} 
                            className={`date-btn ${format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') ? 'active' : ''}`}
                            onClick={() => setSelectedDate(date)}
                        >
                            <span className="day-name">{format(date, 'EEEE', { locale: vi })}</span>
                            <span className="day-number">{format(date, 'dd/MM')}</span>
                        </button>
                    ))}
                </div>

                {/* Danh sách Phim & Suất chiếu */}
                <div className="movie-showtime-list fade-in" style={{ marginTop: '30px' }}>
                    {groupedMovies.length > 0 ? (
                        groupedMovies.map((item) => (
                            <div key={item.info.id} className="cinema-movie-row-styled">
                                {/* Cột Trái: Poster */}
                                <div className="mv-poster-container-styled">
                                    <img src={item.info.posterUrl} alt={item.info.title} />
                                </div>

                                {/* Cột Phải: Thông tin & Giờ chiếu */}
                                <div className="mv-details-styled">
                                    <h3 className="mv-title-styled">
                                        {item.info.title} {}
                                    </h3>
                                    <p className="mv-meta-styled">Thời lượng: {item.info.duration} phút</p>

                                    <div className="formats-container">
                                        {Object.keys(item.formats).map(fmt => (
                                            <div key={fmt} className="format-row-styled">
                                                <div className="fmt-label-styled">{fmt}</div>
                                                <div className="time-list-styled">
                                                    {item.formats[fmt].map(show => (
                                                        <button 
                                                            key={show.id} 
                                                            className="time-btn-styled"
                                                            onClick={() => handleSelectShowtime(show.id)}
                                                            title={`Phòng: ${show.room.name}`}
                                                        >
                                                            {show.startTime.slice(0, 5)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-showtime">
                            Hiện chưa có lịch chiếu nào tại rạp này vào ngày {format(selectedDate, 'dd/MM/yyyy')}.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CinemaBookingPage;