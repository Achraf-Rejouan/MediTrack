package com.meditrack.controller;

import com.meditrack.dto.AppointmentRequest;
import com.meditrack.dto.AppointmentResponse;
import com.meditrack.dto.DoctorResponse;
import com.meditrack.dto.StatisticsResponse;
import com.meditrack.dto.UpdateAppointmentStatusRequest;
import com.meditrack.model.Appointment;
import com.meditrack.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponse>> getDoctors() {
        List<DoctorResponse> doctors = appointmentService.getAllDoctors();
        return ResponseEntity.ok(doctors);
    }

    @PostMapping("/appointments")
    public ResponseEntity<Appointment> createAppointment(
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        Appointment appointment = appointmentService.createAppointment(request, username);
        return new ResponseEntity<>(appointment, HttpStatus.CREATED);
    }

    // Sprint 3: Doctor endpoints
    @GetMapping("/appointments/doctor/pending")
    public ResponseEntity<List<AppointmentResponse>> getPendingAppointments(Authentication authentication) {
        String username = authentication.getName();
        List<AppointmentResponse> appointments = appointmentService.getPendingAppointmentsByDoctorUsername(username);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/appointments/doctor/approved")
    public ResponseEntity<List<AppointmentResponse>> getApprovedAppointments(Authentication authentication) {
        String username = authentication.getName();
        List<AppointmentResponse> appointments = appointmentService.getApprovedAppointmentsByDoctorUsername(username);
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAppointmentStatusRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        AppointmentResponse appointment = appointmentService.updateAppointmentStatus(id, request, username);
        return ResponseEntity.ok(appointment);
    }

    // Sprint 3: Patient endpoints
    @GetMapping("/appointments/my-appointments")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(Authentication authentication) {
        String username = authentication.getName();
        List<AppointmentResponse> appointments = appointmentService.getPatientAppointments(username);
        return ResponseEntity.ok(appointments);
    }

    // Sprint 4: Cancel appointment
    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<AppointmentResponse> cancelAppointment(
            @PathVariable Long id,
            @RequestParam Long version,
            Authentication authentication) {
        String username = authentication.getName();
        AppointmentResponse appointment = appointmentService.cancelAppointment(id, version, username);
        return ResponseEntity.ok(appointment);
    }

    // Sprint 4: Admin statistics endpoint
    @GetMapping("/admin/statistics")
    public ResponseEntity<StatisticsResponse> getStatistics() {
        StatisticsResponse statistics = appointmentService.getStatistics();
        return ResponseEntity.ok(statistics);
    }
}
