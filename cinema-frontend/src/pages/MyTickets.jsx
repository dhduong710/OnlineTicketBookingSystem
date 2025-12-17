import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function MyTickets() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios.get("http://localhost:8080/api/bookings/my-bookings", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            setBookings(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) return <div style={{paddingTop: '100px', textAlign: 'center'}}>Đang tải vé của bạn...</div>;

    return (
        <div className="my-tickets-page">
            <Navbar />
            <div className="tickets-container">
                <h1 className="page-title">VÉ CỦA TÔI</h1>
                
                {bookings.length === 0 ? (
                    <div className="empty-state">
                        <p>Bạn chưa có lịch sử đặt vé nào.</p>
                        <Link to="/" className="btn-go-home">Đặt vé ngay</Link>
                    </div>
                ) : (
                    <div className="ticket-list">
                        {bookings.map(booking => (
                            <div key={booking.id} className="ticket-card">
                                {/* Cột Trái: Poster */}
                                <div className="ticket-poster">
                                    <img src={booking.showtime.movie.posterUrl} alt="Poster" />
                                </div>

                                {/* Cột Giữa: Thông tin chi tiết */}
                                <div className="ticket-info">
                                    <h3 className="movie-name">{booking.showtime.movie.title}</h3>
                                    
                                    <div className="info-row">
                                        <span className="label">Rạp:</span>
                                        <span className="value">{booking.showtime.room.cinema.name}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Phòng:</span>
                                        <span className="value">{booking.showtime.room.name}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Suất chiếu:</span>
                                        <span className="value highlight">
                                            {booking.showtime.startTime.slice(0,5)} - {booking.showtime.showDate}
                                        </span>
                                    </div>
                                    
                                    <div className="divider-dashed"></div>

                                    <div className="info-row">
                                        <span className="label">Ghế:</span>
                                        <span className="value seat-list">
                                            {booking.tickets.map(t => t.seat.name).join(", ")}
                                        </span>
                                    </div>

                                    {/* Hiển thị Combo nếu có */}
                                    {booking.inclusions && booking.inclusions.length > 0 && (
                                        <div className="info-row">
                                            <span className="label">Combo:</span>
                                            <span className="value">
                                                {booking.inclusions.map(inc => `${inc.quantity} x ${inc.product.name}`).join(", ")}
                                            </span>
                                        </div>
                                    )}

                                    <div className="total-check">
                                        Tổng tiền: {booking.totalAmount.toLocaleString()} đ
                                    </div>
                                </div>

                                {/* Cột Phải: QR Code & Trạng thái */}
                                <div className="ticket-qr-col">
                                    <div className="status-badge success">ĐÃ THANH TOÁN</div>
                                    {/* Tạo mã QR Online đơn giản từ Google API */}
                                    <img 
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=BOOKING-${booking.id}`} 
                                        alt="QR Check-in" 
                                        className="qr-img"
                                    />
                                    <span className="booking-code">Mã: #{booking.id}</span>
                                    <p className="note">Đưa mã này cho nhân viên soát vé</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyTickets;