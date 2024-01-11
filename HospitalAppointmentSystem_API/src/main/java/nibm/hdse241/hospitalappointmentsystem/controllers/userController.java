package nibm.hdse241.hospitalappointmentsystem.controllers;

import nibm.hdse241.hospitalappointmentsystem.entities.User;
import nibm.hdse241.hospitalappointmentsystem.services.userService;
import nibm.hdse241.hospitalappointmentsystem.repositories.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class userController {

    @Autowired
    private userService userService;

    // Get users with optional filtering
    @GetMapping
    public ResponseEntity<List<User>> getUsers(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String role) {
        List<User> users = userService.getUsers(username, email, role);
        return ResponseEntity.ok(users);
    }

    // Register or validate a user
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            String responseMessage = userService.registerOrValidateUser(user);
            return ResponseEntity.ok(responseMessage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error registering user: " + e.getMessage());
        }
    }

    // Find user by NIC
    @GetMapping("/nic/{nic}")
    public List<User> getUserByNic(@PathVariable String nic) {
        return userService.findUserByNic(nic);
    }


    // Find user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.findUserByEmail(email);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        boolean deleted = userService.deleteUserById(id);
        if (deleted) {
            return ResponseEntity.noContent().build(); // User deleted successfully
        }
        return ResponseEntity.notFound().build(); // User not found
    }


}
