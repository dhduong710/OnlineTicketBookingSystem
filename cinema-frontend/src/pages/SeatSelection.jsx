import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { MdEventSeat } from 'react-icons/md';

function SeatSelection() {
    const { showtimeId } = useParams();
    const navigate = useNavigate();

    // --- STATES ---
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]); 
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    
    // State: Quản lý ẩn/hiện Modal xác nhận
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // 1. Load sơ đồ ghế từ API
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để đặt vé!");
            navigate("/login");
            return;
        }

        // Gọi API lấy ghế của suất chiếu này
        axios.get(`http://localhost:8080/api/showtimes/${showtimeId}/seats`)
            .then(res => {
                setSeats(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                toast.error("Lỗi tải sơ đồ ghế!");
                setLoading(false);
            });
    }, [showtimeId, navigate]);

    // 2. Xử lý logic chọn/bỏ chọn ghế
    const handleSeatClick = (seat) => {
        if (seat.booked) return; // Ghế đã đặt thì không làm gì

        const isSelected = selectedSeats.find(s => s.id === seat.id);

        if (isSelected) {
            // Nếu đang chọn -> Bỏ chọn (Trừ tiền)
            const newList = selectedSeats.filter(s => s.id !== seat.id);
            setSelectedSeats(newList);
            setTotalPrice(prev => prev - seat.price);
        } else {
            // Nếu chưa chọn -> Thêm vào (Cộng tiền)
            setSelectedSeats([...selectedSeats, seat]);
            setTotalPrice(prev => prev + seat.price);
        }
    };

    // 3. Bước đệm: Kiểm tra và mở Modal xác nhận
    const handlePreBooking = () => {
        if (selectedSeats.length === 0) {
            toast.warning("Bạn chưa chọn ghế nào!");
            return;
        }
        
        setShowConfirmModal(true);
    };

    // 4. Xử lý thanh toán chính thức (Gọi API)
    const handleFinalPayment = async () => {
        // Đóng modal trước
        setShowConfirmModal(false);

        try {
            const token = localStorage.getItem("token");
            
            const payload = {
                showtimeId: Number(showtimeId),
                seatIds: selectedSeats.map(seat => seat.id)
            };

            // Gọi API Booking
            await axios.post("http://localhost:8080/api/bookings", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Thành công
            toast.success("Đặt vé thành công!");
            navigate("/"); // Về trang chủ

        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data || "Đặt vé thất bại. Vui lòng thử lại!";
            toast.error(errorMsg);
            
            // Nếu lỗi 400 (thường là do ghế vừa bị người khác đặt), load lại trang
            if (error.response?.status === 400) {
                setTimeout(() => window.location.reload(), 2000);
            }
        }
    };

    // Xử lý dữ liệu để vẽ sơ đồ (Group theo hàng A, B, C...)
    const seatsByRow = seats.reduce((acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
    }, {});
    const sortedRows = Object.keys(seatsByRow).sort();

    // Màn hình loading
    if (loading) return (
        <div style={{textAlign:'center', marginTop:'100px', color: '#666'}}>
            <h3>Đang tải sơ đồ ghế...</h3>
        </div>
    );

    return (
        <div className="seat-selection-page">
            <Navbar />
            
            <div className="seat-container">
                {/* Màn hình hiển thị */}
                <h2 className="screen-title">MÀN HÌNH</h2>
                <div className="screen-display"></div>

                {/* Sơ đồ ghế */}
                <div className="seat-map">
                    {sortedRows.map(row => (
                        <div key={row} className="seat-row">
                            <span className="row-label">{row}</span>
                            <div className="row-seats">
                                {seatsByRow[row].map(seat => {
                                    const isSelected = selectedSeats.find(s => s.id === seat.id);
                                    
                                    // Xác định class cho từng loại ghế
                                    let seatClass = "seat-item";
                                    if (seat.booked) seatClass += " booked";
                                    else if (isSelected) seatClass += " selected";
                                    else if (seat.type === "VIP") seatClass += " vip";
                                    else seatClass += " standard";

                                    return (
                                        <div 
                                            key={seat.id} 
                                            className={seatClass}
                                            onClick={() => handleSeatClick(seat)}
                                            title={`${seat.name} - ${seat.price.toLocaleString()}đ`}
                                        >
                                            <MdEventSeat />
                                            <span className="seat-number">{seat.col}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>


                <div className="seat-legend">
                    <div className="legend-item"><span className="seat-dot standard"></span>Thường</div>
                    <div className="legend-item"><span className="seat-dot vip"></span>VIP</div>
                    <div className="legend-item"><span className="seat-dot selected"></span>Đang chọn</div>
                    <div className="legend-item"><span className="seat-dot booked"></span>Đã đặt</div>
                </div>
            </div>

            {/* Footer Cố định */}
            <div className="booking-footer">
                <div className="footer-content">
                    <div className="total-info">
                        <p>Ghế đang chọn: <b>{selectedSeats.length > 0 ? selectedSeats.map(s => s.name).join(", ") : "Chưa chọn"}</b></p>
                        <p className="total-price">Tổng tiền: {totalPrice.toLocaleString()} VND</p>
                    </div>
         
                    {/* Nút bấm gọi Modal */}
                    <button className="btn-continue" onClick={handlePreBooking}>
                        THANH TOÁN NGAY
                    </button>
                </div>
            </div>

            {/* --- CUSTOM CONFIRM MODAL --- */}
            {showConfirmModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Xác nhận thanh toán</h3>
                        </div>
                        
                        <div className="modal-body">
                            <p>Vui lòng kiểm tra kỹ thông tin vé trước khi đặt.</p>
                            
                            <div className="modal-info">
                                <div>
                                    <span>Số lượng ghế:</span>
                                    <span className="highlight">{selectedSeats.length} vé</span>
                                </div>
                                <div>
                                    <span>Vị trí ghế:</span>
                                    <span className="highlight">{selectedSeats.map(s => s.name).join(', ')}</span>
                                </div>
                                <hr style={{margin: '10px 0', border: 'none', borderTop: '1px dashed #ddd'}}/>
                                <div>
                                    <span>Tổng tiền:</span>
                                    <span className="price">{totalPrice.toLocaleString()} đ</span>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button 
                                    className="btn-cancel" 
                                    onClick={() => setShowConfirmModal(false)}
                                >
                                    Quay lại
                                </button>
                                <button 
                                    className="btn-confirm" 
                                    onClick={handleFinalPayment}
                                >
                                    Xác nhận & Đặt vé
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SeatSelection;