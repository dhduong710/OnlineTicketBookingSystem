import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingPage from './pages/BookingPage';
import SeatSelection from './pages/SeatSelection';
import PaymentPage from './pages/PaymentPage';
import MyTickets from './pages/MyTickets';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetail />} /> 
        <Route path="/booking/:movieId" element={<BookingPage />} />
        <Route path="/seat-selection/:showtimeId" element={<SeatSelection />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/my-tickets" element={<MyTickets />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;