import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import { MdEventSeat } from 'react-icons/md';

function SeatSelection() {
    const { showtimeId } = useParams();
    const navigate = useNavigate();

    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]); 
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    // 1. Load sơ đồ ghế
    useEffect(() => {
        // Public API: Không bắt buộc token để xem ghế, nhưng logic cũ của bạn bắt buộc thì giữ nguyên
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để đặt vé!");
            navigate("/login");
            return;
        }

        axios.get(`http://localhost:8080/api/showtimes/${showtimeId}/seats`)
            .then(res => {
                setSeats(res.data); // Dữ liệu trả về: { id, seatNumber, status, price, row, col }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                toast.error("Lỗi tải sơ đồ ghế!");
                setLoading(false);
            });
    }, [showtimeId, navigate]);

    // 2. Xử lý click ghế
    const handleSeatClick = (seat) => {
        // SỬA: Check status thay vì boolean booked
        if (seat.status === 'Sold') return; 

        const isSelected = selectedSeats.find(s => s.id === seat.id);

        if (isSelected) {
            const newList = selectedSeats.filter(s => s.id !== seat.id);
            setSelectedSeats(newList);
            setTotalPrice(prev => prev - seat.price);
        } else {
            // Logic: Không được chọn quá 8 ghế (ví dụ)
            if (selectedSeats.length >= 8) {
                toast.warning("Bạn chỉ được chọn tối đa 8 ghế!");
                return;
            }
            setSelectedSeats([...selectedSeats, seat]);
            setTotalPrice(prev => prev + seat.price);
        }
    };

    // 3. Tiếp tục
    const handleContinue = () => {
        if (selectedSeats.length === 0) {
            toast.warning("Vui lòng chọn ghế trước khi tiếp tục!");
            return;
        }

        navigate("/payment", {
            state: {
                showtimeId: showtimeId,
                selectedSeats: selectedSeats,
                ticketPrice: totalPrice 
            }
        });
    };

    // Helper: Group ghế theo hàng (Row A, B, C...)
    const seatsByRow = seats.reduce((acc, seat) => {
        // Backend trả về field 'row' (ví dụ "A")
        if (!acc[seat.row]) acc[seat.row] = [];
        acc[seat.row].push(seat);
        return acc;
    }, {});
    
    // Sắp xếp hàng theo thứ tự alphabet
    const sortedRows = Object.keys(seatsByRow).sort();

    if (loading) return <div className="loading-text">Đang tải sơ đồ ghế...</div>;

    return (
        <div className="seat-selection-page">
            <Navbar />
            
            <div className="seat-container">
                <h2 className="screen-title">MÀN HÌNH</h2>
                <div className="screen-display"></div>

                <div className="seat-map">
                    {sortedRows.map(row => (
                        <div key={row} className="seat-row">
                            <span className="row-label">{row}</span>
                            <div className="row-seats">
                                {seatsByRow[row]
                                    .sort((a, b) => a.col - b.col) // Sắp xếp cột 1, 2, 3...
                                    .map(seat => {
                                        const isSelected = selectedSeats.find(s => s.id === seat.id);
                                        const isSold = seat.status === 'Sold';
                                        
                                        // Logic VIP: 2 hàng cuối (I,J cho 2D hoặc K,L cho 3D)
                                        const totalRows = sortedRows.length;
                                        const isVIP = totalRows === 12 
                                            ? ['K', 'L'].includes(seat.row)  // 3D: chỉ 2 hàng cuối K, L
                                            : ['I', 'J'].includes(seat.row); // 2D: chỉ 2 hàng cuối I, J
                                        
                                        let seatClass = "seat-item";
                                        if (isSold) seatClass += " booked";
                                        else if (isSelected) seatClass += " selected";
                                        else if (isVIP) seatClass += " vip";
                                        else seatClass += " standard";

                                        return (
                                            <div 
                                                key={seat.id} 
                                                className={seatClass}
                                                onClick={() => handleSeatClick(seat)}
                                                title={`${seat.seatNumber} - ${seat.price.toLocaleString()}đ`}
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

            <div className="booking-footer">
                <div className="footer-content">
                    <div className="total-info">
                        <p>Ghế: <b>{selectedSeats.map(s => s.seatNumber).join(", ")}</b></p>
                        <p className="total-price">Tạm tính: {totalPrice.toLocaleString()} VND</p>
                    </div>
                    <button className="btn-continue" onClick={handleContinue}>TIẾP TỤC</button>
                </div>
            </div>
        </div>
    );
}

export default SeatSelection;