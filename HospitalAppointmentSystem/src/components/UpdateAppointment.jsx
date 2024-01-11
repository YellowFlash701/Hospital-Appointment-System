import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import appointmentService from '../services/appointmentService';
import background from '../assets/image4.jpg';
import doctorService from "../services/doctorService";

const EditAppointment = () => {
    const { id } = useParams(); // Get the appointment ID from the URL parameters
    const navigate = useNavigate(); // Hook for navigation

    // State to hold the appointment data
    const [appointment, setAppointment] = useState({
        id: "",
        doctorName: "",
        appointmentTime: "",
        appointmentDate: "",
        patientIndex: ""
    });

    const [timeSlots, setTimeSlots] = useState([]); // State for available time slots
    const [selectedDate, setSelectedDate] = useState(null); // State for the selected date
    const [showAlert, setShowAlert] = useState(false); // State for showing an alert message
    const [doctors, setDoctors] = useState([]); // List of doctors

    // Style for the background image
    const backgroundStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
    };

    useEffect(() => {
        doctorService.getDoctors()
            .then(response => setDoctors(response.data))
            .catch(error => console.error("Error fetching doctors:", error));
    }, []);

    // This function generates a patient index based on doctor and appointment time
    const generatePatientIndex = (appointmentTime, doctorName) => {
        if (!appointmentTime || !doctorName) return '';

        const [time, period] = appointmentTime.split(' ');
        const hour = parseInt(time.split(':')[0]);
        const slotNumber = hour > 12 ? hour - 12 : hour;
        const paddedCount = String(Math.floor(Math.random() * 100)).padStart(2, '0'); // Random example count
        return `P${slotNumber}-${paddedCount}`; // Format as P[hour]-[count]
    };

    // Fetch the appointment data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await appointmentService.getAppointmentById(id); // Fetch appointment by ID
                const appointmentData = response.data;

                setAppointment(appointmentData); // Set the fetched appointment data

                // If the appointment has a date, set it in the date picker
                if (appointmentData.appointmentDate) {
                    setSelectedDate(new Date(appointmentData.appointmentDate));
                }

                // If a doctor is selected, update the available time slots
                if (appointmentData.doctorName) {
                    const selectedDoctor = doctors.find(doc => doc.name === appointmentData.doctorName);
                    setTimeSlots(selectedDoctor ? selectedDoctor.timeSlots : []);
                }
            } catch (error) {
                console.error('Error fetching appointment:', error);
            }
        };
        fetchData();
    }, [id, doctors]); // Dependency array to run the effect only when the ID or doctors list changes

    // Handle changes in input fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle changes in the doctor selection
    const handleDoctorChange = (e) => {
        const selectedDoctor = e.target.value;
        setAppointment((prev) => ({
            ...prev,
            doctorName: selectedDoctor,
            appointmentTime: "",
            patientIndex: ""
        }));

        const doctor = doctors.find(doc => doc.name === selectedDoctor);
        setTimeSlots(doctor ? doctor.timeSlots : []);
    };

    // Handle changes in the time slot selection
    const handleTimeSlotChange = (e) => {
        const selectedTimeSlot = e.target.value;
        setAppointment((prev) => ({
            ...prev,
            appointmentTime: selectedTimeSlot,
            patientIndex: generatePatientIndex(selectedTimeSlot, appointment.doctorName) // Generate patient index
        }));
    };

    // Handle changes in the date picker
    const handleDateChange = (date) => {
        setSelectedDate(date); // Update the selected date
        setAppointment((prev) => ({
            ...prev,
            appointmentDate: date.toISOString().split('T')[0] // Format the date and update the appointment state
        }));
    };

    // Handle form submission to update the appointment
    const updateAppointment = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Validate required fields
        if (!appointment.doctorName || !appointment.appointmentTime || !appointment.appointmentDate) {
            setShowAlert(true); // Show alert if validation fails
            setTimeout(() => {
                setShowAlert(false);
            }, 5000); // Hide alert after 5 seconds
            return;
        }

        // Send the updated appointment data to the server
        appointmentService.updateAppointment(appointment, appointment.id)
            .then((response) => {
                navigate("/dashboard"); // Navigate to the dashboard on success
            })
            .catch((error) => {
                console.error('Error updating appointment:', error);
            });
    };

    // Handle the back button to navigate back to the dashboard
    const back = (e) => {
        e.preventDefault();
        navigate('/dashboard'); // Navigate back to the dashboard
    };

    return (
        <div className="display" style={backgroundStyle}>
            <div className="border-solid w-full h-full shadow-0 border-0 rounded-3xl p-6 sm:border-2 sm:w-[600px] sm:h-auto sm:shadow-xl bg-white bg-opacity-75">
                <h1 className="text-cyan-400 text-4xl font-semibold text-center mb-4">Update Appointment</h1>
                <form onSubmit={updateAppointment}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                        <div className="w-lg">
                            <label className="pr-3 text-gray-600">Doctor Name</label>
                            <select
                                name="doctorName"
                                value={appointment.doctorName}
                                onChange={handleDoctorChange}
                                className="border-2 border-gray-300 w-full pl-2 h-7 sm:w-full rounded-lg transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            >
                                <option value="">Select a Doctor</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor.id} value={doctor.name}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="pr-3 text-gray-600">Time Slot</label>
                            <select
                                name="appointmentTime"
                                value={appointment.appointmentTime}
                                onChange={handleTimeSlotChange}
                                className="border-2 border-gray-300 w-full pl-2 sm:w-full h-7 rounded-lg transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            >
                                <option value="">Select a Time Slot</option>
                                {timeSlots.map((slot, index) => (
                                    <option key={index} value={slot}>
                                        {slot}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                        <div>
                            <label className="pr-3 text-gray-600">Patient Index</label>
                            <input
                                type="text"
                                name="patientIndex"
                                value={appointment.patientIndex}
                                readOnly
                                className="border-2 border-gray-300 w-full sm:w-full pl-2 h-7 rounded-lg transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            />
                        </div>
                        <div>
                            <label className="pr-3 text-gray-600">Appointment Date</label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                dateFormat="yyyy-MM-dd"
                                className="border-2 border-gray-300 w-full sm:w-full pl-2 h-7 rounded-lg transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            />
                        </div>
                    </div>

                    {showAlert && (
                        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">Please fill in all required fields.</div>
                    )}

                    <div className="flex justify-between pt-2 xs:pt-6 gap-4">
                        <button
                            type="submit"
                            className="bg-cyan-500 text-white py-2 px-4 rounded-lg mt-4 w-full transition-colors duration-300 hover:bg-cyan-600"
                        >
                            Update Appointment
                        </button>
                        <button
                            type="button"
                            onClick={back}
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg mt-4 ml-4 w-full transition-colors duration-300 hover:bg-gray-600"
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAppointment;
