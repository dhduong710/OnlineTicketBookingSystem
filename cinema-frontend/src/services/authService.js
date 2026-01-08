import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";
const API_URL = `${API_BASE_URL}/auth`;

export const loginUser = async (identifier, password) => {
    try {
        // Gửi identifier (email hoặc sdt) thay vì chỉ email
        const response = await axios.post(`${API_URL}/login`, { identifier, password });
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Fail to connect to server" };
    }
};

export const registerUser = async (email, phone, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, { email, phone, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Fail to connect to server" };
    }
};