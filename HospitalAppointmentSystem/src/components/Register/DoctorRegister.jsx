import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorService from "../../services/doctorService";
import background from './assets/image4.jpg';

const DoctorRegister = () => {
    const [doctor, setDoctor] = useState({
        doctorName: "",
        specialization: "",
        doctorEmail: "",
        doctorMobile: "",
        doctorNic: "",
        timeSlots: [],
    });

    const [showAlert, setShowAlert] = useState(false);
    const navigate = useNavigate();

    const backgroundStyle = {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
    };

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctor((prev) => ({ ...prev, [name]: value }));
        console.log("Updated Doctor State:", doctor); // Debugging line
    };

    const registerDoctor = (e) => {
        e.preventDefault();
    
        // Check if all required fields are filled
        if (!doctor.doctorName || !doctor.specialization || !doctor.doctorEmail || !doctor.doctorMobile || !doctor.doctorNic) {
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
            return;
        }
    
        // Manually format doctor data before sending
        const formattedDoctor = {
            name: doctor.doctorName.trim(),
            specialization: doctor.specialization.trim(),
            email: doctor.doctorEmail.trim(),
            mobile: doctor.doctorMobile.trim(),
            nic: doctor.doctorNic.trim(),
            timeSlots: doctor.timeSlots,
        };
    
        // Log the formatted data for debugging
        console.log("Formatted Doctor Data: ", formattedDoctor);
    
        // Send the formatted data to the API
        doctorService.saveDoctor(formattedDoctor)
            .then((response) => {
                console.log('Doctor registered successfully:', response.data);
                navigate("/dashboard");
            })
            .catch((error) => {
                console.error('Error registering doctor:', error.response ? error.response.data : error.message);
            });
    };
    

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour < 22; hour++) {
            const startHour = hour > 12 ? hour - 12 : hour;
            const startAmpm = hour >= 12 ? 'PM' : 'AM';
            const endHour = hour + 2 > 12 ? hour + 2 - 12 : hour + 2;
            const endAmpm = hour + 2 >= 12 ? 'PM' : 'AM';
            slots.push(`${startHour}-${endHour} ${startAmpm}`);
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    const handleTimeSlotChange = (event) => {
        const options = event.target.selectedOptions;
        const selectedSlots = Array.from(options).map(option => option.value);
        setDoctor((prev) => ({ ...prev, timeSlots: selectedSlots }));
    };

    const [specializationOptions] = useState([
        "Cardiology",
        "Neurology",
        "Pediatrics",
        "General Practice"
    ]);
    
    const handleSpecializationChange = (event) => {
        setDoctor((prev) => ({
            ...prev,
            specialization: event.target.value,
        }));
    };

    const back = (e) => {
        e.preventDefault();
        navigate(`/dashboard`);
    };

    return (
        <div className="display" style={backgroundStyle}>
            <div className="border-solid w-full h-full shadow-0 border-0 rounded-3xl p-6 sm:border-2 sm:w-[600px] sm:h-auto sm:shadow-xl bg-white bg-opacity-75 hover-scale-none transition-transform sm:hover-scale-up">
                <h1 className="text-cyan-400 text-4xl font-semibold text-center mb-4">Register New Doctor</h1>
                <form onSubmit={registerDoctor}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                        <div className="w-lg">
                            <label className="pr-3 text-gray-600">Doctor Name</label>
                            <input
                                type="text"
                                name="doctorName"
                                value={doctor.doctorName}
                                onChange={handleChange}
                                className="border-2 border-gray-300 w-full h-8 sm:w-full rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            />
                        </div>
                        <div className="w-lg">
                            <label className="pr-3 text-gray-600">Specialization</label>
                            <select
                                name="specialization"
                                value={doctor.specialization}
                                onChange={handleSpecializationChange}
                                className="border-2 border-gray-300 w-full h-8 sm:w-full rounded-lg pl-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            >
                                <option value="">Select Specialization</option>
                                {specializationOptions.map((option, index) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-6 p-2 items-center">
                        <label className="pr-3 text-gray-600">Mobile</label>
                        <input
                            type="text"
                            name="doctorMobile"
                            value={doctor.doctorMobile}
                            onChange={handleChange}
                            className="border-2 border-gray-300 w-full sm:w-full h-8 rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div className="flex gap-6 p-2 items-center">
                        <label className="pr-3 text-gray-600">Email</label>
                        <input
                            type="email"
                            name="doctorEmail"
                            value={doctor.doctorEmail}
                            onChange={handleChange}
                            className="border-2 border-gray-300 w-full sm:w-full h-8 rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                        />
                    </div>
                    <div className="flex gap-6 p-2 items-center">
                        <label className="pr-3 text-gray-600">NIC</label>
                        <input
                            type="text"
                            name="doctorNic"
                            value={doctor.doctorNic}
                            onChange={handleChange}
                            className="border-2 border-gray-300 w-full sm:w-full h-8 rounded-lg p-4 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                            required
                        />
                    </div>
                    <div className="flex gap-6 p-2 items-center">
                        <label className="text-gray-600">Time Slots</label>
                        <select
                            multiple
                            value={doctor.timeSlots}
                            onChange={handleTimeSlotChange}
                            className="border-2 border-gray-300 w-full h-32 sm:w-full rounded-lg pl-4 p-2 transition-colors duration-300 focus:outline-none focus:border-cyan-400"
                        >
                            {timeSlots.map((slot, index) => (
                                <option key={index} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </div>
                    {doctor.timeSlots.length > 0 && (
                        <div className="p-2">
                            <h4 className="text-gray-600">Selected Time Slots:</h4>
                            <ul>
                                {doctor.timeSlots.map((slot, index) => (
                                    <li key={index}>{slot}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {showAlert && (
                        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            Please fill in all fields before submitting the form.
                        </div>
                    )}
                    <div className="flex justify-between pt-2 xs:pt-6 gap-4">
                        <button type="submit" className="bg-cyan-500 text-white py-2 px-4 rounded-lg mt-4 w-full transition-colors duration-300 hover:bg-cyan-600">
                            Register Doctor
                        </button>
                        <button onClick={back} className="bg-gray-500 text-white py-2 px-4 rounded-lg mt-4 ml-4 w-full transition-colors duration-300 hover:bg-gray-600">
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorRegister;
