# Hospital Appointment System

This project is a Hospital Appointment Management System designed to help manage hospital appointments effectively. The system consists of a backend API and a frontend application.

## Prerequisites

Before you begin, make sure you have the following software installed on your system:

- **XAMPP** (for MySQL and phpMyAdmin)
- **Visual Studio Code** (for frontend development)
- **IntelliJ IDEA** (for backend development)
- **Tomcat Server** (optional but recommended for running the application)

## Getting Started

### Step 1: Run MySQL

1. **Open XAMPP**
2. Start `Apachi` server and `MySQL`.

### Step 2: Run the Backend API

1. **Open IntelliJ IDEA**.
2. Navigate to the project directory and open the `HospitalAppointmentSystem_API` folder.
3. Run the application by clicking on the `Run` button in IntelliJ IDEA or by using the `Shift + F10` shortcut.

### Step 3: Run the Frontend Application

1. **Open Visual Studio Code**.
2. Navigate to the project directory and open the `HospitalAppointmentSystem` folder.
3. Open the terminal in Visual Studio Code.
4. Run the following command to start the frontend application:
   ```bash
   npm run dev
   ```
5. After running the command, a link will appear in the terminal. It will look something like this:
   ```
   https://localhost:5173
   ```
6. Click on the link or paste it into your web browser.

### Step 4: Access the Admin Panel

1. Once you are redirected to the homepage, the URL will look like this:
   ```
   https://localhost:5173/home
   ```
2. To access the admin panel, simply replace `/home` with `/appointment-dash` in the URL:
   ```
   https://localhost:5173/dashboard
   ```

You will now be redirected to the admin panel where you can manage appointments.

## Additional Information

- Make sure that both the backend API and frontend application are running simultaneously.
- The backend API interacts with the MySQL database, which can be managed using phpMyAdmin provided by XAMPP.

## Contact

For any issues or questions, please contact the project maintainer at [isuranga880@gmail.com](mailto:isuranga880@gmail.com).

