package com.helpbridge.service;

import com.helpbridge.model.Notification;
import com.helpbridge.model.User;
import com.helpbridge.repository.NotificationRepository;
import com.helpbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    public void createNotification(Long userId, String message) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            Notification notif = new Notification(user, message);
            notificationRepository.save(notif);
        }
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
