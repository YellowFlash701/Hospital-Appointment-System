package nibm.hdse241.hospitalappointmentsystem.controllers;

import nibm.hdse241.hospitalappointmentsystem.entities.Doctor;
import nibm.hdse241.hospitalappointmentsystem.services.doctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173") // Allows cross-origin requests from the specified origin
public class doctorController {

    @Autowired
    private doctorService doctorService;

    // Create a new doctor
    @PostMapping
    public ResponseEntity<Doctor> registerDoctor(@RequestBody Doctor doctor) {
        Doctor savedDoctor = doctorService.saveDoctor(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDoctor);
    }

    // Get all doctors
    @GetMapping("")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    // Get a doctor by ID
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Doctor>> getDoctorById(@PathVariable Long id) {
        Optional<Doctor> doctor = Optional.ofNullable(doctorService.getDoctorById(id));
        return ResponseEntity.ok(doctor);
    }

    // Update a doctor by ID
    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctorDetails) {
        Doctor updatedDoctor = doctorService.updateDoctor(id, doctorDetails);
        return ResponseEntity.ok(updatedDoctor);
    }

    // Delete a doctor by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }

    // Search for doctors by name and specialization
    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> searchDoctors(
            @RequestParam String name, @RequestParam String specialization) {
        List<Doctor> doctors = doctorService.searchDoctors(name, specialization);
        return ResponseEntity.ok(doctors);
    }

    // Get doctors by time slot
    @GetMapping("/by_time_slot")
    public ResponseEntity<List<Doctor>> getDoctorsByTimeSlot(@RequestParam String timeSlot) {
        List<Doctor> doctors = doctorService.getDoctorsByTimeSlot(timeSlot);
        return ResponseEntity.ok(doctors);
    }

    // Get the total number of doctors
    @GetMapping("/total")
    public ResponseEntity<Long> getTotalDoctors() {
        Long totalDoctors = doctorService.getTotalDoctors();
        return ResponseEntity.ok(totalDoctors);
    }

    // Find doctor by NIC
    @GetMapping("/{nic}")
    public ResponseEntity<Doctor> getDoctorByNic(@PathVariable String nic) {
        Optional<Doctor> doctor = doctorService.findDoctorByNic(nic);
        return doctor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Find doctor by email
    @GetMapping("/{email}")
    public ResponseEntity<Doctor> getDoctorByEmail(@PathVariable String email) {
        Optional<Doctor> doctor = doctorService.findDoctorByEmail(email);
        return doctor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
