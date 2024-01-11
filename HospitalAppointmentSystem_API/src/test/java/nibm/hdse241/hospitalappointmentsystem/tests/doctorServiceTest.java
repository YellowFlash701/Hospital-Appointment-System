package nibm.hdse241.hospitalappointmentsystem.tests;

import nibm.hdse241.hospitalappointmentsystem.services.doctorService;
import nibm.hdse241.hospitalappointmentsystem.entities.Doctor;
import nibm.hdse241.hospitalappointmentsystem.repositories.doctorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class doctorServiceTest {

    @Mock
    private doctorRepository doctorRepository;

    @InjectMocks
    private doctorService doctorService;

    private Doctor doctor;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Initialize test data
        doctor = new Doctor();
        doctor.setId(1L);
        doctor.setName("Dr. Smith");
        doctor.setSpecialization("Cardiology");
        doctor.setEmail("drsmith@example.com");
        doctor.setNic("123456789V");
        doctor.setTimeSlots(Arrays.asList("10:00 AM", "2:00 PM"));
        doctor.setMobile("0771234567");
    }

    @Test
    void testSaveDoctor() {
        when(doctorRepository.save(doctor)).thenReturn(doctor);

        Doctor savedDoctor = doctorService.saveDoctor(doctor);
        assertNotNull(savedDoctor);
        assertEquals(doctor.getName(), savedDoctor.getName());

        verify(doctorRepository, times(1)).save(doctor);
    }

    @Test
    void testGetAllDoctors() {
        List<Doctor> doctors = Arrays.asList(doctor);
        when(doctorRepository.findAll()).thenReturn(doctors);

        List<Doctor> allDoctors = doctorService.getAllDoctors();
        assertEquals(1, allDoctors.size());

        verify(doctorRepository, times(1)).findAll();
    }

    @Test
    void testGetDoctorById() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));

        Doctor foundDoctor = doctorService.getDoctorById(1L);
        assertNotNull(foundDoctor);
        assertEquals(doctor.getName(), foundDoctor.getName());

        verify(doctorRepository, times(1)).findById(1L);
    }

    @Test
    void testUpdateDoctor() {
        Doctor updatedDoctorDetails = new Doctor();
        updatedDoctorDetails.setName("Dr. John Smith");
        updatedDoctorDetails.setSpecialization("Neurology");

        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));
        when(doctorRepository.save(doctor)).thenReturn(doctor);

        Doctor updatedDoctor = doctorService.updateDoctor(1L, updatedDoctorDetails);
        assertNotNull(updatedDoctor);
        assertEquals("Dr. John Smith", updatedDoctor.getName());
        assertEquals("Neurology", updatedDoctor.getSpecialization());

        verify(doctorRepository, times(1)).findById(1L);
        verify(doctorRepository, times(1)).save(doctor);
    }

    @Test
    void testDeleteDoctor() {
        doNothing().when(doctorRepository).deleteById(1L);

        doctorService.deleteDoctor(1L);

        verify(doctorRepository, times(1)).deleteById(1L);
    }

    @Test
    void testSearchDoctors() {
        List<Doctor> doctors = Arrays.asList(doctor);
        when(doctorRepository.findByNameContainingAndSpecializationContaining("Smith", "Cardiology")).thenReturn(doctors);

        List<Doctor> result = doctorService.searchDoctors("Smith", "Cardiology");
        assertEquals(1, result.size());

        verify(doctorRepository, times(1))
                .findByNameContainingAndSpecializationContaining("Smith", "Cardiology");
    }

    @Test
    void testGetDoctorsByTimeSlot() {
        List<Doctor> doctors = Arrays.asList(doctor);
        when(doctorRepository.findByTimeSlotsContaining("10:00 AM")).thenReturn(doctors);

        List<Doctor> result = doctorService.getDoctorsByTimeSlot("10:00 AM");
        assertEquals(1, result.size());

        verify(doctorRepository, times(1)).findByTimeSlotsContaining("10:00 AM");
    }

    @Test
    void testFindDoctorByEmail() {
        when(doctorRepository.findByEmail("drsmith@example.com")).thenReturn(Optional.of(doctor));

        Optional<Doctor> result = doctorService.findDoctorByEmail("drsmith@example.com");
        assertTrue(result.isPresent());
        assertEquals("drsmith@example.com", result.get().getEmail());

        verify(doctorRepository, times(1)).findByEmail("drsmith@example.com");
    }

    @Test
    void testFindDoctorByNic() {
        when(doctorRepository.findByNic("123456789V")).thenReturn(Optional.of(doctor));

        Optional<Doctor> result = doctorService.findDoctorByNic("123456789V");
        assertTrue(result.isPresent());
        assertEquals("123456789V", result.get().getNic());

        verify(doctorRepository, times(1)).findByNic("123456789V");
    }

    @Test
    void testGetTotalDoctors() {
        when(doctorRepository.count()).thenReturn(1L);

        Long totalDoctors = doctorService.getTotalDoctors();
        assertEquals(1L, totalDoctors);

        verify(doctorRepository, times(1)).count();
    }
}
