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
}
