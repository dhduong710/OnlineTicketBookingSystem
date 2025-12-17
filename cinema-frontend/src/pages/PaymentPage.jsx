import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Lấy dữ liệu từ trang chọn ghế truyền sang
    const { showtimeId, selectedSeats, ticketPrice } = location.state || {};
    
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({}); // Lưu số lượng: {1: 2, 2: 1} (ID: SL)
    const [totalAmount, setTotalAmount] = useState(0);

    // 1. Load danh sách bắp nước
    useEffect(() => {
        if (!selectedSeats) {
            navigate("/"); 
            return;
        }
   
        setProducts([
            { id: 1, name: "Bắp Ngọt", price: 50000, image: "https://img.freepik.com/premium-vector/popcorn-striped-tub_157999-54.jpg" },
            { id: 2, name: "Nước Ngọt", price: 20000, image: "https://img.freepik.com/free-vector/soda-can-aluminium-white_1308-32368.jpg" },
            { id: 3, name: "Combo", price: 65000, image: "https://img.freepik.com/free-vector/pop-corn-soda-fast-food_24877-57924.jpg" }
        ]);
        // axios.get("http://localhost:8080/api/products")...
    }, [selectedSeats, navigate]);

    // 2. Tính toán tổng tiền realtime
    useEffect(() => {
        let productTotal = 0;
        Object.keys(cart).forEach(id => {
            const product = products.find(p => p.id === parseInt(id));
            if (product) productTotal += product.price * cart[id];
        });
        
        // Tính giảm giá 
        
        let discount = 0;
        if (selectedSeats && selectedSeats.length >= 5) discount += 0.1; // Mua > 5 vé
        

        const finalTicketPrice = (ticketPrice || 0) * (1 - discount);
        setTotalAmount(finalTicketPrice + productTotal);

    }, [cart, products, ticketPrice, selectedSeats]);

    const handleQuantityChange = (id, delta) => {
        setCart(prev => {
            const newQty = (prev[id] || 0) + delta;
            if (newQty < 0) return prev;
            return { ...prev, [id]: newQty };
        });
    };

    const handleConfirmPayment = async () => {
        try {
            const token = localStorage.getItem("token");
            
            const productOrder = Object.keys(cart).map(id => ({
                productId: parseInt(id),
                quantity: cart[id]
            })).filter(item => item.quantity > 0);

            const payload = {
                showtimeId: Number(showtimeId),
                seatIds: selectedSeats.map(s => s.id),
                products: productOrder
            };

            await axios.post("http://localhost:8080/api/bookings", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Thanh toán thành công!");
            navigate("/my-tickets"); 

        } catch (error) {
            toast.error(error.response?.data || "Lỗi thanh toán");
        }
    };

    return (
        <div className="payment-page">
            <Navbar />
            <div className="payment-container">
                {/* CỘT TRÁI: CHỌN BẮP NƯỚC */}
                <div className="left-col">
                    <h2 className="section-title">CHỌN Bắp - Nước</h2>
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

                {/* CỘT PHẢI: THÔNG TIN THANH TOÁN & QR */}
                <div className="right-col">
                    <div className="summary-card">
                        <h3>THÔNG TIN ĐẶT VÉ</h3>
                        <div className="sum-row">
                            <span>Ghế ({selectedSeats?.length}):</span>
                            <span>{selectedSeats?.map(s => s.name).join(", ")}</span>
                        </div>
                        <div className="sum-row">
                            <span>Bắp nước:</span>
                            <span>{Object.values(cart).reduce((a,b)=>a+b, 0)} món</span>
                        </div>
                        
                        <div className="divider"></div>
                        
                        <div className="total-row">
                            <span>TỔNG TIỀN:</span>
                            <span className="price-tag">{totalAmount.toLocaleString()} đ</span>
                        </div>

                        <div className="qr-section">
                            <p>Quét mã QR để thanh toán:</p>
                            {/* Mã QR tĩnh VietQR demo */}
                            <img 
                                src={`https://img.vietqr.io/image/MB-0969696969-compact.png?amount=${totalAmount}&addInfo=HUST%20Cinema%20Booking&accountName=HUST%20CINEMA`} 
                                alt="VietQR" 
                                className="qr-img-pay"
                            />
                            <p className="bank-info">MB Bank: 0969 6969 69</p>
                            <p className="bank-info">Chủ TK: HUST CINEMA</p>
                        </div>

                        <button className="btn-pay-confirm" onClick={handleConfirmPayment}>
                            XÁC NHẬN ĐÃ THANH TOÁN
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;