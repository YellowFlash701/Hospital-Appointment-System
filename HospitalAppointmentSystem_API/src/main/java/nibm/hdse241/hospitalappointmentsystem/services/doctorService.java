package nibm.hdse241.hospitalappointmentsystem.services;

import nibm.hdse241.hospitalappointmentsystem.entities.Doctor;
import nibm.hdse241.hospitalappointmentsystem.repositories.doctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class doctorService {

    @Autowired
    private doctorRepository doctorRepository;

    // Save a new doctor
    public Doctor saveDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // Get all doctors
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // Get a doctor by ID
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + id));
    }

    // Update a doctor by ID
    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
        Doctor doctor = getDoctorById(id);
        doctor.setName(doctorDetails.getName());
        doctor.setSpecialization(doctorDetails.getSpecialization());
        doctor.setTimeSlots(doctorDetails.getTimeSlots());
        return doctorRepository.save(doctor);
    }

    // Delete a doctor by ID
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    // Search for doctors by name and specialization
    public List<Doctor> searchDoctors(String name, String specialization) {
        return doctorRepository.findByNameContainingAndSpecializationContaining(name, specialization);
    }

    // Get doctors by time slot
    public List<Doctor> getDoctorsByTimeSlot(String timeSlot) {
        return doctorRepository.findByTimeSlotsContaining(timeSlot);
    }
    // Find doctor by email
    public Optional<Doctor> findDoctorByEmail(String email) {
        return doctorRepository.findByEmail(email);
    }

    // Find doctor by NIC
    public Optional<Doctor> findDoctorByNic(String nic) {
        return doctorRepository.findByNic(nic);
    }


    // Get the total number of doctors
    public Long getTotalDoctors() {
        return doctorRepository.count();
    }
}
