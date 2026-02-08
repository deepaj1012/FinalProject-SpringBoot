package com.helpbridge.service;

import com.helpbridge.dto.AdminDashboardSummary;
import com.helpbridge.enums.RoleType;
import com.helpbridge.enums.UserStatus;
import com.helpbridge.model.User;
import com.helpbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.helpbridge.repository.ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private com.helpbridge.repository.NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private com.helpbridge.util.DataSeeder dataSeeder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(RoleType role) {
        return userRepository.findByRole(role);
    }

    public List<User> getUsersByRoleAndCity(RoleType role, String city) {
        if (city == null || city.isEmpty()) {
            return userRepository.findByRole(role);
        }
        return userRepository.findByRoleAndCityIgnoreCase(role, city);
    }

    public void approveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.Approved);
        userRepository.save(user);

        String subject = "HelpBridge Account Approved";
        String body = "Dear " + user.getFullName() + ",\n\n" +
                "Congratulations! Your account has been approved by the admin. " +
                "You can now log in and access all features.\n\n" +
                "Best Regards,\nHelpBridge Team";
        emailService.sendEmail(user.getEmail(), subject, body);
    }

    public void rejectUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.Rejected);
        userRepository.save(user);

        String subject = "HelpBridge Account Update";
        String body = "Dear " + user.getFullName() + ",\n\n" +
                "We regret to inform you that your account registration has been rejected. " +
                "Please contact support for more details.\n\n" +
                "Best Regards,\nHelpBridge Team";
        emailService.sendEmail(user.getEmail(), subject, body);
    }

    public void suspendUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.Suspended);
        userRepository.save(user);
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete notifications first (FK constraint)
        notificationRepository.deleteByUserId(userId);

        if (user.getRole() == RoleType.Volunteer) {
            // Unassign references in ServiceRequest
            List<com.helpbridge.model.ServiceRequest> requests = serviceRequestRepository.findByVolunteerId(userId);
            for (com.helpbridge.model.ServiceRequest req : requests) {
                req.setVolunteer(null);
                if (req.getStatus() == com.helpbridge.enums.RequestStatus.ACCEPTED ||
                        req.getStatus() == com.helpbridge.enums.RequestStatus.IN_PROGRESS) {
                    req.setStatus(com.helpbridge.enums.RequestStatus.PENDING);
                }
                serviceRequestRepository.save(req);
            }
        } else if (user.getRole() == RoleType.Student) {
            // Delete associated requests because student_id is not nullable
            List<com.helpbridge.model.ServiceRequest> requests = serviceRequestRepository.findByStudentId(userId);
            serviceRequestRepository.deleteAll(requests);
        }

        userRepository.deleteById(userId);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public AdminDashboardSummary getDashboardSummary() {
        AdminDashboardSummary.RoleStats s = getStats(RoleType.Student);
        AdminDashboardSummary.RoleStats v = getStats(RoleType.Volunteer);
        AdminDashboardSummary.RoleStats n = getStats(RoleType.NGO);
        AdminDashboardSummary.RoleStats d = getStats(RoleType.Donor);
        return new AdminDashboardSummary(s, v, n, d);
    }

    private AdminDashboardSummary.RoleStats getStats(RoleType role) {
        long total = userRepository.countByRole(role);
        System.out.println("Stats for " + role + ": Total=" + total);
        long approved = userRepository.countByRoleAndStatus(role, UserStatus.Approved);
        long pending = userRepository.countByRoleAndStatus(role, UserStatus.Pending);
        return new AdminDashboardSummary.RoleStats(total, approved, pending);
    }

    public String seedData() {
        dataSeeder.seed();
        return "Seeding Triggered";
    }
}
