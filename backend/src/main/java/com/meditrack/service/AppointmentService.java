package com.meditrack.service;

import com.meditrack.dto.AppointmentRequest;
import com.meditrack.dto.AppointmentResponse;
import com.meditrack.dto.DoctorResponse;
import com.meditrack.dto.StatisticsResponse;
import com.meditrack.dto.UpdateAppointmentStatusRequest;
import com.meditrack.model.Appointment;
import com.meditrack.model.Doctor;
import com.meditrack.model.Patient;
import com.meditrack.model.Role;
import com.meditrack.repository.AppointmentRepository;
import com.meditrack.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public List<DoctorResponse> getAllDoctors() {
        List<Doctor> doctors = userRepository.findAllDoctors();
        return doctors.stream()
                .map(doctor -> DoctorResponse.builder()
                        .id(doctor.getId())
                        .firstName(doctor.getFirstName() != null ? doctor.getFirstName() : "Dr.")
                        .lastName(doctor.getLastName() != null ? doctor.getLastName() : doctor.getUsername())
                        .specialization(doctor.getSpecialty())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public Appointment createAppointment(AppointmentRequest request, String username) {
        Patient patient = userRepository.findPatientByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

        Doctor doctor = (Doctor) userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found"));

        if (appointmentRepository.existsConflictingAppointment(doctor, request.getAppointmentDateTime())) {
            throw new IllegalStateException("The selected time slot is not available");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDateTime(request.getAppointmentDateTime())
                .reason(request.getReason())
                .status(Appointment.AppointmentStatus.PENDING)
                .build();

        return appointmentRepository.save(appointment);
    }

    // Sprint 3: Doctor appointment management methods
    public List<AppointmentResponse> getPendingAppointmentsByDoctorUsername(String username) {
        Doctor doctor = userRepository.findDoctorByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found"));
        List<Appointment> appointments = appointmentRepository.findPendingAppointmentsByDoctorId(doctor.getId());
        return appointments.stream()
                .map(AppointmentResponse::fromAppointment)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getApprovedAppointmentsByDoctorUsername(String username) {
        Doctor doctor = userRepository.findDoctorByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found"));
        List<Appointment> appointments = appointmentRepository.findApprovedAppointmentsByDoctorId(doctor.getId());
        return appointments.stream()
                .map(AppointmentResponse::fromAppointment)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getPendingAppointmentsByDoctor(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findPendingAppointmentsByDoctorId(doctorId);
        return appointments.stream()
                .map(AppointmentResponse::fromAppointment)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getApprovedAppointmentsByDoctor(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findApprovedAppointmentsByDoctorId(doctorId);
        return appointments.stream()
                .map(AppointmentResponse::fromAppointment)
                .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long appointmentId, UpdateAppointmentStatusRequest request, String username) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));

        Doctor doctor = userRepository.findDoctorByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found"));

        // Verify the doctor owns this appointment
        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new IllegalStateException("Unauthorized: You can only update your own appointments");
        }

        // Verify version for optimistic locking
        if (!appointment.getVersion().equals(request.getVersion())) {
            throw new IllegalStateException("Appointment has been modified by another user. Please refresh and try again.");
        }

        // Update status
        try {
            Appointment.AppointmentStatus status = Appointment.AppointmentStatus.valueOf(request.getStatus().toUpperCase());
            appointment.setStatus(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + request.getStatus());
        }

        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return AppointmentResponse.fromAppointment(updatedAppointment);
    }

    // Sprint 3: Patient appointment viewing
    public List<AppointmentResponse> getPatientAppointments(String username) {
        Patient patient = userRepository.findPatientByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

        List<Appointment> appointments = appointmentRepository.findByPatientId(patient.getId());
        return appointments.stream()
                .map(AppointmentResponse::fromAppointment)
                .collect(Collectors.toList());
    }

    // Sprint 4: Appointment cancellation
    @Transactional
    public AppointmentResponse cancelAppointment(Long appointmentId, Long version, String username) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found"));

        Patient patient = userRepository.findPatientByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found"));

        // Verify the patient owns this appointment
        if (!appointment.getPatient().getId().equals(patient.getId())) {
            throw new IllegalStateException("Unauthorized: You can only cancel your own appointments");
        }

        // Verify version for optimistic locking
        if (!appointment.getVersion().equals(version)) {
            throw new IllegalStateException("Appointment has been modified by another user. Please refresh and try again.");
        }

        // Only allow cancellation of PENDING or APPROVED appointments
        if (appointment.getStatus() != Appointment.AppointmentStatus.PENDING
            && appointment.getStatus() != Appointment.AppointmentStatus.APPROVED) {
            throw new IllegalStateException("Can only cancel PENDING or APPROVED appointments");
        }

        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return AppointmentResponse.fromAppointment(updatedAppointment);
    }

    // Sprint 4: Admin statistics
    public StatisticsResponse getStatistics() {
        return StatisticsResponse.builder()
                .totalUsers(userRepository.count())
                .totalAppointments(appointmentRepository.count())
                .pendingAppointments(appointmentRepository.countByStatus(Appointment.AppointmentStatus.PENDING))
                .approvedAppointments(appointmentRepository.countByStatus(Appointment.AppointmentStatus.APPROVED))
                .rejectedAppointments(appointmentRepository.countByStatus(Appointment.AppointmentStatus.REJECTED))
                .cancelledAppointments(appointmentRepository.countByStatus(Appointment.AppointmentStatus.CANCELLED))
                .totalDoctors(userRepository.countByRole(Role.DOCTOR))
                .totalPatients(userRepository.countByRole(Role.PATIENT))
                .build();
    }
}
