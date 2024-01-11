import React, { useEffect, useState, useRef } from 'react';
import DoctorDetails from './DoctorDetails';
import UserDetails from './UserDetails';

function PersonalDetails() {
    
    const [error, setError] = useState(''); // State for handling errors
    const [activeTab, setActiveTab] = useState('doctors'); // State to toggle between active and canceled appointments

  return (
    <div>
        <div className="flex mt-5 border-b border-gray-300 ml-10 mr-10">
                <button
                    onClick={() => setActiveTab('doctors')}
                    className={`py-2 px-4 text-lg font-semibold ${
                        activeTab === 'doctors'
                            ? 'border-b-2 border-blue-500 transition-colors duration-300 text-blue-600'
                            : 'text-gray-600'
                    }`}
                >
                    Doctors
                </button>
                <button
                    onClick={() => setActiveTab('patients')}
                    className={`py-2 px-4 text-lg font-semibold ${
                        activeTab === 'patients'
                            ? 'border-b-2 border-blue-500 transition-colors duration-300 text-blue-600'
                            : 'text-gray-600'
                    }`}
                >
                    Patients
                </button>
            </div>
            <div className="mt-4">
                {/* Render the appropriate component based on the active tab */}
                {activeTab === 'doctors' && <DoctorDetails />}
                {activeTab === 'patients' && <UserDetails />}
            </div>
    </div>
  )
}

export default PersonalDetails
