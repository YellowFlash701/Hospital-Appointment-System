import React, { Component,useEffect, useState, useRef } from 'react';
import appointmentService from '../../services/appointmentService';
import ActiveAppointments from './ActiveAppointments';
import CanceledAppointments from './CanceledAppointments';

function Appointments() {
    const [appointments, setAppointments] = useState([]);
    const [canceledAppointments, setCanceledAppointments] = useState([]);
    const [error, setError] = useState(''); // State for handling errors
    const [activeTab, setActiveTab] = useState('active'); // State to toggle between active and canceled appointments

    // Effect hook to load appointments on component mount
    useEffect(() => {
        loadAppointments();
    }, []);

    // Function to fetch active and canceled appointments
    const loadAppointments = async () => {
        try {
            const activeResponse = await appointmentService.getActiveAppointments();
            const canceledResponse = await appointmentService.getCanceledAppointments();
            setAppointments(activeResponse.data);
            setCanceledAppointments(canceledResponse.data);
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
    };

    // Function to replace an appointment
    const replaceAppointment = async (appointment) => {
        try {
            await appointmentService.replaceAppointment(appointment);
            loadAppointments(); // Refresh the lists after replacing an appointment
        } catch (error) {
            setError('Error replacing appointment.');
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    };

    return (
        <div>
            <div className="flex mt-5 border-b border-gray-300 ml-10 mr-10">
                <button
                    onClick={() => setActiveTab('active')}
                    className={`py-2 px-4 text-lg font-semibold ${
                        activeTab === 'active'
                            ? 'border-b-2 border-blue-500 transition-colors duration-300 text-blue-600'
                            : 'text-gray-600'
                    }`}
                >
                    Available Appointments
                </button>
                <button
                    onClick={() => setActiveTab('canceled')}
                    className={`py-2 px-4 text-lg font-semibold ${
                        activeTab === 'canceled'
                            ? 'border-b-2 border-blue-500 transition-colors duration-300 text-blue-600'
                            : 'text-gray-600'
                    }`}
                >
                    Canceled Appointments
                </button>
            </div>
            <div className="mt-4">
                {/* Render the appropriate component based on the active tab */}
                {activeTab === 'active' && <ActiveAppointments />}
                {activeTab === 'canceled' && <CanceledAppointments canceledAppointments={canceledAppointments} replaceAppointment={replaceAppointment} />}
            </div>
        </div>
    );
}

export default Appointments;
