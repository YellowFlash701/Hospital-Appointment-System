package nibm.hdse241.hospitalappointmentsystem.controllers;

import nibm.hdse241.hospitalappointmentsystem.entities.User;
import nibm.hdse241.hospitalappointmentsystem.services.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class authController {

    @Autowired
    private userService userService;

    @PostMapping("/login/dash")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        System.out.println("Received login request: " + loginRequest); // Log the request

        // Fetch user by email
        Optional<User> userOptional = userService.findUserByEmail(loginRequest.getEmail());

        // Check if the user exists and the password matches
        if (userOptional.isEmpty() || !loginRequest.getPassword().equals(userOptional.get().getPassword())) {
            // Return unauthorized response if login credentials are incorrect
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        User user = userOptional.get();

        // Check if the user has the admin role
        if (!user.getRole().equals("admin")) {
            return ResponseEntity.status(403).body("Access denied: Admins only");
        }

        // If login is successful, return a response with the user's role and a success message
        return ResponseEntity.ok(new LoginResponse("Login successful", user.getRole()));
    }

    // Inner class to define the response structure
    public static class LoginResponse {
        private String message;
        private String role;

        public LoginResponse(String message, String role) {
            this.message = message;
            this.role = role;
        }

        // Getters
        public String getMessage() {
            return message;
        }

        public String getRole() {
            return role;
        }
    }
}
