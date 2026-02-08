package com.helpbridge.controller;

import com.helpbridge.model.Notification;
import com.helpbridge.model.User;
import com.helpbridge.repository.NotificationRepository; // I will create this repo in next step inline or let it be
import com.helpbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private com.helpbridge.service.NotificationService notificationService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }
}
