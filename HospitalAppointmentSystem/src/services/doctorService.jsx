import axios from 'axios';

// Base API URL for doctors
const API_URL = "http://localhost:8080/api/doctors";

class DoctorService {
    // Save a new doctor
    saveDoctor(doctor) {
        return axios.post(`${API_URL}`, doctor);
    }

    // Get all doctors
    getDoctors() {
        return axios.get(`${API_URL}`);
    }

    // Delete a doctor by ID
    deleteDoctor(id) {
        return axios.delete(`${API_URL}/${id}`);
    }

    // Get a specific doctor by ID
    getDoctorById(nic) {
        return axios.get(`${API_URL}/${nic}`);
    }

    // Get a specific doctor by ID
    getDoctorByNic(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    // Update doctor details
    updateDoctor(doctor, id) {
        return axios.put(`${API_URL}/${id}`, doctor);
    }

    // Search for doctors by name and specialization
    searchDoctors(name, specialization) {
        return axios.get(`${API_URL}/search`, {
            params: {
                name: name,
                specialization: specialization
            }
        });
    }
}

// Export an instance of DoctorService
export default new DoctorService();
