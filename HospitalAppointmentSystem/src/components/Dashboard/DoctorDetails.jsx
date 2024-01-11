import React, { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService.jsx'; // Ensure this path is correct

const DoctorDetails = () => {
    const [doctors, setDoctors] = useState([]);
    const [showAlertDelete, setShowAlertDelete] = useState(false);
    const [deletedDoctorId, setDeletedDoctorId] = useState(null);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [nic, setNic] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        try {
            const response = await doctorService.getDoctors();
            setDoctors(response.data);
            setFilteredDoctors(response.data); 
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await doctorService.deleteDoctor(id); // Assuming you have a deleteUser method
            setDeletedDoctorId(id);
            setShowAlertDelete(true);
            loadDoctors(); // Reload users after deletion
            setTimeout(() => {
                setShowAlertDelete(false);
            }, 5000);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleFilter = () => {
        const filtered = doctors.filter(doctor => 
            (doctor.nic && doctor.nic.toLowerCase().includes(nic.toLowerCase())) || 
            (doctor.email && doctor.email.toLowerCase().includes(email.toLowerCase()))
        );
        setFilteredDoctors(filtered);
    };

    const handleNicChange = (e) => {
        setNic(e.target.value);
        handleFilter();
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        handleFilter();
    };

    return (
        <div className="p-4 ml-10 mr-10 mb-10">
            <div className="mb-4">
                <div className="mb-4">
                    <h1 className="text-xl font-bold mb-2 cursor-default">Filter Doctors</h1>
                    <div className='grid sm:grid-cols-3 gap-10'>
                        <div className='sm:mb-2'>
                            <label className="block text-sm font-medium mb-1">NIC:</label>
                            <input 
                            type="text" 
                            placeholder="Filter by NIC" 
                            value={nic}
                            className="border border-gray-300 p-2 rounded-md w-[100%]"
                            onChange={handleNicChange} 
                            />
                        </div>
                        <div className='sm:mb-2'>
                            <label className="block text-sm font-medium mb-1">Email:</label>
                            <input 
                            type="text" 
                            placeholder="Filter by Email" 
                            value={email}
                            className="border border-gray-300 p-2 rounded-md w-[100%]"
                            onChange={handleEmailChange} 
                            />
                        </div>
                        <button
                            onClick={handleFilter}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 h-[70px]"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg overflow-x-auto max-h-[340px]">
                    <table className="min-w-full divide-y divide-gray-200 cursor-default">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">NIC</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 max-h-28 overflow-y-auto">
                            {filteredDoctors.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center p-4 text-gray-500">No doctors found</td>
                                </tr>
                            ) : (
                                filteredDoctors.map(doctor => (
                                    <tr key={doctor.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.name ?? 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.specialization ?? 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.email ?? 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.nic ?? 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                            <button
                                                onClick={() => handleDelete(doctor.id)}
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

                {/* Alert for deleted user */}
                {showAlertDelete && (
                    <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md">
                        Doctor {deletedDoctorId} has been deleted successfully!
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDetails;
