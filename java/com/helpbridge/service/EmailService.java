package com.helpbridge.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        sendEmail(to, subject, body, null);
    }

    public void sendEmail(String to, String subject, String body, String replyTo) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false);

            helper.setFrom("helpbridge02@gmail.com", "HelpBridge Support");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);
            if (replyTo != null) {
                helper.setReplyTo(replyTo);
            }

            mailSender.send(message);
            System.out.println("Email sent successfully to " + to);
        } catch (Exception e) {
            System.err.println("Error sending email to " + to + ": " + e.getMessage());
        }
    }

    public void sendEmailWithAttachment(String to, String subject, String body, String pathToAttachment) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("helpbridge02@gmail.com", "HelpBridge NGO Team");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body);

            FileSystemResource file = new FileSystemResource(new File(pathToAttachment));
            helper.addAttachment(file.getFilename(), file);

            mailSender.send(message);
            System.out.println("Email with attachment sent successfully to " + to);
        } catch (Exception e) {
            System.err.println("Error sending email with attachment to " + to + ": " + e.getMessage());
        }
    }
}
