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

            // Create doctor1 if not exists
            if (!userRepository.existsByUsername("doctor1")) {
                Doctor doctor1 = new Doctor();
                doctor1.setUsername("doctor1");
                doctor1.setEmail("doctor1@meditrack.com");
                doctor1.setPassword(passwordEncoder.encode("doctor123"));
                doctor1.setRole(Role.DOCTOR);
                doctor1.setFirstName("John");
                doctor1.setLastName("Smith");
                doctor1.setSpecialty("General Medicine");
                userRepository.save(doctor1);
            }

            // Create doctor2 if not exists
            if (!userRepository.existsByUsername("doctor2")) {
                Doctor doctor2 = new Doctor();
                doctor2.setUsername("doctor2");
                doctor2.setEmail("doctor2@meditrack.com");
                doctor2.setPassword(passwordEncoder.encode("doctor123"));
                doctor2.setRole(Role.DOCTOR);
                doctor2.setFirstName("Sarah");
                doctor2.setLastName("Johnson");
                doctor2.setSpecialty("Cardiology");
                userRepository.save(doctor2);
            }

            // Create doctor3 if not exists
            if (!userRepository.existsByUsername("doctor3")) {
                Doctor doctor3 = new Doctor();
                doctor3.setUsername("doctor3");
                doctor3.setEmail("doctor3@meditrack.com");
                doctor3.setPassword(passwordEncoder.encode("doctor123"));
                doctor3.setRole(Role.DOCTOR);
                doctor3.setFirstName("Michael");
                doctor3.setLastName("Brown");
                doctor3.setSpecialty("Neurology");
                userRepository.save(doctor3);
            }
        };
    }
}
