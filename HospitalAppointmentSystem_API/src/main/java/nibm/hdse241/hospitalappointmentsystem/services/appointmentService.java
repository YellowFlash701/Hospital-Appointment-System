package nibm.hdse241.hospitalappointmentsystem.services;

import nibm.hdse241.hospitalappointmentsystem.dto.appointmentDTO;
import nibm.hdse241.hospitalappointmentsystem.entities.Appointment;
import nibm.hdse241.hospitalappointmentsystem.entities.User;
import nibm.hdse241.hospitalappointmentsystem.repositories.appointmentRepository;
import nibm.hdse241.hospitalappointmentsystem.repositories.userRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Stack;
import java.util.stream.Collectors;

@Service
public class appointmentService {

    @Autowired
    private appointmentRepository appointmentRepository;

    @Autowired
    private userRepository userRepository;

    private Stack<Appointment> canceledAppointmentsStack = new Stack<>();

    public Appointment createAppointment(appointmentDTO appointmentDTO) {

        User user = new User();
        user.setFullName(appointmentDTO.getPatientName());
        user.setPhone(appointmentDTO.getPatientMobile());
        user.setEmail(appointmentDTO.getPatientEmail());
        user.setBirthday(appointmentDTO.getBirthday());
        user.setNic(appointmentDTO.getNic());
        user.setRegistrationDate(LocalDateTime.now());

        // Save the user entity to the database
        userRepository.save(user);

        Appointment appointment = new Appointment();
        appointment.setPatientIndex(appointmentDTO.getPatientIndex());
        appointment.setPatientName(appointmentDTO.getPatientName());
        appointment.setPatientMobile(appointmentDTO.getPatientMobile());
        appointment.setPatientEmail(appointmentDTO.getPatientEmail());
        appointment.setDoctorName(appointmentDTO.getDoctorName());
        appointment.setAppointmentTime(appointmentDTO.getAppointmentTime());
        appointment.setAppointmentDate(appointmentDTO.getAppointmentDate());
        appointment.setCanceled(appointmentDTO.isAppointmentStatus());
        appointment.setNic(appointmentDTO.getNic());
        appointment.setBirthday(appointmentDTO.getBirthday());
        appointment.setUser(user);

        // Save the appointment entity
        return appointmentRepository.save(appointment);
    }

    public ResponseEntity<Appointment> updateAppointment(int id, appointmentDTO appointmentDTO) {
        Optional<Appointment> existingAppointment = appointmentRepository.findById(id);
        if (existingAppointment.isPresent()) {
            Appointment appointment = existingAppointment.get();

            // Update linked user details
            User user = appointment.getUser();
            user.setFullName(appointmentDTO.getPatientName());
            user.setPhone(appointmentDTO.getPatientMobile());
            user.setEmail(appointmentDTO.getPatientEmail());
            userRepository.save(user);

            // Update appointment details
            appointment.setPatientIndex(appointmentDTO.getPatientIndex());
            appointment.setPatientName(appointmentDTO.getPatientName());
            appointment.setDoctorName(appointmentDTO.getDoctorName());
            appointment.setPatientMobile(appointmentDTO.getPatientMobile());
            appointment.setPatientEmail(appointmentDTO.getPatientEmail());
            appointment.setAppointmentTime(appointmentDTO.getAppointmentTime());
            appointment.setAppointmentDate(appointmentDTO.getAppointmentDate());

            return new ResponseEntity<>(appointmentRepository.save(appointment), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public List<Appointment> getActiveAppointments() {
        return appointmentRepository.findByIsCanceledFalse();
    }

    public List<Appointment> getCanceledAppointments() {
        return appointmentRepository.findByIsCanceledTrue();
    }

    public ResponseEntity<Appointment> getAppointmentById(int id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            return new ResponseEntity<>(appointment.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<HttpStatus> deleteAppointment(int id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            appointmentRepository.delete(appointment.get());
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Appointment> cancelAppointment(int id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            Appointment app = appointment.get();
            app.setCanceled(true); // Mark the appointment as canceled
            appointmentRepository.save(app); // Save to database
            canceledAppointmentsStack.push(app); // Push to stack
            return new ResponseEntity<>(app, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Appointment> reviveAppointment(int id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isPresent()) {
            Appointment app = appointment.get();
            if (app.isCanceled()) {
                canceledAppointmentsStack.remove(app); // Remove from stack if present
                app.setCanceled(false); // Mark the appointment as not canceled
                return new ResponseEntity<>(appointmentRepository.save(app), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Not canceled
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // No such appointment
        }
    }

    public ResponseEntity<Appointment> replaceAppointment(Appointment newAppointment) {
        Optional<Appointment> existingAppointment = appointmentRepository.findById(newAppointment.getId());
        if (existingAppointment.isPresent()) {
            Appointment appointment = existingAppointment.get();
            appointment.setPatientIndex(newAppointment.getPatientIndex());
            appointment.setPatientName(newAppointment.getPatientName());
            appointment.setDoctorName(newAppointment.getDoctorName());
            appointment.setPatientMobile(newAppointment.getPatientMobile());
            appointment.setPatientEmail(newAppointment.getPatientEmail());
            appointment.setAppointmentTime(newAppointment.getAppointmentTime());
            appointment.setAppointmentDate(newAppointment.getAppointmentDate());
            return new ResponseEntity<>(appointmentRepository.save(appointment), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public List<Appointment> getAppointmentsByDateAndTime(String appointmentDate, String appointmentTime) {
        return appointmentRepository.findByAppointmentDateAndAppointmentTime(appointmentDate.trim(), appointmentTime.trim());
    }

    public Long getTotalAppointments() {
        return appointmentRepository.count();
    }

    public Map<String, Long> getAppointmentsByDoctor() {
        return appointmentRepository.findAll().stream()
                .collect(Collectors.groupingBy(Appointment::getDoctorName, Collectors.counting()));
    }

    public Map<String, Long> getAppointmentsByTimeSlot() {
        return appointmentRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        appointment -> appointment.getAppointmentTime(),
                        Collectors.counting()
                ));
    }

    public Long getCanceledAppointmentsCount() {
        return appointmentRepository.countByIsCanceledTrue();
    }

    public Map<String, Long> getActiveAppointmentsByDoctor() {
        return appointmentRepository.findAll().stream()
                .filter(appointment -> !appointment.isCanceled())
                .collect(Collectors.groupingBy(Appointment::getDoctorName, Collectors.counting()));
    }

    public Map<String, Long> getActiveAppointmentsByTimeSlot() {
        return appointmentRepository.findAll().stream()
                .filter(appointment -> !appointment.isCanceled())
                .collect(Collectors.groupingBy(
                        appointment -> appointment.getAppointmentTime(),
                        Collectors.counting()
                ));
    }

    public Map<String, Long> getCanceledAppointmentsByDoctor() {
        return appointmentRepository.findAll().stream()
                .filter(appointment -> appointment.isCanceled())
                .collect(Collectors.groupingBy(Appointment::getDoctorName, Collectors.counting()));
    }

    public Map<String, Long> getCanceledAppointmentsByTimeSlot() {
        return appointmentRepository.findAll().stream()
                .filter(appointment -> appointment.isCanceled())
                .collect(Collectors.groupingBy(
                        appointment -> appointment.getAppointmentTime(),
                        Collectors.counting()
                ));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleDuplicateAppointment(RuntimeException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
