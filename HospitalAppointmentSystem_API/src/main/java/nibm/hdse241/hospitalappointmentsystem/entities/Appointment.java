package nibm.hdse241.hospitalappointmentsystem.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "appointment")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String patientIndex;
    private String patientName;
    private String doctorName;
    private String patientMobile;
    private String patientEmail;
    private String appointmentTime;
    private String appointmentDate;
    private boolean isCanceled;
    private String nic;
    private String birthday;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;


    public Appointment() {
        id = 0;
        patientName = "";
        doctorName = "";
        patientMobile = "";
        patientEmail = "";
        appointmentTime = "";
        appointmentDate = "";
    }

    // Getters and setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getPatientIndex() {
        return patientIndex;
    }

    public void setPatientIndex(String patientIndex) {
        this.patientIndex = patientIndex;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getPatientMobile() {
        return patientMobile;
    }

    public void setPatientMobile(String patientMobile) {
        this.patientMobile = patientMobile;
    }

    public String getPatientEmail() {
        return patientEmail;
    }

    public void setPatientEmail(String patientEmail) {
        this.patientEmail = patientEmail;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(String appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public boolean isCanceled() {
        return isCanceled;
    }

    public void setCanceled(boolean setCanceled) {
        this.isCanceled = setCanceled;
    }

    public User getUser() {
        return user;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getBirthday() {
        return birthday;
    }

    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void updateFrom(Appointment newAppointment) {
        this.patientIndex = newAppointment.getPatientIndex();
        this.patientName = newAppointment.getPatientName();
        this.doctorName = newAppointment.getDoctorName();
        this.patientMobile = newAppointment.getPatientMobile();
        this.patientEmail = newAppointment.getPatientEmail();
        this.appointmentTime = newAppointment.getAppointmentTime();
        this.appointmentDate = newAppointment.getAppointmentDate();
        this.isCanceled = newAppointment.isCanceled();
        this.nic = newAppointment.getNic();
        this.birthday = newAppointment.getBirthday();
    }
}

// [ai:2026-07-23] Implement validation for appointment dates
