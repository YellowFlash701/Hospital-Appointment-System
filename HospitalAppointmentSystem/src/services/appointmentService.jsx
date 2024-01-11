import axios from 'axios';

// Base API URL for appointments.
const API_URL = "http://localhost:8080/api/appointments";

class AppointmentService {
    // Save a new appointment.
    saveAppointment(appointment) {
        return axios.post(`${API_URL}`, appointment);
    }

    // Retrieve all appointments.
    getAppointments() {
        return axios.get(`${API_URL}`);
    }

    // Delete an appointment by ID.
    deleteAppointment(id) {
        return axios.delete(`${API_URL}/${id}`);
    }

    // Get a specific appointment by ID.
    getAppointmentById(id) {
        return axios.get(`${API_URL}/${id}`);
    };

    // Update an appointment by ID.
    updateAppointment(appointment, id) {
        return axios.put(`${API_URL}/${id}`, appointment);
    }

    // Search for appointments by date and time.
    getAppointmentsByDateAndTime(appointmentDate, appointmentTime) {
        return axios.get(`${API_URL}/search`, {
            params: {
                appointmentDate: appointmentDate,
                appointmentTime: appointmentTime.trim()
            }
        });
    }

    // Retrieve active appointments.
    getActiveAppointments() {
        return axios.get(`${API_URL}/active`);
    }

    // Retrieve canceled appointments.
    getCanceledAppointments() {
        return axios.get(`${API_URL}/canceled`);
    }

    // Cancel an appointment by ID.
    cancelAppointment(id) {
        return axios.put(`${API_URL}/cancel/${id}`);
    }

    // Revive a canceled appointment by ID.
    reviveAppointment(id) {
        return axios.put(`${API_URL}/revive/${id}`);
    }

    // Replace an appointment.
    replaceAppointment(appointment) {
        return axios.post(`${API_URL}/replace`, appointment);
    }

    // Get total number of appointments.
    getTotalAppointments() {
        return axios.get(`${API_URL}/total`);
    }

    // Get appointments grouped by doctor.
    getAppointmentsByDoctor() {
        return axios.get(`${API_URL}/by_doctor`);
    }

    // Get appointments grouped by time slot.
    getAppointmentsByTimeSlot() {
        return axios.get(`${API_URL}/by_time_slot`);
    }

    // Get count of canceled appointments.
    getCanceledAppointmentsCount() {
        return axios.get(`${API_URL}/canceled_count`);
    }

    // Get active appointments grouped by doctor.
    getActiveAppointmentsByDoctor() {
        return axios.get(`${API_URL}/active/by_doctor`);
    }

    // Get active appointments grouped by time slot.
    getActiveAppointmentsByTimeSlot() {
        return axios.get(`${API_URL}/active/by_time_slot`);
    }

    // Get canceled appointments grouped by doctor.
    getCanceledAppointmentsByDoctor() {
        return axios.get(`${API_URL}/canceled/by_doctor`);
    }

    // Get canceled appointments grouped by time slot.
    getCanceledAppointmentsByTimeSlot() {
        return axios.get(`${API_URL}/canceled/by_time_slot`);
    }

    // Retrieve available time slots for a specific doctor by doctor ID.
    getTimeSlotsByDoctor(doctorId) {
        return axios.get(`${API_URL}/time_slots`, {
            params: {
                doctorId: doctorId
            }
        });
    }

    // Retrieve the list of doctors.
    getDoctors() {
        return axios.get(`http://localhost:8080/api/doctors`);
    }
}

// Export an instance of AppointmentService.
export default new AppointmentService();
