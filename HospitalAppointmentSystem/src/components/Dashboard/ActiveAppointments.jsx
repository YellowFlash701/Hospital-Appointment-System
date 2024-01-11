/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentService from '../../services/appointmentService';
import mergeSort from '../../services/mergeSort';

const ActiveAppointments = () => {
  // State variables for managing appointments and filters
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showAlertCancel, setShowAlertCancel] = useState(false);
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [deletedAppointmentId, setDeletedAppointmentId] = useState(null);
  const [canceledAppointmentId, setCanceledAppointmentId] = useState(null);

  const navigate = useNavigate();

  // Fetch doctors and appointments on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await AppointmentService.getDoctors();
        setDoctorsList(response.data); // Assuming this returns a list of doctor names
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await AppointmentService.getActiveAppointments();
        const sortedAppointments = mergeSort(response.data);

        setAppointments(sortedAppointments);
        setFilteredAppointments(sortedAppointments);
      } catch (error) {
        console.error('Error fetching active appointments:', error);
      }
    };

    fetchDoctors();
    fetchAppointments();

    // Set an interval to fetch appointments every minute
    const interval = setInterval(fetchAppointments, 60000);
    return () => clearInterval(interval);
  }, []);

  // Function to update available time slots based on the selected doctor
  const updateTimeSlots = async (doctor) => {
    try {
      const response = await AppointmentService.getTimeSlotsByDoctor(doctor); // Assuming this returns time slots for the doctor
      setTimeSlots(response.data);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  // Function to handle filtering appointments based on selected criteria
  const handleFilter = () => {
    let filtered = appointments;

    if (selectedDoctor) {
      filtered = filtered.filter(app => app.doctorName === selectedDoctor);
    }
    if (selectedTimeSlot) {
      filtered = filtered.filter(app => app.appointmentTime === selectedTimeSlot);
    }
    if (selectedDate) {
      filtered = filtered.filter(app => app.appointmentDate === selectedDate);
    }

    setFilteredAppointments(filtered);
  };

  // Function to handle doctor selection change
  const handleDoctorChange = (e) => {
    const doctor = e.target.value;
    setSelectedDoctor(doctor);
    updateTimeSlots(doctor);
  };

  // Function to handle editing an appointment
  const handleEdit = async (id) => {
    try {
      const response = await AppointmentService.getAppointmentById(id);

      if (response && response.data) {
        navigate(`/edit-appointment/${id}`, { state: { appointment: response.data } });
      } else {
        console.error('Appointment not found');
      }
    } catch (error) {
      console.error('Error editing appointment:', error);
    }
  };

  // Function to handle deleting an appointment
  const handleDelete = async (id) => {
    try {
      await AppointmentService.deleteAppointment(id);
      const updatedAppointments = await AppointmentService.getActiveAppointments();
      const sortedAppointments = mergeSort(updatedAppointments.data);

      setAppointments(sortedAppointments);
      setFilteredAppointments(sortedAppointments);
    
      setDeletedAppointmentId(id);
      setShowAlertDelete(true);
    
      setTimeout(() => {
        setShowAlertDelete(false);
      }, 5000);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  // Function to handle canceling an appointment
  const handleCancel = async (id) => {
    try {
      await AppointmentService.cancelAppointment(id);
      const updatedAppointments = await AppointmentService.getActiveAppointments();
      const sortedAppointments = mergeSort(updatedAppointments.data);

      setAppointments(sortedAppointments);
      setFilteredAppointments(sortedAppointments);
      
      setCanceledAppointmentId(id);
      setShowAlertCancel(true);
      
      setTimeout(() => {
        setShowAlertCancel(false);
      }, 5000);
    } catch (error) {
      console.error('Error canceling appointment:', error);
    }
  };

  return (
    <div className="p-4 ml-10 mr-10 mb-10">
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2 cursor-default">Filter Appointments</h1>
        <div className='grid sm:grid-cols-4 gap-10'>
          {/* Dropdown to select a doctor */}
          <div className="sm:mb-2">
            <label className="block text-sm font-medium mb-1">Doctor:</label>
            <select
              onChange={handleDoctorChange}
              value={selectedDoctor}
              className="border border-gray-300 p-2 rounded-md w-[100%]"
            >
              <option value="">Select a Doctor</option>
              {doctorsList.map((doctor) => (
                <option key={doctor.id} value={doctor.di}>{doctor.name}</option>
              ))}
            </select>
          </div>
          {/* Dropdown to select a time slot */}
          <div className="sm:mb-2">
            <label className="block text-sm font-medium mb-1">Time Slot:</label>
            <select
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              value={selectedTimeSlot}
              className="border border-gray-300 p-2 rounded-md w-[100%]"
            >
              <option value="">Select a Time Slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
          {/* Date picker for selecting the appointment date */}
          <div className="sm:mb-4">
            <label className="block text-sm font-medium mb-1">Date:</label>
            <input
              type="date"
              onChange={(e) => setSelectedDate(e.target.value)}
              value={selectedDate}
              className="border border-gray-300 p-2 rounded-md w-[100%]"
            />
          </div>
          {/* Button to apply filters */}
          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 h-[70px]"
          >
            Apply Filters
          </button>
        </div>
      </div>
      {/* Table displaying filtered appointments */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto overflow-y-auto max-h-[340px]">
        <table className="min-w-full divide-y divide-gray-200 cursor-default">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Patient ID</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Index</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Date</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Appointment Time</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 max-h-28 overflow-y-auto">
            {filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">No appointments found</td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.id ?? 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.patientIndex}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.patientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.doctorName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.appointmentDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.appointmentTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <button
                      onClick={() => handleEdit(appointment.id)}
                      className="bg-yellow-300 px-3 py-1 rounded-md mr-2 hover:bg-yellow-400 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="bg-red-400 text-white px-3 py-1 rounded-md mr-2 hover:bg-red-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Success alert for canceling an appointment */}
      {showAlertCancel && (
        <div className="bg-yellow-500 px-4 py-2 rounded-md mt-4 fixed bottom-10 right-10 shadow-md">
          <p>Appointment with ID {canceledAppointmentId} has been canceled!</p>
        </div>
      )}
      
      {/* Success alert for deleting an appointment */}
      {showAlertDelete && (
        <div className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 fixed bottom-10 right-10 shadow-md">
          <p>Appointment with ID {deletedAppointmentId} has been deleted!</p>
        </div>
      )}
    </div>
  );
};

export default ActiveAppointments;
