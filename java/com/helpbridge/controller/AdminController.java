package com.helpbridge.controller;

import com.helpbridge.dto.AdminDashboardSummary;
import com.helpbridge.enums.RoleType;
import com.helpbridge.model.User;
import com.helpbridge.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{role}")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable RoleType role,
            @RequestParam(required = false) String city) {
        System.out.println("Fetching users for role: " + role + " City: " + city);
        List<User> users = adminService.getUsersByRoleAndCity(role, city);
        System.out.println("Found " + users.size() + " users.");
        return ResponseEntity.ok(users);
    }

    @PostMapping("/approve/{id}")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        adminService.approveUser(id);
        return ResponseEntity.ok().body("{\"message\": \"User approved successfully\"}");
    }

    @PostMapping("/reject/{id}")
    public ResponseEntity<?> rejectUser(@PathVariable Long id) {
        adminService.rejectUser(id);
        return ResponseEntity.ok().body("{\"message\": \"User rejected\"}");
    }

    @PostMapping("/suspend/{id}")
    public ResponseEntity<?> suspendUser(@PathVariable Long id) {
        adminService.suspendUser(id);
        return ResponseEntity.ok().body("{\"message\": \"User suspended\"}");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok().body("{\"message\": \"User deleted\"}");
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<AdminDashboardSummary> getDashboardSummary() {
        return ResponseEntity.ok(adminService.getDashboardSummary());
    }

    @GetMapping("/recent-activities")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivities() {
        // Mocking activities for now as we don't have a centralized Activity Log table
        List<Map<String, Object>> activities = new ArrayList<>();
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/debug")
    public ResponseEntity<String> debug() {
        StringBuilder sb = new StringBuilder();
        try {
            sb.append("--- DEBUG INFO ---\n");
            List<User> all = adminService.getAllUsers();
            sb.append("Total Users in DB: ").append(all.size()).append("\n");
            for (User u : all) {
                sb.append("User: ").append(u.getEmail())
                        .append(" | Role: ").append(u.getRole().name())
                        .append(" | Status: ").append(u.getStatus().name())
                        .append("\n");
            }
            sb.append("--- END DEBUG ---");
            return ResponseEntity.ok(sb.toString());
        } catch (Exception e) {
            return ResponseEntity.ok("Debug Error: " + e.getMessage());
        }
    }

    @PostMapping("/seed")
    public ResponseEntity<?> seedData() {
        try {
            // Manually call the seeder
            // Since we can't easily inject DataSeeder into AdminService without a circular
            // ref if not careful,
            // or just inject it here.
            // But better to just let AdminService handle it if we move it there?
            // OR inject DataSeeder here.
            return ResponseEntity.ok(adminService.seedData());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error seeding: " + e.getMessage());
        }
    }
}
