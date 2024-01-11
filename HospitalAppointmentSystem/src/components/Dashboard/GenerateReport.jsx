/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

// Import React library
import React from 'react';
import appointmentService from '../../services/appointmentService';

// ForwardRef used to pass the ref from the parent component
const GenerateReport = React.forwardRef((props, ref) => {
    // Destructure props with default values
    const {
        totalAppointments = 0,
        canceledAppointments = 0,
        appointmentsByDoctor = [],
        appointmentsByTimeSlot = [],
        generatedDate = new Date().toLocaleDateString(),
    } = props;

    // Define inline styles similar to Tailwind CSS
    const styles = {
        container: { textAlign: 'center', marginBottom: '20px' },
        heading: { fontSize: '24px', fontWeight: 'bold' },
        subHeading: { fontSize: '20px', fontWeight: 'bold' },
        paragraph: { marginBottom: '20px' },
        listItem: { marginBottom: '10px' },
        footer: { textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#9CA3AF' }, // Tailwind's text-gray-400
    };

    // Log props to check if they are correctly received
    console.log('GenerateReport Props:', {
        totalAppointments,
        canceledAppointments,
        appointmentsByDoctor,
        appointmentsByTimeSlot,
        generatedDate,
    });

    return (
        <div ref={ref}>
            <div style={styles.container}>
                <h1 style={styles.heading}>Hospital Appointment Report</h1>
                <p>Generated on: {generatedDate}</p>
                <p>Report Summary</p>
            </div>

            <div style={styles.paragraph}>
                <h2 style={styles.subHeading}>Summary</h2>
                <p>Total Appointments: {totalAppointments}</p>
                <p>Canceled Appointments: {canceledAppointments}</p>
            </div>

            <div style={styles.paragraph}>
                <h2 style={styles.subHeading}>Appointments by Doctor</h2>
                <ul>
                    {appointmentsByDoctor.length > 0 ? (
                        appointmentsByDoctor.map((doc, index) => (
                            <li key={index} style={styles.listItem}>{doc.name}: {doc.count} appointments</li>
                        ))
                    ) : (
                        <li>No appointments by doctor</li>
                    )}
                </ul>
            </div>

            <div style={styles.paragraph}>
                <h2 style={styles.subHeading}>Appointments by Time Slot</h2>
                <ul>
                    {appointmentsByTimeSlot.length > 0 ? (
                        appointmentsByTimeSlot.map((slot, index) => (
                            <li key={index} style={styles.listItem}>{slot.timeSlot}: {slot.count} appointments</li>
                        ))
                    ) : (
                        <li>No appointments by time slot</li>
                    )}
                </ul>
            </div>

            <div style={styles.footer}>
                <p>Hospital Management System</p>
            </div>
        </div>
    );
});

export default GenerateReport;
