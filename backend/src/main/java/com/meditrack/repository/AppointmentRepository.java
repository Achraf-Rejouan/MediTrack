package com.meditrack.repository;

import com.meditrack.model.Appointment;
import com.meditrack.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.doctor = :doctor " +
           "AND a.appointmentDateTime = :dateTime AND a.status NOT IN ('CANCELLED', 'REJECTED')")
    boolean existsConflictingAppointment(@Param("doctor") Doctor doctor,
                                       @Param("dateTime") LocalDateTime dateTime);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByPatientId(Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.status = 'PENDING' ORDER BY a.appointmentDateTime ASC")
    List<Appointment> findPendingAppointmentsByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.status = 'APPROVED' ORDER BY a.appointmentDateTime ASC")
    List<Appointment> findApprovedAppointmentsByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.status = :status")
    Long countByStatus(@Param("status") Appointment.AppointmentStatus status);

    @Query("SELECT COUNT(DISTINCT a.patient.id) FROM Appointment a")
    Long countDistinctPatients();

    @Query("SELECT COUNT(DISTINCT a.doctor.id) FROM Appointment a")
    Long countDistinctDoctors();
}
