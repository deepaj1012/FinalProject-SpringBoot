package com.helpbridge.util;

import com.helpbridge.enums.RoleType;
import com.helpbridge.enums.UserStatus;
import com.helpbridge.model.User;
import com.helpbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seed();
    }

    public void seed() {
        // Only ensure Admin exists. Do not re-create deleted test users.
        if (userRepository.findByEmail("admin@helpbridge.com").isEmpty()) {
            createOrUpdateUser("admin@helpbridge.com", "System Admin", "admin123", RoleType.Admin, "Admin City");
        }

        // Commented out test users to prevent them from reappearing after deletion
        /*
         * createOrUpdateUser("donor@test.com", "Test Donor", "12345678",
         * RoleType.Donor, "Mumbai");
         * createOrUpdateUser("ngo@test.com", "Test NGO", "12345678", RoleType.NGO,
         * "Pune");
         * createOrUpdateUser("volunteer@test.com", "Test Volunteer Delhi", "12345678",
         * RoleType.Volunteer, "Delhi");
         * createOrUpdateUser("volunteer2@test.com", "Test Volunteer Pune", "12345678",
         * RoleType.Volunteer, "Pune");
         * createOrUpdateUser("volunteer3@test.com", "Rahul Sharma (Delhi)", "12345678",
         * RoleType.Volunteer, "Delhi");
         * createOrUpdateUser("student@test.com", "Test Student", "12345678",
         * RoleType.Student, "Bangalore");
         */
        System.out.println("Seeding completed.");
    }

    private void createOrUpdateUser(String email, String name, String password, RoleType role, String city) {
        User user = userRepository.findByEmail(email).orElse(new User());
        user.setFullName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(role);
        user.setStatus(UserStatus.Approved);
        user.setCity(city);
        userRepository.save(user);
        System.out.println("User processed (Created/Updated): " + email + " | Role: " + role);
    }
}
