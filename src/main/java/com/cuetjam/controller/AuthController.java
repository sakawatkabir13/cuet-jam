package com.cuetjam.controller;

import com.cuetjam.config.JwtUtils;
import com.cuetjam.dto.*;
import com.cuetjam.model.User;
import com.cuetjam.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // First check if user exists (regardless of verification status)
            Optional<User> userOpt = userService.findByEmailAny(loginRequest.getEmail());
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Invalid email or password"));
            }
            
            User user = userOpt.get();
            
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Invalid email or password"));
            }
            
            // Check if user is verified
            if (!user.getIsVerified()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Please verify your email address to continue"));
            }
            
            String jwt = jwtUtils.generateJwtToken(user.getUserId(), user.getEmail(), user.getUserType().toString());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("token", jwt);
            response.put("user", Map.of(
                "userId", user.getUserId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "userType", user.getUserType().toString(),
                "department", user.getDepartment() != null ? user.getDepartment().getName() : null,
                "isAdmin", userService.isAdmin(user.getUserId())
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Login failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@Valid @RequestBody StudentRegistrationRequest request) {
        try {
            userService.registerStudent(request);
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "message", "Student registration successful. Please check your email for verification code."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PostMapping("/register/faculty")
    public ResponseEntity<?> registerFaculty(@Valid @RequestBody FacultyRegistrationRequest request) {
        try {
            userService.registerFaculty(request);
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "message", "Faculty registration successful. Please check your email for verification code."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PostMapping("/register/alumni")
    public ResponseEntity<?> registerAlumni(@Valid @RequestBody AlumniRegistrationRequest request) {
        try {
            userService.registerAlumni(request);
            return ResponseEntity.ok(Map.of(
                "success", true, 
                "message", "Alumni registration successful. Please check your email for verification code and wait for admin approval."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        try {
            String verificationCode = request.get("verificationCode");
            if (verificationCode == null || verificationCode.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Verification code is required"));
            }
            
            User user = userService.verifyEmailAndGetUser(verificationCode);
            if (user != null) {
                // Generate JWT token for the verified user
                String jwt = jwtUtils.generateJwtToken(user.getUserId(), user.getEmail(), user.getUserType().toString());
                
                Map<String, Object> userResponse = new HashMap<>();
                userResponse.put("userId", user.getUserId());
                userResponse.put("name", user.getName());
                userResponse.put("email", user.getEmail());
                userResponse.put("userType", user.getUserType().toString());
                userResponse.put("isVerified", user.getIsVerified());
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Email verified successfully. You are now logged in.");
                response.put("token", jwt);
                response.put("user", userResponse);
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Invalid or expired verification code"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Verification failed: " + e.getMessage()));
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Email is required"));
            }
            
            boolean sent = userService.sendPasswordResetOTP(email);
            if (sent) {
                return ResponseEntity.ok(Map.of(
                    "success", true, 
                    "message", "Password reset OTP has been sent to your email address."
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "success", true, 
                    "message", "If an account with this email exists, you will receive a password reset OTP."
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Failed to process request: " + e.getMessage()));
        }
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String otp = request.get("otp");
            String newPassword = request.get("newPassword");
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Email is required"));
            }
            
            if (otp == null || otp.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "OTP is required"));
            }
            
            if (newPassword == null || newPassword.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "New password is required"));
            }
            
            if (newPassword.length() < 6) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Password must be at least 6 characters long"));
            }
            
            boolean success = userService.resetPasswordWithOTP(email, otp, newPassword);
            if (success) {
                return ResponseEntity.ok(Map.of(
                    "success", true, 
                    "message", "Password reset successfully. You can now log in with your new password."
                ));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Invalid or expired OTP"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Failed to reset password: " + e.getMessage()));
        }
    }
}