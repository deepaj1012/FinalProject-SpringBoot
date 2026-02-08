package com.helpbridge.service;

import com.helpbridge.enums.RequestStatus;
import com.helpbridge.model.ServiceRequest;
import com.helpbridge.model.Volunteer;
import com.helpbridge.repository.ServiceRequestRepository;
import com.helpbridge.repository.VolunteerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RequestService {

    @Autowired
    private ServiceRequestRepository requestRepository;

    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private com.helpbridge.repository.NGORepository ngoRepository;

    @Autowired
    private EmailService emailService;

    public ServiceRequest createRequest(ServiceRequest request) {
        ServiceRequest saved = requestRepository.save(request);
        notifyVolunteers(saved);
        return saved;
    }

    private void notifyVolunteers(ServiceRequest request) {
        if (request.getCity() == null)
            return;
        List<Volunteer> volunteers = volunteerRepository.findByCity(request.getCity());
        for (Volunteer v : volunteers) {
            emailService.sendEmail(v.getEmail(), "New Request Nearby",
                    "A new request has been posted in your city: " + request.getDescription());
        }
    }

    public List<ServiceRequest> getRequestsByStudent(Long studentId) {
        return requestRepository.findByStudentId(studentId);
    }

    public List<ServiceRequest> getRequestsByVolunteer(Long volunteerId) {
        return requestRepository.findByVolunteerId(volunteerId);
    }

    public List<ServiceRequest> getNearbyRequests(String city) {
        return requestRepository.findByCityAndStatus(city, RequestStatus.PENDING);
    }

    // This method is used by NGO to Assign a Volunteer (Step 1)
    public void acceptRequest(Long requestId, Long volunteerId) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));

        if (req.getStatus() != RequestStatus.PENDING && req.getStatus() != RequestStatus.ACCEPTED) {
            // relax check
        }

        req.setVolunteer(volunteer);
        req.setStatus(RequestStatus.ASSIGNED);
        requestRepository.save(req);

        // Notify Volunteer about assignment
        try {
            emailService.sendEmail(volunteer.getEmail(), "New Request Assigned",
                    "You have been assigned a new request: " + req.getDescription()
                            + ". Please log in to your dashboard to accept it.");
        } catch (Exception e) {
            System.out.println("Error sending assignment email: " + e.getMessage());
        }
    }

    public void completeRequest(Long requestId) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        req.setStatus(RequestStatus.COMPLETED);
        requestRepository.save(req);
    }

    public void submitFeedback(Long requestId, String feedback) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        req.setFeedback(feedback);
        requestRepository.save(req);
    }

    public List<ServiceRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<ServiceRequest> getRequestsForNgoView(Long ngoId) {
        // Return PENDING requests (visible to all) OR requests owned by this NGO
        List<ServiceRequest> all = requestRepository.findAll();
        // Filtering in memory for simplicity (can be optimized with JPQL)
        return all.stream()
                .filter(req -> req.getStatus() == RequestStatus.PENDING ||
                        (req.getNgo() != null && req.getNgo().getId().equals(ngoId)))
                .toList();
    }

    public void acceptRequestByNgo(Long requestId, Long ngoId) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        if (req.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Request is not pending");
        }

        com.helpbridge.model.NGO ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        req.setNgo(ngo);
        req.setStatus(RequestStatus.ACCEPTED);
        requestRepository.save(req);
    }

    public void allocateFunds(Long requestId, Double amount) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        req.setFundsAllocated(req.getFundsAllocated() + amount);
        requestRepository.save(req);
    }

    // Step 2: Volunteer Accepts the Assigned Request
    public void volunteerAcceptsRequest(Long requestId) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Ensure request is in ASSIGNED state (or handle re-acceptance if safe)
        if (req.getStatus() != RequestStatus.ASSIGNED) {
            throw new RuntimeException("Request is not in ASSIGNED state");
        }

        req.setStatus(RequestStatus.ACCEPTED);
        requestRepository.save(req);

        // Notify Student/Requester with Volunteer's ID Proof
        Volunteer volunteer = req.getVolunteer();
        if (volunteer == null)
            return;

        try {
            String subject = "Request Accepted by Volunteer";
            String body = "Dear Requestor,\n\n" +
                    "Your request description: \"" + req.getDescription() + "\"\n" +
                    "Has been accepted by Volunteer: " + volunteer.getFullName() + ".\n\n" +
                    "Please find the Volunteer's Identity Proof attached for your verification.\n\n" +
                    "Best Regards,\nHelpBridge NGO Team";

            // Resolve absolute path for attachment
            String relativePath = volunteer.getIdProofPath();
            if (relativePath != null && !relativePath.isEmpty()) {
                if (relativePath.startsWith("/") || relativePath.startsWith("\\")) {
                    relativePath = relativePath.substring(1);
                }
                String projectRoot = System.getProperty("user.dir");
                java.nio.file.Path filePath = java.nio.file.Paths.get(projectRoot, "src", "main", "resources", "static",
                        relativePath);

                String studentEmail = (req.getStudent() != null) ? req.getStudent().getEmail() : "admin@helpbridge.com";

                if (filePath.toFile().exists()) {
                    emailService.sendEmailWithAttachment(studentEmail, subject, body,
                            filePath.toAbsolutePath().toString());
                } else {
                    emailService.sendEmail(studentEmail, subject,
                            body + "\n(Note: ID Proof document file not found on server)");
                }
            } else {
                emailService.sendEmail(req.getStudent().getEmail(), subject,
                        body + "\n(No ID Proof document available for this volunteer)");
            }
        } catch (Exception e) {
            System.out.println("Error sending acceptance email: " + e.getMessage());
        }
    }

    // Dedicated method for Assignment to avoid confusion/conflicts
    public void assignVolunteer(Long requestId, Long volunteerId, Long ngoId) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        Volunteer volunteer = volunteerRepository.findById(volunteerId)
                .orElseThrow(() -> new RuntimeException("Volunteer not found"));

        com.helpbridge.model.NGO ngo = ngoRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));

        // Allow assignment if Pending or Accepted (by NGO)
        // We set it to ASSIGNED
        req.setVolunteer(volunteer);
        req.setNgo(ngo); // Link to this NGO
        req.setStatus(RequestStatus.ASSIGNED);
        requestRepository.save(req);

        try {
            emailService.sendEmail(volunteer.getEmail(), "New Request Assigned",
                    "You have been assigned a new request: " + req.getDescription()
                            + ". Please log in to your dashboard to accept it.");
        } catch (Exception e) {
            System.out.println("Error sending assignment email: " + e.getMessage());
        }
    }

    // Method for Volunteer to Reject Assignment
    public void rejectAssignment(Long requestId) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (req.getStatus() != RequestStatus.ASSIGNED) {
            throw new RuntimeException("Can only reject ASSIGNED requests");
        }

        Volunteer v = req.getVolunteer();
        String volName = (v != null) ? v.getFullName() : "Unknown";

        // Reset to Pending
        req.setVolunteer(null);
        req.setStatus(RequestStatus.PENDING);
        requestRepository.save(req);

        // Notify Admin/NGO (Optional, logging for now)
        System.out.println("Volunteer " + volName + " rejected request " + requestId);
    }

    public void deleteRequest(Long requestId) {
        if (!requestRepository.existsById(requestId)) {
            throw new RuntimeException("Request not found");
        }
        requestRepository.deleteById(requestId);
    }
}
