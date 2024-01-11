package nibm.hdse241.hospitalappointmentsystem.tests;

import nibm.hdse241.hospitalappointmentsystem.services.appointmentService;
import nibm.hdse241.hospitalappointmentsystem.dto.appointmentDTO;
import nibm.hdse241.hospitalappointmentsystem.entities.Appointment;
import nibm.hdse241.hospitalappointmentsystem.entities.User;
import nibm.hdse241.hospitalappointmentsystem.repositories.appointmentRepository;
import nibm.hdse241.hospitalappointmentsystem.repositories.userRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;

public class appointmentServiceTest {

    @Mock
    private appointmentRepository appointmentRepository;

    @Mock
    private userRepository userRepository;

    @InjectMocks
    private appointmentService appointmentService;

    private appointmentDTO appointmentDTO;
    private Appointment appointment;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        // Create a sample appointmentDTO
        appointmentDTO = new appointmentDTO();
        appointmentDTO.setPatientIndex("P1-09");
        appointmentDTO.setPatientName("John Doe");
        appointmentDTO.setDoctorName("Dr. Smith");
        appointmentDTO.setPatientMobile("0771234567");
        appointmentDTO.setPatientEmail("johndoe@example.com");
        appointmentDTO.setAppointmentTime("10:30 AM");
        appointmentDTO.setAppointmentDate("2024-10-20");
        appointmentDTO.setAppointmentStatus(false);
        appointmentDTO.setNic("123456789V");
        appointmentDTO.setBirthday("1990-05-15");

        // Create a sample Appointment
        appointment = new Appointment();
        appointment.setId(1);
        appointment.setPatientIndex("P1-09");
        appointment.setPatientName("John Doe");
        appointment.setDoctorName("Dr. Smith");
        appointment.setPatientMobile("0771234567");
        appointment.setPatientEmail("johndoe@example.com");
        appointment.setAppointmentTime("10:30 AM");
        appointment.setAppointmentDate("2024-10-20");
        appointment.setCanceled(false);
    }

    // 1. Test createAppointment()
    @Test
    public void testCreateAppointment() {
        User mockUser = new User();  // Creating a mock User for the test case
        Mockito.when(userRepository.save(any(User.class))).thenReturn(mockUser);
        Mockito.when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        Appointment createdAppointment = appointmentService.createAppointment(appointmentDTO);
        Assertions.assertNotNull(createdAppointment);
        Assertions.assertEquals(appointmentDTO.getPatientName(), createdAppointment.getPatientName());
    }

    // 2. Test updateAppointment()
    @Test
    public void testUpdateAppointment() {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setFullName("John Doe");

        Appointment appointment = new Appointment();
        appointment.setId(1);
        appointment.setUser(mockUser);

        Mockito.when(userRepository.findById(anyLong())).thenReturn(Optional.of(mockUser));

        Mockito.when(appointmentRepository.findById(anyInt())).thenReturn(Optional.of(appointment));
        Mockito.when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        ResponseEntity<Appointment> response = appointmentService.updateAppointment(1, appointmentDTO);

        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
        Assertions.assertEquals(appointmentDTO.getPatientName(), response.getBody().getPatientName());
    }




    // 3. Test getAllAppointments()
    @Test
    public void testGetAllAppointments() {
        List<Appointment> appointmentList = new ArrayList<>();
        appointmentList.add(appointment);

        Mockito.when(appointmentRepository.findAll()).thenReturn(appointmentList);

        List<Appointment> result = appointmentService.getAllAppointments();
        Assertions.assertEquals(1, result.size());
        Assertions.assertEquals(appointment.getPatientName(), result.get(0).getPatientName());
    }

    // 4. Test getActiveAppointments()
    @Test
    public void testGetActiveAppointments() {
        List<Appointment> activeAppointments = new ArrayList<>();
        appointment.setCanceled(false); // Active appointment
        activeAppointments.add(appointment);

        Mockito.when(appointmentRepository.findByIsCanceledFalse()).thenReturn(activeAppointments);

        List<Appointment> result = appointmentService.getActiveAppointments();
        Assertions.assertEquals(1, result.size());
        Assertions.assertFalse(result.get(0).isCanceled());
    }

    // 5. Test getCanceledAppointments()
    @Test
    public void testGetCanceledAppointments() {
        List<Appointment> canceledAppointments = new ArrayList<>();
        appointment.setCanceled(true); // Canceled appointment
        canceledAppointments.add(appointment);

        Mockito.when(appointmentRepository.findByIsCanceledTrue()).thenReturn(canceledAppointments);

        List<Appointment> result = appointmentService.getCanceledAppointments();
        Assertions.assertEquals(1, result.size());
        Assertions.assertTrue(result.get(0).isCanceled());
    }

    // 6. Test getAppointmentById()
    @Test
    public void testGetAppointmentById() {
        Mockito.when(appointmentRepository.findById(anyInt())).thenReturn(Optional.of(appointment));

        ResponseEntity<Appointment> response = appointmentService.getAppointmentById(1);
        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
        Assertions.assertEquals(appointment.getPatientName(), response.getBody().getPatientName());
    }

    // 7. Test deleteAppointment()
    @Test
    public void testDeleteAppointment() {
        Mockito.when(appointmentRepository.findById(anyInt())).thenReturn(Optional.of(appointment));
        Mockito.doNothing().when(appointmentRepository).delete(any(Appointment.class));

        ResponseEntity<HttpStatus> response = appointmentService.deleteAppointment(1);
        Assertions.assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    // 8. Test cancelAppointment()
    @Test
    public void testCancelAppointment() {
        Mockito.when(appointmentRepository.findById(anyInt())).thenReturn(Optional.of(appointment));
        Mockito.when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        ResponseEntity<Appointment> response = appointmentService.cancelAppointment(1);
        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
        Assertions.assertTrue(response.getBody().isCanceled());
    }

    // 9. Test reviveAppointment()
    @Test
    public void testReviveAppointment() {
        appointment.setCanceled(true); // Set the appointment as canceled
        Mockito.when(appointmentRepository.findById(anyInt())).thenReturn(Optional.of(appointment));
        Mockito.when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        ResponseEntity<Appointment> response = appointmentService.reviveAppointment(1);
        Assertions.assertEquals(HttpStatus.OK, response.getStatusCode());
        Assertions.assertFalse(response.getBody().isCanceled());
    }
}
