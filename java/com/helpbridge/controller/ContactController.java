package com.helpbridge.controller;

import com.helpbridge.dto.ContactRequest;
import com.helpbridge.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<?> sendContactEmail(@RequestBody ContactRequest contactRequest) {
        String adminEmail = "helpbridge02@gmail.com";
        String subject = "New Contact Us Message: " + contactRequest.getSubject();
        
        String body = "You have received a new message from the Contact Us form:\n\n" +
                "Name: " + contactRequest.getName() + "\n" +
                "Email: " + contactRequest.getEmail() + "\n" +
                "Subject: " + contactRequest.getSubject() + "\n\n" +
                "Message:\n" + contactRequest.getMessage();

        emailService.sendEmail(adminEmail, subject, body, contactRequest.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("message", "Your message has been sent successfully!");
        return ResponseEntity.ok(response);
    }
}
