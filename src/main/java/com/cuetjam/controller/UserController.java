package com.cuetjam.controller;

import com.cuetjam.model.*;
import com.cuetjam.repository.DepartmentRepository;
import com.cuetjam.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            String userId = authentication.getName();
            Optional<User> userOpt = userService.findById(userId);
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                return ResponseEntity.ok(Map.of("success", true, "user", user));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            String userId = authentication.getName();
            Optional<User> userOpt = userService.findById(userId);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "User not found"));
            }
            
            User user = userOpt.get();
            
            // Update basic fields
            if (request.containsKey("name")) {
                user.setName((String) request.get("name"));
            }
            
            // Update password if provided
            if (request.containsKey("password") && !((String) request.get("password")).isEmpty()) {
                user.setPassword(passwordEncoder.encode((String) request.get("password")));
            }
            
            // Update type-specific fields
            if (user instanceof Student) {
                Student student = (Student) user;
                if (request.containsKey("batch")) {
                    student.setBatch((Integer) request.get("batch"));
                }
            } else if (user instanceof Faculty) {
                Faculty faculty = (Faculty) user;
                if (request.containsKey("designation")) {
                    faculty.setDesignation((String) request.get("designation"));
                }
                if (request.containsKey("researchAreas")) {
                    faculty.setResearchAreas((String) request.get("researchAreas"));
                }
            } else if (user instanceof Alumni) {
                Alumni alumni = (Alumni) user;
                if (request.containsKey("researchAreas")) {
                    alumni.setResearchAreas((String) request.get("researchAreas"));
                }
                if (request.containsKey("currentWorkingPlace")) {
                    alumni.setCurrentWorkingPlace((String) request.get("currentWorkingPlace"));
                }
                if (request.containsKey("shortDescription")) {
                    alumni.setShortDescription((String) request.get("shortDescription"));
                }
            }
            
            User updatedUser = userService.updateUser(user);
            return ResponseEntity.ok(Map.of("success", true, "user", updatedUser, "message", "Profile updated successfully"));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @GetMapping("/alumni")
    public ResponseEntity<List<Alumni>> getAllApprovedAlumni(@RequestParam(required = false) Long departmentId) {
        if (departmentId != null) {
            return ResponseEntity.ok(userService.getApprovedAlumniByDepartment(departmentId));
        }
        return ResponseEntity.ok(userService.getApprovedAlumni());
    }
    
    @GetMapping("/faculty")
    public ResponseEntity<List<Faculty>> getAllFaculty(@RequestParam(required = false) Long departmentId) {
        if (departmentId != null) {
            return ResponseEntity.ok(userService.getFacultyByDepartment(departmentId));
        }
        return ResponseEntity.ok(userService.getAllFaculty());
    }
    
    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentRepository.findAll());
    }
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable String userId) {
        try {
            Optional<User> userOpt = userService.findById(userId);
            if (userOpt.isPresent()) {
                return ResponseEntity.ok(Map.of("success", true, "user", userOpt.get()));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}