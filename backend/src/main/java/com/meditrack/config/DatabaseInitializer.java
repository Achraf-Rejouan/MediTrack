package com.meditrack.config;

import com.meditrack.model.Admin;
import com.meditrack.model.Doctor;
import com.meditrack.model.Role;
import com.meditrack.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DatabaseInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create admin if not exists
            if (!userRepository.existsByUsername("admin")) {
                Admin admin = new Admin();
                admin.setUsername("admin");
                admin.setEmail("admin@meditrack.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
            }

            // Create doctor if not exists
            if (!userRepository.existsByUsername("doctor")) {
                Doctor doctor = new Doctor();
                doctor.setUsername("doctor");
                doctor.setEmail("doctor@meditrack.com");
                doctor.setPassword(passwordEncoder.encode("doctor123"));
                doctor.setRole(Role.DOCTOR);
                doctor.setSpecialty("General Medicine");
                userRepository.save(doctor);
            }
        };
    }
}
