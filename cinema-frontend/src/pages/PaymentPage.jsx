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

    // Load sản phẩm (Nên gọi API nếu Backend có API Product)
    useEffect(() => {
        if (!selectedSeats) {
            navigate("/"); 
            return;
        }
        // Giả lập hoặc gọi API
        setProducts([
            { id: 1, name: "Bắp Ngọt", price: 50000, image: "https://img.freepik.com/premium-vector/popcorn-striped-tub_157999-54.jpg" },
            { id: 2, name: "Nước Ngọt", price: 20000, image: "https://img.freepik.com/free-vector/soda-can-aluminium-white_1308-32368.jpg" },
            { id: 3, name: "Combo", price: 65000, image: "https://img.freepik.com/free-vector/pop-corn-soda-fast-food_24877-57924.jpg" }
        ]);
    }, [selectedSeats, navigate]);

    // Tính tiền
    useEffect(() => {
        let productTotal = 0;
        Object.keys(cart).forEach(id => {
            const product = products.find(p => p.id === parseInt(id));
            if (product) productTotal += product.price * cart[id];
        });
        
        // Logic Discount Front-end (chỉ mang tính hiển thị ước lượng, Backend sẽ tính lại chính xác)
        let discount = 0;
        if (selectedSeats && selectedSeats.length >= 5) discount += 0.1; 

        const finalTicketPrice = (ticketPrice || 0) * (1 - discount);
        setTotalAmount(finalTicketPrice + productTotal);

    }, [cart, products, ticketPrice, selectedSeats]);

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
                        
                        <div className="total-row">
                            <span>TỔNG TIỀN (Tạm tính):</span>
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