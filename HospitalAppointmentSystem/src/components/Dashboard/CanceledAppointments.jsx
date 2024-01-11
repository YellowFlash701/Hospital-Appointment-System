/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import AppointmentService from '../../services/appointmentService';

const CanceledAppointments = () => {
  // State variables for handling appointments and filters
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [revivedAppointmentId, setRevivedAppointmentId] = useState(null);

  // Update time slots based on the selected doctor
  const fetchDoctors = async () => {
    try {
      const response = await AppointmentService.getDoctors();
      setDoctorsList(response.data); // Assuming this returns a list of doctor names
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

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

  fetchDoctors();

  // Handle change in doctor selection
  const handleDoctorChange = (e) => {
    const doctor = e.target.value;
    setSelectedDoctor(doctor);
    updateTimeSlots(doctor);
  };

  // Fetch canceled appointments when the component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await AppointmentService.getCanceledAppointments();
        setAppointments(response.data);
        setFilteredAppointments(response.data);
      } catch (error) {
        console.error('Error fetching canceled appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  // Revive a canceled appointment
  const handleRevive = async (id) => {
    try {
      await AppointmentService.reviveAppointment(id);
      
      // Update the list of canceled appointments
      const response = await AppointmentService.getCanceledAppointments();
      setAppointments(response.data);
      setFilteredAppointments(response.data);

      setRevivedAppointmentId(id);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      console.error('Error reviving appointment:', error);
    }
  };

  return (
    <div className="p-4 ml-10 mr-10 mb-10">
      {/* Filter Section */}
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2 cursor-default">Filter Appointments</h1>
        <div className='grid sm:grid-cols-4 gap-10'>
          {/* Doctor Filter */}
          <div className="sm:mb-2">
            <label className="block text-sm font-medium mb-1">Doctor:</label>
            <select
              onChange={handleDoctorChange}
              value={selectedDoctor}
              className="border border-gray-300 p-2 rounded-md w-full"
            >
              <option value="">Select a Doctor</option>
              {doctorsList.map(doctor => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </select>
          </div>

          {/* Time Slot Filter */}
          <div className="sm:mb-2">
            <label className="block text-sm font-medium mb-1">Time Slot:</label>
            <select
              onChange={(e) => setSelectedTimeSlot(e.target.value)}
              value={selectedTimeSlot}
              className="border border-gray-300 p-2 rounded-md w-full"
            >
              <option value="">Select a Time Slot</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="sm:mb-4">
            <label className="block text-sm font-medium mb-1">Date:</label>
            <input
              type="date"
              onChange={(e) => setSelectedDate(e.target.value)}
              value={selectedDate}
              className="border border-gray-300 p-2 rounded-md w-full"
            />
          </div>

          {/* Apply Filters Button */}
          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 h-[70px]"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Canceled Appointments Table */}
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
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(appointment => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.id ?? 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{appointment.patientIndex ?? 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.patientName ?? 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.doctorName ?? 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.appointmentDate ?? 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{appointment.appointmentTime ?? 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <button
                      className="bg-green-400 text-white px-3 py-1 rounded-md mr-2 hover:bg-green-500 transition-colors"
                      onClick={() => handleRevive(appointment.id)}
                    >
                      Revive
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No canceled appointments available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Revive Success Alert */}
      {showAlert && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
          Revived Successfully! ID: {revivedAppointmentId}
        </div>
      )}
    </div>
  );
};

export default CanceledAppointments;
