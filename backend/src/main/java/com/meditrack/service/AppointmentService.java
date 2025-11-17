package com.meditrack.service;

import com.meditrack.dto.AppointmentRequest;
import com.meditrack.dto.DoctorResponse;
import com.meditrack.model.Appointment;
import com.meditrack.model.Doctor;
import com.meditrack.model.Patient;
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
        Patient patient = (Patient) userRepository.findByUsername(username)
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
}
