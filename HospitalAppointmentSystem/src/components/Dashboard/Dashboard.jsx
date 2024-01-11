import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import appointmentService from '../../services/appointmentService';
import Statistics from './Statistics';
import GenerateReport from './GenerateReport';
import Appointments from './Appointments';
import PersonalDetails from './PersonalDetails';

function Dashboard() {
    // State for active and canceled appointments
    const [appointments, setAppointments] = useState([]);
    const [canceledAppointments, setCanceledAppointments] = useState([]);
    const [error, setError] = useState(''); // State for handling errors
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAuthenticated') === 'true');
    const [role, setRole] = useState(localStorage.getItem('role'));

    // Effect hook to load appointments on component mount
    useEffect(() => {
        loadAppointments();
    }, []);

    const navigate = useNavigate();

    // Ensure this is at the top of your component code

    // Effect for checking authentication
    useEffect(() => {
        const checkAuthentication = () => {
            const storedIsAuthenticated = localStorage.getItem('isAuthenticated');
            const storedRole = localStorage.getItem('role');

            console.log('Checking Authentication:', {
                storedIsAuthenticated,
                storedRole,
            });

            if (storedIsAuthenticated !== 'true' || storedRole !== 'admin') {
                navigate('/login-dash');
                
            } else {
                setIsAuthenticated(true);
                setRole(storedRole);
            }
        };

        checkAuthentication();
    }, [navigate]);

    const handleLogout = () => {
        // Clear the authentication state from local storage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('role');
        
        // Redirect to the login page
        navigate('/login-dash'); // Change this to your login route
    };

    const doctorRegister = (e) => {
        e.preventDefault();
        navigate(`/register-doctor`);
    };

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

    // Reference for the report element
    const reportRef = useRef();

    // Formatting date for the report
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const formattedDateTime = today.toLocaleString(); 
    const reportName = `Report-${formattedDate}.pdf`; // Name of the report file

    // Function to generate and download the PDF report
    const generatePDF = () => {
        const element = reportRef.current;

        const options = {
            margin: 0.5,
            filename: reportName,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        };

        html2pdf().set(options).from(element).save();
    };



    return (
        <div className="relative">
            <div className="fixed top-0 left-0 w-full bg-slate-500 p-5 sm:pl-14 sm:pr-14 flex flex-col sm:flex-row justify-between items-center m-0 z-50">
                <h1 className="text-2xl sm:text-4xl text-white font-bold mb-2">Dashboard</h1>
                <div className="space-x-6">
                    <button 
                        className="dash-nav_buttons"
                        onClick={generatePDF}
                    >
                        Generate Report 
                    </button>
                    <button 
                        className="dash-nav_buttons"
                        onClick={doctorRegister}
                    >
                        Register Doctor
                    </button>
                    <button 
                        className="bg-red-500 hover:bg-red-800 hover:font-bold transition-all duration-200 font-semibold h-10 text-white w-24 sm:px-4 py-2 rounded"
                        onClick={handleLogout} 
                    >
                        Logout
                    </button>
                </div>
            </div>
            <div className="pt-16">
                <Statistics />
                <Appointments />
                <PersonalDetails />
                
                {error && <div className="error-message">{error}</div>} {/* Display error message if any */}

                {/* Hidden content for PDF generation */}
                <div style={{ display: 'none' }}>
                <GenerateReport 
                    ref={reportRef}
                    totalAppointments={appointments.length}
                    canceledAppointments={canceledAppointments.length}
                />
                </div>
            </div>
            </div>
    );
}

export default Dashboard;