import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { MdEventSeat } from 'react-icons/md'; // Icon ghế

function SeatSelection() {
    const { showtimeId } = useParams();
    const navigate = useNavigate();

    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]); // Lưu danh sách ghế đang chọn
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    // 1. Load dữ liệu ghế từ Backend
    useEffect(() => {
        // Kiểm tra đăng nhập lại 
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập!");
            navigate("/login");
            return;
        }

        axios.get(`http://localhost:8080/api/showtimes/${showtimeId}/seats`)
            .then(res => {
                setSeats(res.data);
                setLoading(false);
            })
            .catch(err => {
                toast.error("Lỗi tải sơ đồ ghế!");
                setLoading(false);
            });
    }, [showtimeId, navigate]);

    // 2. Xử lý khi bấm vào ghế
    const handleSeatClick = (seat) => {
        if (seat.isBooked) return; // Ghế đã bán thì không làm gì

        const isSelected = selectedSeats.find(s => s.id === seat.id);

        if (isSelected) {
            // Nếu đang chọn -> Bỏ chọn
            const newList = selectedSeats.filter(s => s.id !== seat.id);
            setSelectedSeats(newList);
            setTotalPrice(prev => prev - seat.price);
        } else {
            // Nếu chưa chọn -> Chọn
            setSelectedSeats([...selectedSeats, seat]);
            setTotalPrice(prev => prev + seat.price);
        }
    };

    // 3. Nhóm ghế theo Hàng (Row) để vẽ layout
    // Kết quả: { "A": [seat1, seat2...], "B": [...] }
    const seatsByRow = seats.reduce((acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
    }, {});

    // Sắp xếp thứ tự hàng: A, B, C...
    const sortedRows = Object.keys(seatsByRow).sort();

    const handleContinue = () => {
        if (selectedSeats.length === 0) {
            toast.warning("Vui lòng chọn ít nhất 1 ghế!");
            return;
        }
        // Chuyển sang trang thanh toán 
        // Tạm thời lưu thông tin vé vào localStorage
        localStorage.setItem("bookingInfo", JSON.stringify({
            showtimeId,
            selectedSeats,
            totalPrice
        }));
        toast.success("Đang chuyển sang thanh toán...");
        // navigate("/payment"); 
    };

    if (loading) return <div className="loading-screen">Đang tải sơ đồ ghế...</div>;

    return (
        <div className="seat-selection-page">
            <Navbar />
            
            <div className="seat-container">
                <h2 className="screen-title">MÀN HÌNH</h2>
                <div className="screen-display"></div> {/* Hình thang biểu tượng màn hình */}

                <div className="seat-map">
                    {sortedRows.map(row => (
                        <div key={row} className="seat-row">
                            <span className="row-label">{row}</span>
                            <div className="row-seats">
                                {seatsByRow[row].map(seat => {
                                    // Xác định trạng thái ghế để tô màu
                                    const isSelected = selectedSeats.find(s => s.id === seat.id);
                                    let seatClass = "seat-item";
                                    if (seat.isBooked) seatClass += " booked";
                                    else if (isSelected) seatClass += " selected";
                                    else if (seat.type === "VIP") seatClass += " vip";
                                    else seatClass += " standard";

                                    return (
                                        <div 
                                            key={seat.id} 
                                            className={seatClass}
                                            onClick={() => handleSeatClick(seat)}
                                            title={`${seat.row}${seat.col} - ${seat.price.toLocaleString()}đ`}
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

                {/* Chú thích màu ghế */}
                <div className="seat-legend">
                    <div className="legend-item"><span className="seat-dot standard"></span>Thường</div>
                    <div className="legend-item"><span className="seat-dot vip"></span>VIP</div>
                    <div className="legend-item"><span className="seat-dot selected"></span>Đang chọn</div>
                    <div className="legend-item"><span className="seat-dot booked"></span>Đã đặt</div>
                </div>
            </div>

            {/* Footer thanh toán (Fixed ở dưới cùng) */}
            <div className="booking-footer">
                <div className="footer-content">
                    <div className="total-info">
                        <p>Ghế đang chọn: <b>{selectedSeats.map(s => s.name).join(", ")}</b></p>
                        <p className="total-price">Tổng tiền: {totalPrice.toLocaleString()} VND</p>
                    </div>
                    <button className="btn-continue" onClick={handleContinue}>
                        TIẾP TỤC
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SeatSelection;