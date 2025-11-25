import axios from 'axios';

const API_URL = "http://localhost:8080/api/auth"; 

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        // Nếu đăng nhập thành công, lưu Token vào bộ nhớ trình duyệt
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Fail to connect to server" };
    }
};