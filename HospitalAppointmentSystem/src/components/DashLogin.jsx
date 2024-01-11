import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Function to handle the login request
    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login/dash', {
                email,
                password
            });
            console.log('Login Response:', response.data); // Log response data
            
            // Make sure the role is being set correctly
            if (response.data && response.data.role) {
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('role', response.data.role);
            } else {
                console.error('Role not found in response data');
            }
            
            return response.data; // Handle successful response
        } catch (error) {
            console.error("Login failed:", error.response ? error.response.data : error.message);
            throw error; // Rethrow error for further handling
        }
    };
    

    // Function to handle form submission
    const handleLogin = async (event) => {
        event.preventDefault();
        setError(''); // Reset error state

        try {
            const result = await login(email, password);
            // Handle successful login (e.g., redirect to dashboard)
            console.log('Login successful:', result);
            navigate('/dashboard');
        } catch (error) {
            // Handle login failure
            setError('Invalid credentials or access denied.'); // Customize error message based on the response
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
                <h2 className="mb-4 text-lg font-bold">Login to Dashboard</h2>
                {error && <div className="mb-4 text-red-500">{error}</div>}
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Login</button>
            </form>
        </div>
    );
};

export default DashLogin;
