package com.helpbridge.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSchemaFixer implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Running Database Schema Fixer...");
        try {
            // Fix 'status' column in 'service_requests' table to allow new Enum values.
            // Changing to VARCHAR(50) ensures flexibility.
            jdbcTemplate.execute("ALTER TABLE service_requests MODIFY COLUMN status VARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN role VARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE users MODIFY COLUMN status VARCHAR(50)");
            System.out.println("Schema Fix Success: service_requests and users tables updated.");
        } catch (Exception e) {
            System.out.println("Schema Fix Warning (might already be fixed): " + e.getMessage());
        }
    }
}
