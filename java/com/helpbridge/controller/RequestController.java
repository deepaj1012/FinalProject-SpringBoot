package com.helpbridge.controller;

import com.helpbridge.model.ServiceRequest;
import com.helpbridge.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody ServiceRequest request) {
        // Assuming the student object inside request only has ID populated or similar
        // Ideally we use DTOs, but for speed, I'll pass Entity,
        // but need to ensure 'student' is set correct or pass 'studentId'
        // For now, let's assume the frontend sends the structure.
        return ResponseEntity.ok(requestService.createRequest(request));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ServiceRequest>> getMyRequests(@PathVariable Long studentId) {
        return ResponseEntity.ok(requestService.getRequestsByStudent(studentId));
    }

    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<List<ServiceRequest>> getAssignedRequests(@PathVariable Long volunteerId) {
        return ResponseEntity.ok(requestService.getRequestsByVolunteer(volunteerId));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<ServiceRequest>> getNearbyRequests(@RequestParam String city) {
        return ResponseEntity.ok(requestService.getNearbyRequests(city));
    }

    @PostMapping("/{requestId}/accept/{volunteerId}")
    public ResponseEntity<?> acceptRequest(@PathVariable Long requestId, @PathVariable Long volunteerId) {
        requestService.acceptRequest(requestId, volunteerId);
        return ResponseEntity.ok().body("{\"message\": \"Request accepted\"}");
    }

    @PostMapping("/{requestId}/complete")
    public ResponseEntity<?> completeRequest(@PathVariable Long requestId) {
        requestService.completeRequest(requestId);
        return ResponseEntity.ok().body("{\"message\": \"Request completed\"}");
    }

    @PostMapping("/{requestId}/feedback")
    public ResponseEntity<?> submitFeedback(@PathVariable Long requestId, @RequestBody String feedback) {
        requestService.submitFeedback(requestId, feedback);
        return ResponseEntity.ok().body("{\"message\": \"Feedback submitted\"}");
    }

    @GetMapping("/all")
    public ResponseEntity<List<ServiceRequest>> getAllRequests(@RequestParam(required = false) Long ngoId) {
        if (ngoId != null) {
            return ResponseEntity.ok(requestService.getRequestsForNgoView(ngoId));
        }
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @PostMapping("/{requestId}/accept")
    public ResponseEntity<?> acceptRequestByNgo(@PathVariable Long requestId, @RequestParam Long ngoId) {
        requestService.acceptRequestByNgo(requestId, ngoId);
        return ResponseEntity.ok().body("{\"message\": \"Request accepted\"}");
    }

    @PostMapping("/{requestId}/funds")
    public ResponseEntity<?> allocateFunds(@PathVariable Long requestId, @RequestBody Double amount) {
        requestService.allocateFunds(requestId, amount);
        return ResponseEntity.ok().body("{\"message\": \"Funds allocated\"}");
    }

    @PostMapping("/{requestId}/volunteer-accept")
    public ResponseEntity<?> volunteerAccept(@PathVariable Long requestId) {
        requestService.volunteerAcceptsRequest(requestId);
        return ResponseEntity.ok().body("{\"message\": \"Request accepted by volunteer\"}");
    }

    @PostMapping("/{requestId}/assign/{volunteerId}")
    public ResponseEntity<?> assignVolunteer(@PathVariable Long requestId, @PathVariable Long volunteerId,
            @RequestParam Long ngoId) {
        System.out.println(
                "ASSIGN VOLUNTEER ENDPOINT REACHED: Request=" + requestId + ", Vol=" + volunteerId + ", NGO=" + ngoId);
        requestService.assignVolunteer(requestId, volunteerId, ngoId);
        return ResponseEntity.ok().body("{\"message\": \"Volunteer assigned\"}");
    }

    @PostMapping("/{requestId}/reject")
    public ResponseEntity<?> rejectAssignment(@PathVariable Long requestId) {
        requestService.rejectAssignment(requestId);
        return ResponseEntity.ok().body("{\"message\": \"Assignment rejected\"}");
    }

    @DeleteMapping("/{requestId}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long requestId) {
        requestService.deleteRequest(requestId);
        return ResponseEntity.ok().body("{\"message\": \"Request deleted\"}");
    }
}
