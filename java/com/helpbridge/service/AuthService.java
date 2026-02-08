package com.helpbridge.service;

import com.helpbridge.dto.AuthResponse;
import com.helpbridge.dto.LoginRequest;
import com.helpbridge.dto.RegisterRequest;
import com.helpbridge.enums.RoleType;
import com.helpbridge.enums.UserStatus;
import com.helpbridge.model.*;
import com.helpbridge.repository.*;
import com.helpbridge.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private NGORepository ngoRepository;
    @Autowired
    private DonorRepository donorRepository;
    @Autowired
    private VolunteerRepository volunteerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    // Define upload directory
    private final Path fileStorageLocation;

    public AuthService() {
        // Use user.dir to get the project root and then navigate to the resources
        // static folder
        // Assuming the backend project root is running from 'd:/final
        // 2/Backend(SpringBoot)/HelpBridge'
        // We want 'src/main/resources/static/documents'
        String projectRoot = System.getProperty("user.dir");
        this.fileStorageLocation = Paths.get(projectRoot, "src", "main", "resources", "static", "documents")
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        // Check if user is approved (skip check for Admins if needed, though Admins
        // should be approved)
        if (user.getRole() != RoleType.Admin) {
            if (user.getStatus() == UserStatus.Pending) {
                throw new RuntimeException(
                        "Your account is currently under approval. Please wait for admin confirmation.");
            } else if (user.getStatus() == UserStatus.Rejected) {
                throw new RuntimeException("Your account registration has been rejected. Please contact support.");
            } else if (user.getStatus() == UserStatus.Suspended) {
                throw new RuntimeException("Your account has been suspended. Please contact support.");
            }
        }

        final String jwt = jwtUtil.generateToken(userDetails.getUsername(), user.getRole().toString());

        return new AuthResponse(jwt, user.getFullName(), user.getId(), user.getEmail(), user.getRole().toString());
    }

    public void register(RegisterRequest request) throws IOException {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        RoleType role = RoleType.valueOf(request.getRole());
        User user;

        switch (role) {
            case Student:
                Student student = new Student();
                student.setCity(request.getCity());
                if (request.getDocument() != null) {
                    student.setDisabilityCertificatePath(saveFile(request.getDocument()));
                }
                user = student;
                break;
            case NGO:
                NGO ngo = new NGO();
                ngo.setCity(request.getCity());
                if (request.getDocument() != null) {
                    ngo.setRegistrationDocumentPath(saveFile(request.getDocument()));
                }
                user = ngo;
                break;
            case Donor:
                Donor donor = new Donor();
                if (request.getDocument() != null) {
                    donor.setIdProofPath(saveFile(request.getDocument()));
                }
                user = donor;
                break;
            case Volunteer:
                Volunteer volunteer = new Volunteer();
                volunteer.setAvailability(request.getAvailability());
                volunteer.setInterests(request.getInterests());
                if (request.getDocument() != null) {
                    volunteer.setIdProofPath(saveFile(request.getDocument()));
                }
                user = volunteer;
                break;
            default:
                user = new User();
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(role);
        user.setCityId(request.getCityId());
        user.setCity(request.getCity());
        user.setLatitude(request.getLatitude());
        user.setLongitude(request.getLongitude());

        // Status logic
        // .NET logic: Donors are Auto-Approved (from conversation history), likely
        // others are Pending.
        if (role == RoleType.Donor) {
            user.setStatus(UserStatus.Approved);
        } else {
            user.setStatus(UserStatus.Pending);
        }

        userRepository.save(user);
    }

    private String saveFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path targetLocation = this.fileStorageLocation.resolve(fileName);
        Files.copy(file.getInputStream(), targetLocation);
        return "/documents/" + fileName; // Return relative path for URL access
    }
}
