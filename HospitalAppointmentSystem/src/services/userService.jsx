import axios from 'axios';

// Base API URL for users
const API_URL = "http://localhost:8080/api/users";

class UserService {
    // Register a new user
    registerUser(user) {
        return axios.post(`${API_URL}/register`, user);
    }

    // Get user details by NIC
    async getUserByNic(nic) {
        try {
            const response = await axios.get(`${API_URL}/nic/${nic}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user by NIC:', error);
            throw error;
        }
    }

    // Get user details by email
    getUserByEmail(email) {
        return axios.get(`${API_URL}/email/${email}`);
    }

    // Get all users
    getUsers() {
        return axios.get(API_URL);
    }

    // Delete a user by ID
    deleteUser(id) {
        return axios.delete(`${API_URL}/${id}`);
    }

    // Update user details
    updateUser(user, userId) {
        return axios.put(`${API_URL}/${userId}`, user);
    }
}

// Export an instance of UserService
export default new UserService();
