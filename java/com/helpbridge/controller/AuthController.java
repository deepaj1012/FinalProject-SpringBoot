package com.helpbridge.controller;

import com.helpbridge.dto.AuthResponse;
import com.helpbridge.dto.LoginRequest;
import com.helpbridge.dto.RegisterRequest;
import com.helpbridge.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // Return suitable error
        }
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> register(@ModelAttribute RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.ok().body("{\"message\": \"Registration successful\"}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("{\"message\": \"" + e.getMessage() + "\"}");
        }
    }
}
