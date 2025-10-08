package com.cuetjam.controller;

import com.cuetjam.model.Alumni;
import com.cuetjam.service.UserService;
import com.cuetjam.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PostService postService;
    
    @GetMapping("/alumni/pending")
    public ResponseEntity<List<Alumni>> getPendingAlumniApprovals() {
        return ResponseEntity.ok(userService.getPendingAlumniApprovals());
    }
    
    @PostMapping("/alumni/{alumniId}/approve")
    public ResponseEntity<?> approveAlumni(@PathVariable String alumniId, Authentication authentication) {
        try {
            String adminId = authentication.getName();
            boolean approved = userService.approveAlumni(alumniId, adminId);
            
            if (approved) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Alumni approved successfully"));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Alumni not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PostMapping("/alumni/{alumniId}/reject")
    public ResponseEntity<?> rejectAlumni(@PathVariable String alumniId, Authentication authentication) {
        try {
            String adminId = authentication.getName();
            boolean rejected = userService.rejectAlumni(alumniId, adminId);
            
            if (rejected) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Alumni rejected successfully"));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Alumni not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    // Content Moderation Endpoints
    
    @DeleteMapping("/moderate/posts/{postId}")
    public ResponseEntity<?> deletePostAsAdmin(@PathVariable Long postId, Authentication authentication) {
        try {
            String adminId = authentication.getName();
            boolean deleted = postService.deletePostAsAdmin(postId, adminId);
            
            if (deleted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Post deleted successfully by admin"));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Post not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/moderate/lost-found/{id}")
    public ResponseEntity<?> deleteLostFoundAsAdmin(@PathVariable Long id, Authentication authentication) {
        try {
            String adminId = authentication.getName();
            boolean deleted = postService.deleteLostFoundAsAdmin(id, adminId);
            
            if (deleted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Lost & Found post deleted successfully by admin"));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Lost & Found post not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/moderate/collab/{id}")
    public ResponseEntity<?> deleteCollabAsAdmin(@PathVariable Long id, Authentication authentication) {
        try {
            String adminId = authentication.getName();
            boolean deleted = postService.deleteCollabAsAdmin(id, adminId);
            
            if (deleted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Collab post deleted successfully by admin"));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Collab post not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/moderate/resources/{id}")
    public ResponseEntity<?> deleteResourceAsAdmin(@PathVariable Long id, Authentication authentication) {
        try {
            String adminId = authentication.getName();
            boolean deleted = postService.deleteResourceAsAdmin(id, adminId);
            
            if (deleted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Resource deleted successfully by admin"));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Resource not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}