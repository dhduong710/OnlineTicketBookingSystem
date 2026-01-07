import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // selectedSeats bây giờ chứa các object ShowSeat (có id, price, status...)
    const { showtimeId, selectedSeats, ticketPrice } = location.state || {};
    
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({}); 
    const [totalAmount, setTotalAmount] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [originalAmount, setOriginalAmount] = useState(0);
    const [discountReasons, setDiscountReasons] = useState([]);
    const [showtimeInfo, setShowtimeInfo] = useState(null);

    // Load sản phẩm từ database qua API
    useEffect(() => {
        if (!selectedSeats) {
            navigate("/"); 
            return;
        }
        
        // Gọi API lấy danh sách products
        axios.get("http://localhost:8080/api/products")
            .then(res => setProducts(res.data))
            .catch(err => console.error("Lỗi tải danh sách sản phẩm:", err));
        
        // Lấy thông tin showtime để biết ngày chiếu
        if (showtimeId) {
            const token = localStorage.getItem("token");
            axios.get(`http://localhost:8080/api/showtimes/${showtimeId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            })
                .then(res => setShowtimeInfo(res.data))
                .catch(err => console.error("Lỗi tải thông tin suất chiếu:", err));
        }
    }, [selectedSeats, navigate, showtimeId]);

    // Tính tiền
    useEffect(() => {
        let productTotal = 0;
        Object.keys(cart).forEach(id => {
            const product = products.find(p => p.id === parseInt(id));
            if (product) productTotal += product.price * cart[id];
        });
        
        // Logic Discount Front-end (chỉ mang tính hiển thị ước lượng, Backend sẽ tính lại chính xác)
        let discount = 0;
        const reasons = [];
        
        // Kiểm tra giảm giá khi đặt >= 5 vé
        if (selectedSeats && selectedSeats.length >= 5) {
            discount += 0.1;
            reasons.push("Giảm 10% giá vé khi đặt từ 5 vé trở lên");
        }
        
        // Kiểm tra giảm giá vào thứ 3
        if (showtimeInfo && showtimeInfo.showDate) {
            // Parse date string từ backend (format: "yyyy-MM-dd")
            const [year, month, day] = showtimeInfo.showDate.split('-').map(Number);
            const showDate = new Date(year, month - 1, day); // month - 1 vì JS month bắt đầu từ 0
            console.log("Show date:", showDate, "Day of week:", showDate.getDay());
            
            if (showDate.getDay() === 2) { // 2 = Thứ 3 (0=CN, 1=T2, 2=T3, 3=T4...)
                discount += 0.1;
                reasons.push("Giảm 10% giá vé vào thứ 3 hàng tuần");
            }
        }

        const originalTotal = (ticketPrice || 0) + productTotal;
        const discountValue = (ticketPrice || 0) * discount;
        const finalTotal = originalTotal - discountValue;

        setOriginalAmount(originalTotal);
        setDiscountAmount(discountValue);
        setTotalAmount(finalTotal);
        setDiscountReasons(reasons);

    }, [cart, products, ticketPrice, selectedSeats, showtimeInfo]);

    const handleQuantityChange = (id, delta) => {
        setCart(prev => {
            const newQty = (prev[id] || 0) + delta;
            return newQty < 0 ? prev : { ...prev, [id]: newQty };
        });
    };

    const handleConfirmPayment = async () => {
        try {
            const token = localStorage.getItem("token");
            
            const productOrder = Object.keys(cart).map(id => ({
                productId: parseInt(id),
                quantity: cart[id]
            })).filter(item => item.quantity > 0);

            // SỬA: Payload khớp với Backend DTO (BookingRequest)
            const payload = {
                showtimeId: Number(showtimeId),
                showSeatIds: selectedSeats.map(s => s.id), // Key là showSeatIds
                products: productOrder
            };

            console.log("=== DEBUG BOOKING PAYLOAD ===");
            console.log("showtimeId:", showtimeId);
            console.log("selectedSeats:", selectedSeats);
            console.log("payload:", JSON.stringify(payload, null, 2));
            console.log("token:", token);

            const res = await axios.post("http://localhost:8080/api/bookings", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Sau khi thành công, Backend trả về BookingResponse (có QR code, totalAmount)
            // Bạn có thể show modal QR code ở đây hoặc chuyển trang
            toast.success(`Đặt vé thành công! Mã đơn: ${res.data.bookingId}`);
            
            // Chuyển hướng về trang lịch sử vé
            navigate("/my-tickets"); 

        } catch (error) {
            console.error("=== BOOKING ERROR ===");
            console.error("Full error:", error);
            console.error("Response data:", error.response?.data);
            console.error("Response status:", error.response?.status);
            toast.error(error.response?.data || "Lỗi thanh toán");
        }
    };

    return (
        <div className="payment-page">
            <Navbar />
            <div className="payment-container">
                <div className="left-col">
                    <h2 className="section-title">CHỌN BẮP - NƯỚC</h2>
                    <div className="product-list">
                        {products.map(p => (
                            <div key={p.id} className="product-card">
                                <img src={p.image} alt={p.name} />
                                <div className="prod-info">
                                    <h4>{p.name}</h4>
                                    <p>{p.price.toLocaleString()}đ</p>
                                </div>
                                <div className="qty-control">
                                    <button onClick={() => handleQuantityChange(p.id, -1)}>-</button>
                                    <span>{cart[p.id] || 0}</span>
                                    <button onClick={() => handleQuantityChange(p.id, 1)}>+</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="right-col">
                    <div className="summary-card">
                        <h3>THÔNG TIN ĐẶT VÉ</h3>
                        <div className="sum-row">
                            <span>Ghế ({selectedSeats?.length}):</span>
                            {/* Dùng seatNumber thay vì name */}
                            <span>{selectedSeats?.map(s => s.seatNumber).join(", ")}</span>
                        </div>
                        <div className="sum-row">
                            <span>Bắp nước:</span>
                            <span>{Object.values(cart).reduce((a,b)=>a+b, 0)} món</span>
                        </div>
                        
                        <div className="divider"></div>
                        
                        <div className="sum-row">
                            <span>Tổng tiền (trước giảm giá):</span>
                            <span>{originalAmount.toLocaleString()} đ</span>
                        </div>
                        
                        {discountAmount > 0 && (
                            <>
                                <div className="sum-row discount-row">
                                    <span>Giảm giá:</span>
                                    <span className="discount-value">- {discountAmount.toLocaleString()} đ</span>
                                </div>
                                {discountReasons.length > 0 && (
                                    <div className="discount-reasons">
                                        {discountReasons.map((reason, index) => (
                                            <p key={index} className="discount-reason-item">• {reason}</p>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                        
                        <div className="divider"></div>
                        
                        <div className="total-row">
                            <span>TỔNG TIỀN (Sau giảm giá):</span>
                            <span className="price-tag">{totalAmount.toLocaleString()} đ</span>
                        </div>

                        {/* Phần QR này đang là Static (Demo). 
                            Nếu muốn Dynamic, cần gọi API tạo booking TRƯỚC, 
                            nhưng logic hiện tại là Bấm nút -> Gọi API -> Xong luôn. 
                            Nên QR hiển thị ở đây chỉ mang tính chất minh họa cho việc "Sắp thanh toán"
                        */}
                        <div className="qr-section">
                            <p>Quét mã QR để thanh toán:</p>
                            <img 
                                src={`https://img.vietqr.io/image/MB-0969696969-compact.png?amount=${Math.round(totalAmount)}&addInfo=HUST%20Cinema&accountName=HUST%20CINEMA`} 
                                alt="VietQR" 
                                className="qr-img-pay"
                            />
                        </div>

                        <button className="btn-pay-confirm" onClick={handleConfirmPayment}>
                            XÁC NHẬN THANH TOÁN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;