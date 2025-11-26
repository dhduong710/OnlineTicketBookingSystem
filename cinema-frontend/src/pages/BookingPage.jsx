import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { format, addDays } from 'date-fns';
import { vi } from 'date-fns/locale';

function BookingPage() {
    const { movieId } = useParams();
    const navigate = useNavigate();
    
    // State dữ liệu
    const [movie, setMovie] = useState(null);
    const [showtimes, setShowtimes] = useState([]); // Tất cả suất chiếu trong ngày

    // State lựa chọn
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedCity, setSelectedCity] = useState(null);   // Bước 2: Chọn Tỉnh
    const [selectedFormat, setSelectedFormat] = useState(null); // Bước 3: Chọn Định dạng

    const days = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i));

    // 1. Lấy thông tin phim
    useEffect(() => {
        axios.get(`http://localhost:8080/api/movies/${movieId}`)
            .then(res => setMovie(res.data))
            .catch(err => console.error(err));
    }, [movieId]);

    // 2. Lấy suất chiếu khi đổi ngày -> Reset lựa chọn Tỉnh/Định dạng
    useEffect(() => {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        axios.get(`http://localhost:8080/api/showtimes?movieId=${movieId}&date=${formattedDate}`)
            .then(res => {
                setShowtimes(res.data);
                setSelectedCity(null); // Reset tỉnh khi chọn ngày mới
                setSelectedFormat(null); // Reset định dạng
            })
            .catch(err => console.error(err));
    }, [movieId, selectedDate]);

    // --- LOGIC LỌC DỮ LIỆU ---

    // A. Lấy danh sách Tỉnh thành duy nhất từ showtimes
    // showtime.room.cinema.city
    const uniqueCities = [...new Set(showtimes.map(item => item.room.cinema.city))];

    // B. Lọc suất chiếu theo Tỉnh đã chọn
    const showtimesInCity = showtimes.filter(s => 
        selectedCity ? s.room.cinema.city === selectedCity : true
    );

    // C. Lấy danh sách Định dạng duy nhất (2D, 3D...) có trong Tỉnh đó
    const uniqueFormats = [...new Set(showtimesInCity.map(item => item.format))];

    // D. Lọc cuối cùng: Theo Tỉnh VÀ Theo Định dạng
    const finalShowtimes = showtimesInCity.filter(s => 
        selectedFormat ? s.format === selectedFormat : true
    );

    // E. Gom nhóm theo Rạp để hiển thị 
    const groupShowtimesByCinema = () => {
        const groups = {};
        finalShowtimes.forEach(show => {
            const cinemaName = show.room.cinema.name;
            if (!groups[cinemaName]) {
                groups[cinemaName] = [];
            }
            groups[cinemaName].push(show);
        });
        return groups;
    };

    const groupedShowtimes = groupShowtimesByCinema();

    const handleSelectShowtime = (showtimeId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.info("Vui lòng đăng nhập để chọn ghế!");
            navigate("/login");
        } else {
            // Chuyển sang trang chọn ghế
            navigate(`/seat-selection/${showtimeId}`);
        }
    };

    if (!movie) return <div className="loading">Đang tải...</div>;

    return (
        <div className="booking-page">
            <Navbar />
            
            <div className="booking-container">
                <div className="booking-header">
                    <h1>{movie.title}</h1>
                    <p>{movie.duration} phút</p>
                </div>

                {/* BƯỚC 1: CHỌN NGÀY */}
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

                {/* BƯỚC 2 & 3: BỘ LỌC TỈNH THÀNH & ĐỊNH DẠNG */}
                {showtimes.length > 0 ? (
                    <div className="filter-bar">
                        {/* Chọn Tỉnh */}
                        <div className="filter-group">
                            <label>Chọn vị trí:</label>
                            <div className="filter-options">
                                {uniqueCities.map(city => (
                                    <button 
                                        key={city}
                                        className={`filter-btn ${selectedCity === city ? 'active' : ''}`}
                                        onClick={() => {
                                            setSelectedCity(city);
                                            setSelectedFormat(null); // Chọn tỉnh khác thì reset định dạng
                                        }}
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chọn Định Dạng (Chỉ hiện khi đã chọn Tỉnh) */}
                        {selectedCity && (
                            <div className="filter-group fade-in">
                                <label>Chọn định dạng:</label>
                                <div className="filter-options">
                                    {uniqueFormats.map(frmt => (
                                        <button 
                                            key={frmt}
                                            className={`filter-btn ${selectedFormat === frmt ? 'active' : ''}`}
                                            onClick={() => setSelectedFormat(frmt)}
                                        >
                                            {frmt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="no-showtime">Không có suất chiếu nào vào ngày này.</div>
                )}

                {/* KẾT QUẢ: DANH SÁCH RẠP & GIỜ CHIẾU */}
                {selectedCity && selectedFormat ? (
                    <div className="showtime-list fade-in">
                        {Object.keys(groupedShowtimes).length > 0 ? (
                            Object.keys(groupedShowtimes).map((cinemaName) => (
                                <div key={cinemaName} className="cinema-block">
                                    <h3 className="cinema-name">{cinemaName}</h3>
                                    <div className="time-grid">
                                        {groupedShowtimes[cinemaName].map(show => (
                                            <button 
                                                key={show.id} 
                                                className="time-btn"
                                                onClick={() => handleSelectShowtime(show.id)}
                                            >
                                                <span className="time">{show.startTime.slice(0, 5)}</span>
                                                <span className="room-label">{show.room.name}</span> {/* Hiện thêm tên phòng cho rõ */}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-showtime">Không tìm thấy suất chiếu phù hợp.</div>
                        )}
                    </div>
                ) : (
                    showtimes.length > 0 && (
                        <div className="instruction-text">
                            Vui lòng chọn <b>Tỉnh thành</b> và <b>Định dạng</b> để xem giờ chiếu.
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default BookingPage;