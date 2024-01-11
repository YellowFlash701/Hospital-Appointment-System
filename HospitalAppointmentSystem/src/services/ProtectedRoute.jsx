import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('role');

    if (!isAuthenticated) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login-dash" />;
    }

    if (allowedRole && userRole !== allowedRole) {
        // If authenticated but role is not allowed, redirect to access denied page
        // return <Navigate to="/access-denied" />;
    }

    // Render the child components if authenticated and role is allowed
    return <Outlet />;
};

export default ProtectedRoute;
