import React, { useEffect, useState } from 'react';
import userService from '../../services/userService.jsx';

const UserDetails = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showAlertDelete, setShowAlertDelete] = useState(false);
    const [deletedUserId, setDeletedUserId] = useState(null);
    const [nic, setNic] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        handleFilter();
    }, [nic, email]);

    const loadUsers = async () => {
        try {
            const response = await userService.getUsers();
            const filteredUsers = response.data.filter(user => user.role == null && user.username !== null);
            setUsers(filteredUsers);
            setFilteredUsers(filteredUsers); 
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleDelete = async (userId) => {
        try {
            await userService.deleteUser(userId);
            setDeletedUserId(userId);
            setShowAlertDelete(true);
            setTimeout(() => {
                setShowAlertDelete(false);
            }, 5000);
            loadUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleFilter = () => {
        const filtered = users.filter(user => 
            (user.nic?.toLowerCase() || '').includes(nic.toLowerCase()) || 
            (user.email?.toLowerCase() || '').includes(email.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    return (
        <div className="p-4 ml-10 mr-10 mb-10">
            <div className="mb-4">
                <div className="mb-4">
                    <h1 className="text-xl font-bold mb-2 cursor-default">Filter Users</h1>
                    <div className='grid sm:grid-cols-3 gap-10'>
                        <div className='sm:mb-2'>
                            <label className="block text-sm font-medium mb-1">NIC:</label>
                            <input 
                                type="text" 
                                placeholder="Filter by NIC" 
                                value={nic}
                                className="border border-gray-300 p-2 rounded-md w-[100%]"
                                onChange={(e) => setNic(e.target.value)}
                            />
                        </div>
                        <div className='sm:mb-2'>
                            <label className="block text-sm font-medium mb-1">Email:</label>
                            <input 
                                type="text" 
                                placeholder="Filter by Email" 
                                value={email}
                                className="border border-gray-300 p-2 rounded-md w-[100%]"
                                onChange={(e) => setEmail(e.target.value)}
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
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">NIC</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Birthday</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Registry Date</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 max-h-28 overflow-y-auto">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center p-4 text-gray-500">No users found</td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.fullName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.nic ?? 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.birthday ?? 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.registrationDate ?? 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleDelete(user.id)}
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
            </div>

            {showAlertDelete && (
                <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md">
                    User {deletedUserId} has been deleted successfully!
                </div>
            )}
        </div>
    );
};

export default UserDetails;
