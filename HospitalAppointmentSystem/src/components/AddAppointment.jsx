import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import sendAppointmentEmail from '../services/emailService';
import 'react-datepicker/dist/react-datepicker.css';
import appointmentService from '../services/appointmentService';
import doctorService from '../services/doctorService';
import userService from '../services/userService'; // Import userService
import background from '../assets/image4.jpg';

const AddAppointment = () => {
    const [appointment, setAppointment] = useState({
        doctorName: "",
        patientName: "",
        patientMobile: "",
        patientEmail: "",
        nic: "",
        birthday: "", 
        appointmentTime: "",
        appointmentDate: "",
        patientIndex: "", 
        isCanceled: false,
    });

    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedBirthday, setSelectedBirthday] = useState(null);  
    const [showAlert, setShowAlert] = useState(false);
    const [runtimeError, setRuntimeError] = useState(''); 
    const [doctors, setDoctors] = useState([]); 
    const navigate = useNavigate();

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

    const getNextIndex = (existingCount, appointmentTime) => {
        const [time, period] = appointmentTime.split(' '); 
        const hour = parseInt(time.split(':')[0]); 
        const slotNumber = hour > 12 ? hour - 12 : hour; 
        const paddedCount = String(existingCount).padStart(2, '0'); 
        return `P${slotNumber}-${paddedCount}`;
    };

    useEffect(() => {
        if (appointment.appointmentDate && appointment.appointmentTime) {
            appointmentService.getAppointmentsByDateAndTime(appointment.appointmentDate, appointment.appointmentTime)
                .then(response => {
                    const existingAppointments = response.data || [];
                    const nextIndex = getNextIndex(existingAppointments.length + 1, appointment.appointmentTime);
                    setAppointment(prev => ({ ...prev, patientIndex: nextIndex }));
                })
                .catch(error => console.error("Error fetching appointments:", error));
        }
    }, [appointment.appointmentDate, appointment.appointmentTime]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        setAppointment((prev) => ({ ...prev, appointmentDate: date.toISOString().split('T')[0] }));
    };

    const handleBirthdayChange = (date) => {
        setSelectedBirthday(date);
        setAppointment((prev) => ({ ...prev, birthday: date.toISOString().split('T')[0] }));
    };

    const addAppointment = (e) => {
        e.preventDefault();
    
        if (
            !appointment.patientName ||
            !appointment.doctorName ||
            !appointment.patientMobile ||
            !appointment.patientEmail ||
            !appointment.nic ||
            !appointment.birthday ||
            !appointment.appointmentTime ||
            !appointment.appointmentDate
        ) {
            setRuntimeError('Please fill in all required fields!');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
            return;
        }

        // Check if NIC exists and handle user registration/appointment accordingly
        userService.getUserByNic(appointment.nic)
            .then(response => {
                const user = response.data;

                if (user) {
                    if (
                        user.fullName !== appointment.patientName ||
                        user.email !== appointment.patientEmail ||
                        user.phone !== appointment.patientMobile ||
                        user.birthday !== appointment.birthday
                    ) {
                        setRuntimeError('Personal data mismatch for the provided NIC!');
                        setShowAlert(true);
                        setTimeout(() => setShowAlert(false), 5000);
                        return;
                    }

                    // Data matches, proceed to add appointment
                    const newAppointment = { ...appointment, isCanceled: false };
                    appointmentService.saveAppointment(newAppointment)
                        .then(async (response) => {
                            try {
                                await sendAppointmentEmail({ ...newAppointment, id: response.data.id });
                                navigate("/home");
                            } catch (error) {
                                console.error('Error sending email:', error);
                            }
                        })
                        .catch((error) => {
                            console.error('Error adding appointment:', error);
                            setRuntimeError('An unexpected error occurred while adding the appointment.');
                            setShowAlert(true);
                            setTimeout(() => setShowAlert(false), 5000);
                        });
                } else {
                    // NIC does not exist, register new user and add appointment
                    const newUser = {
                        fullName: appointment.patientName,
                        email: appointment.patientEmail,
                        phone: appointment.patientMobile,
                        birthday: appointment.birthday,
                        nic: appointment.nic
                    };
                    userService.registerUser(newUser)
                        .then(() => {
                            const newAppointment = { ...appointment, isCanceled: false };
                            appointmentService.saveAppointment(newAppointment)
                                .then(async (response) => {
                                    try {
                                        await sendAppointmentEmail({ ...newAppointment, id: response.data.id });
                                        navigate("/home");
                                    } catch (error) {
                                        console.error('Error sending email:', error);
                                    }
                                })
                                .catch((error) => {
                                    console.error('Error adding appointment:', error);
                                    setRuntimeError('An unexpected error occurred while adding the appointment.');
                                    setShowAlert(true);
                                    setTimeout(() => setShowAlert(false), 5000);
                                });
                        })
                        .catch((error) => {
                            console.error('Error registering user:', error);
                            setRuntimeError('An unexpected error occurred while registering the user.');
                            setShowAlert(true);
                            setTimeout(() => setShowAlert(false), 5000);
                        });
                }
            })
            .catch((error) => {
                console.error('Error fetching user by NIC:', error);
                setRuntimeError('Error fetching user data.');
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 5000);
            });
    };
    
    const back = (e) => {
        e.preventDefault();
        navigate(`/home`);
    };

    return (
        <div className="display" style={backgroundStyle}>
            <div className="border-solid w-full h-full shadow-0 border-0 sm:rounded-3xl p-6 sm:border-2 sm:w-[600px] sm:h-auto sm:shadow-xl bg-white bg-opacity-75 hover-scale-none transition-transform sm:hover-scale-up">
                <h1 className="text-cyan-400 text-4xl font-semibold text-center mb-4">Add New Appointment</h1>
                <form onSubmit={addAppointment}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                        <div className="w-lg">
                            <label className="pr-3 text-gray-600">Patient Name</label>
                            <input
                                type="text"
                                name="patientName"
                                value={appointment.patientName}
                                onChange={handleChange}
                                className="border-2 border-gray-300 w-full h-8 sm:w-full rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            />
                        </div>
                        <div className="w-lg">
                            <label className="pr-3 text-gray-600">Doctor Name</label>
                            <select
                                name="doctorName"
                                value={appointment.doctorName}
                                onChange={handleDoctorChange}
                                className="border-2 border-gray-300 w-full h-8 sm:w-full rounded-lg pl-2 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            >
                                <option value="">Select a Doctor</option>
                                {doctors.map((doctor) => (
                                    <option key={doctor.id} value={doctor.name}>
                                        {doctor.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-6 p-2 items-center">
                        <label className="pr-3 text-gray-600">Mobile</label>
                        <input
                            type="text"
                            name="patientMobile"
                            value={appointment.patientMobile}
                            onChange={handleChange}
                            className="border-2 border-gray-300 w-full sm:w-full h-8 rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div className="flex gap-6 p-2 items-center">
                        <label className="pr-3 text-gray-600">Email</label>
                        <input
                            type="email"
                            name="patientEmail"
                            value={appointment.patientEmail}
                            onChange={handleChange}
                            className="border-2 border-gray-300 w-full sm:w-full h-8 rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div className="flex gap-6 p-2 items-center">
                        <label className="pr-3 text-gray-600">NIC</label>
                        <input
                            type="text"
                            name="nic"
                            value={appointment.nic}
                            onChange={handleChange}
                            className="border-2 border-gray-300 w-full sm:w-full h-8 rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div className="flex gap-6 p-2 items-center">
                        <label className="pr-3 text-gray-600">Birthday</label>
                        <DatePicker
                            selected={selectedBirthday}
                            onChange={handleBirthdayChange}
                            className="border-2 border-gray-300 w-full h-8 sm:w-full rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                    <div className="flex gap-6 p-2 items-center">
                        <label className="pr-3 text-gray-600">Appointment Date</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            className="border-2 border-gray-300 w-full h-8 sm:w-full rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                    <div className="flex gap-6 p-2 items-center">
                        <label className="pr-3 text-gray-600">Appointment Time</label>
                        <select
                            name="appointmentTime"
                            value={appointment.appointmentTime}
                            onChange={handleChange}
                            className="border-2 border-gray-300 w-full h-8 sm:w-full rounded-lg pl-2 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                        >
                            <option value="">Select a Time Slot</option>
                            {timeSlots.map((slot, index) => (
                                <option key={index} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-6 p-2 items-center">
                        <label className="pr-3 text-gray-600">Patient Index</label>
                        <input
                            type="text"
                            name="patientIndex"
                            value={appointment.patientIndex}
                            readOnly
                            className="border-2 border-gray-300 w-full h-8 sm:w-full rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    {showAlert && (
                        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            {runtimeError ? runtimeError : "Please fill out all fields correctly!"}
                        </div>
                    )}
                    <div className="flex justify-between pt-2 xs:pt-6 gap-4">
                        <button
                            type="submit"
                            className="bg-cyan-500 text-white py-2 px-4 rounded-lg mt-4 w-full transition-colors duration-300 hover:bg-cyan-600"
                        >
                            Add Appointment
                        </button>
                        <button
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

export default AddAppointment;
