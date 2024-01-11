import React, { useEffect, useState } from 'react';
import AppointmentService from '../../services/appointmentService';

const Statistics = () => {
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [appointmentsByDoctor, setAppointmentsByDoctor] = useState({});
  const [appointmentsByTimeSlot, setAppointmentsByTimeSlot] = useState({});
  const [canceledAppointments, setCanceledAppointments] = useState(0);
  const [activeAppointmentsByDoctor, setActiveAppointmentsByDoctor] = useState({});
  const [activeAppointmentsByTimeSlot, setActiveAppointmentsByTimeSlot] = useState({});
  const [canceledAppointmentsByDoctor, setCanceledAppointmentsByDoctor] = useState({});
  const [canceledAppointmentsByTimeSlot, setCanceledAppointmentsByTimeSlot] = useState({});

  const fetchStatistics = async () => {
    try {
      // Total Appointments
      const totalResponse = await AppointmentService.getTotalAppointments();
      setTotalAppointments(totalResponse.data || 0);

      // Appointments by Doctor
      const doctorResponse = await AppointmentService.getAppointmentsByDoctor();
      setAppointmentsByDoctor(doctorResponse.data || {});

      // Appointments by Time Slot
      const timeSlotResponse = await AppointmentService.getAppointmentsByTimeSlot();
      setAppointmentsByTimeSlot(timeSlotResponse.data || {});

      // Canceled Appointments
      const canceledResponse = await AppointmentService.getCanceledAppointmentsCount();
      setCanceledAppointments(canceledResponse.data || 0);

      // Active Appointments by Doctor
      const activeDoctorResponse = await AppointmentService.getActiveAppointmentsByDoctor();
      setActiveAppointmentsByDoctor(activeDoctorResponse.data || {});

      // Active Appointments by Time Slot
      const activeTimeSlotResponse = await AppointmentService.getActiveAppointmentsByTimeSlot();
      setActiveAppointmentsByTimeSlot(activeTimeSlotResponse.data || {});

      // Canceled Appointments by Doctor
      const canceledDoctorResponse = await AppointmentService.getCanceledAppointmentsByDoctor();
      setCanceledAppointmentsByDoctor(canceledDoctorResponse.data || {});

      // Canceled Appointments by Time Slot
      const canceledTimeSlotResponse = await AppointmentService.getCanceledAppointmentsByTimeSlot();
      setCanceledAppointmentsByTimeSlot(canceledTimeSlotResponse.data || {});
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    fetchStatistics();
    const interval = setInterval(fetchStatistics, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 cursor-default ml-10 mr-10 mt-10">
        {/* Total Appointments */}
        <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
          <h2 className="text-lg font-bold">Total Appointments</h2>
          <p className="text-3xl font-bold">{totalAppointments || 0}</p>
        </div>

        {/* Canceled Appointments */}
        <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
          <h2 className="text-lg font-bold">Canceled Appointments</h2>
          <p className="text-3xl font-bold">{canceledAppointments || 0}</p>
        </div>

        {/* Appointments by Doctor */}
        <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
          <h2 className="text-lg font-bold">Appointments by Doctor</h2>
          <ul>
            {appointmentsByDoctor && Object.entries(appointmentsByDoctor).length > 0 ? (
              Object.entries(appointmentsByDoctor).map(([doctor, count]) => (
                <li key={doctor} className="text-sm">{doctor}: <span className='font-bold'>{count}</span></li>
              ))
            ) : (
              <li>No data available</li>
            )}
          </ul>
        </div>

        {/* Appointments by Time Slot */}
        <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
          <h2 className="text-lg font-bold">Appointments by Time Slot</h2>
          <ul>
            {appointmentsByTimeSlot && Object.entries(appointmentsByTimeSlot).length > 0 ? (
              Object.entries(appointmentsByTimeSlot).map(([slot, count]) => (
                <li key={slot} className="text-sm">{slot}: <span className='font-bold'>{count}</span></li>
              ))
            ) : (
              <li>No data available</li>
            )}
          </ul>
        </div>

        {/* Active Appointments by Doctor */}
        <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
          <h2 className="text-lg font-bold">Active Appointments by Doctor</h2>
          <ul>
            {activeAppointmentsByDoctor && Object.entries(activeAppointmentsByDoctor).length > 0 ? (
              Object.entries(activeAppointmentsByDoctor).map(([doctor, count]) => (
                <li key={doctor} className="text-sm">{doctor}: <span className='font-bold'>{count}</span></li>
              ))
            ) : (
              <li>No data available</li>
            )}
          </ul>
        </div>

        {/* Active Appointments by Time Slot */}
        <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
          <h2 className="text-lg font-bold">Active Appointments by Time Slot</h2>
          <ul>
            {activeAppointmentsByTimeSlot && Object.entries(activeAppointmentsByTimeSlot).length > 0 ? (
              Object.entries(activeAppointmentsByTimeSlot).map(([slot, count]) => (
                <li key={slot} className="text-sm">{slot}: <span className='font-bold'>{count}</span></li>
              ))
            ) : (
              <li>No data available</li>
            )}
          </ul>
        </div>

        {/* Canceled Appointments by Doctor */}
        <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
          <h2 className="text-lg font-bold">Canceled Appointments by Doctor</h2>
          <ul>
            {canceledAppointmentsByDoctor && Object.entries(canceledAppointmentsByDoctor).length > 0 ? (
              Object.entries(canceledAppointmentsByDoctor).map(([doctor, count]) => (
                <li key={doctor} className="text-sm">{doctor}: <span className='font-bold'>{count}</span></li>
              ))
            ) : (
              <li>No data available</li>
            )}
          </ul>
        </div>

        {/* Canceled Appointments by Time Slot */}
        <div className="bg-cyan-400 text-white shadow-md rounded-lg p-4 hover-scale-none transition-transform sm:hover-scale-up">
          <h2 className="text-lg font-bold">Canceled Appointments by Time Slot</h2>
          <ul>
            {canceledAppointmentsByTimeSlot && Object.entries(canceledAppointmentsByTimeSlot).length > 0 ? (
              Object.entries(canceledAppointmentsByTimeSlot).map(([slot, count]) => (
                <li key={slot} className="text-sm">{slot}: <span className='font-bold'>{count}</span></li>
              ))
            ) : (
              <li>No data available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
