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
    

    // 1. Load sơ đồ ghế từ API
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để đặt vé!");
            navigate("/login");
            return;
        }

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
        if (seat.booked) return; 

        const isSelected = selectedSeats.find(s => s.id === seat.id);

        if (isSelected) {
            const newList = selectedSeats.filter(s => s.id !== seat.id);
            setSelectedSeats(newList);
            setTotalPrice(prev => prev - seat.price);
        } else {
            setSelectedSeats([...selectedSeats, seat]);
            setTotalPrice(prev => prev + seat.price);
        }
    };

    // 3. Chuyển sang trang Payment
    const handleContinue = () => {
        if (selectedSeats.length === 0) {
            toast.warning("Vui lòng chọn ghế trước khi tiếp tục!");
            return;
        }

        // Chuyển hướng sang trang /payment và mang theo dữ liệu
        navigate("/payment", {
            state: {
                showtimeId: showtimeId,
                selectedSeats: selectedSeats,
                ticketPrice: totalPrice // Tổng tiền vé tính đến lúc này
            }
        });
    };

    // Xử lý dữ liệu để vẽ sơ đồ
    const seatsByRow = seats.reduce((acc, seat) => {
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
    }, {});
    const sortedRows = Object.keys(seatsByRow).sort();

    if (loading) return (
        <div style={{textAlign:'center', marginTop:'100px', color: '#666'}}>
            <h3>Đang tải sơ đồ ghế...</h3>
        </div>
    );

    return (
        <div className="seat-selection-page">
            <Navbar />
            
            <div className="seat-container">
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
                        <p className="total-price">Tạm tính: {totalPrice.toLocaleString()} VND</p>
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