package nibm.hdse241.hospitalappointmentsystem.controllers;

import nibm.hdse241.hospitalappointmentsystem.dto.appointmentDTO;
import nibm.hdse241.hospitalappointmentsystem.entities.Appointment;
import nibm.hdse241.hospitalappointmentsystem.services.appointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController // Marks this class as a REST controller
@RequestMapping("/api/appointments") // Base URL for all endpoints in this controller
@CrossOrigin(origins = "http://localhost:5173") // Allows cross-origin requests from the specified origin
public class appointmentController {

    @Autowired // Automatically injects the appointmentService bean
    private appointmentService appointmentService;

    // Endpoint to get all appointments
    @GetMapping("")
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    // Endpoint to create a new appointment
    @PostMapping("")
    public Appointment newAppointment(@RequestBody appointmentDTO appointmentDTO) {
        return appointmentService.createAppointment(appointmentDTO);
    }

    // Endpoint to update an existing appointment by ID
    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable int id, @RequestBody appointmentDTO appointmentDTO) {
        return appointmentService.updateAppointment(id, appointmentDTO);
    }

    // Endpoint to delete an appointment by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAppointment(@PathVariable int id) {
        return appointmentService.deleteAppointment(id).getStatusCode() == HttpStatus.NO_CONTENT ?
                new ResponseEntity<>("Deleted!", HttpStatus.NO_CONTENT) :
                new ResponseEntity<>("Not Found", HttpStatus.NOT_FOUND);
    }

    // Endpoint to get a specific appointment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable int id) {
        return appointmentService.getAppointmentById(id);
    }

    // Endpoint to search for appointments by date and time
    @GetMapping("/search")
    public List<Appointment> getAppointmentsByDateAndTime(
            @RequestParam("appointmentDate") String appointmentDate,
            @RequestParam("appointmentTime") String appointmentTime) {
        return appointmentService.getAppointmentsByDateAndTime(appointmentDate, appointmentTime);
    }

    // Endpoint to get all active appointments
    @GetMapping("/active")
    public List<Appointment> getActiveAppointments() {
        return appointmentService.getActiveAppointments();
    }

    // Endpoint to get all canceled appointments
    @GetMapping("/canceled")
    public List<Appointment> getCanceledAppointments() {
        return appointmentService.getCanceledAppointments();
    }

    // Endpoint to cancel an appointment by ID
    @PutMapping("/cancel/{id}")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable int id) {
        return appointmentService.cancelAppointment(id);
    }

    // Endpoint to revive the last canceled appointment
    @PutMapping("/revive/{id}")
    public ResponseEntity<Appointment> reviveAppointment(@PathVariable int id) {
        return appointmentService.reviveAppointment(id);
    }

    // Endpoint to replace an existing appointment with a new one
    @PutMapping("/replace")
    public ResponseEntity<Appointment> replaceAppointment(@RequestBody Appointment newAppointment) {
        return appointmentService.replaceAppointment(newAppointment);
    }

    // Endpoint to get total number of appointments
    @GetMapping("/total")
    public Long getTotalAppointments() {
        return appointmentService.getTotalAppointments();
    }

    // Endpoint to get all appointments grouped by doctor
    @GetMapping("/by_doctor")
    public ResponseEntity<?> getAppointmentsByDoctor() {
        try {
            Map<String, Long> appointmentsByDoctor = appointmentService.getAppointmentsByDoctor();
            return ResponseEntity.ok(appointmentsByDoctor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching appointments by doctor");
        }
    }

    // Endpoint to get all appointments grouped by time slot
    @GetMapping("/by_time_slot")
    public ResponseEntity<?> getAppointmentsByTimeSlot() {
        try {
            Map<String, Long> appointmentsByTimeSlot = appointmentService.getAppointmentsByTimeSlot();
            return ResponseEntity.ok(appointmentsByTimeSlot);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching appointments by time slot");
        }
    }

    // Endpoint to get the count of canceled appointments
    @GetMapping("/canceled_count")
    public Long getCanceledAppointmentsCount() {
        return appointmentService.getCanceledAppointmentsCount();
    }

    // Endpoint to get active appointments grouped by doctor
    @GetMapping("/active/by_doctor")
    public ResponseEntity<?> getActiveAppointmentsByDoctor() {
        try {
            Map<String, Long> activeAppointmentsByDoctor = appointmentService.getActiveAppointmentsByDoctor();
            return ResponseEntity.ok(activeAppointmentsByDoctor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching appointments by doctor");
        }
    }

    // Endpoint to get active appointments grouped by time slot
    @GetMapping("/active/by_time_slot")
    public ResponseEntity<?> getActiveAppointmentsByTimeSlot() {
        try {
            Map<String, Long> activeAppointmentsByTimeSlot = appointmentService.getActiveAppointmentsByTimeSlot();
            return ResponseEntity.ok(activeAppointmentsByTimeSlot);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching appointments by time slot");
        }
    }

    // Endpoint to get canceled appointments grouped by doctor
    @GetMapping("/canceled/by_doctor")
    public ResponseEntity<?> getCanceledAppointmentsByDoctor() {
        try {
            Map<String, Long> canceledAppointmentsByDoctor = appointmentService.getCanceledAppointmentsByDoctor();
            return ResponseEntity.ok(canceledAppointmentsByDoctor);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching appointments by doctor");
        }
    }

    // Endpoint to get canceled appointments grouped by time slot
    @GetMapping("/canceled/by_time_slot")
    public ResponseEntity<?> getCanceledAppointmentsByTimeSlot() {
        try {
            Map<String, Long> canceledAppointmentsByTimeSlot = appointmentService.getCanceledAppointmentsByTimeSlot();
            return ResponseEntity.ok(canceledAppointmentsByTimeSlot);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching appointments by time slot");
        }
    }
}

// [ai:2026-07-23] Validate input before persisting to DB
