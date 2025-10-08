package com.cuetjam.controller;

import com.cuetjam.model.*;
import com.cuetjam.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/collab")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CollabController {
    
    @Autowired
    private PostService postService;
    
    @GetMapping
    public ResponseEntity<List<Collab>> getAllCollab(
            @RequestParam(required = false) String section,
            @RequestParam(required = false) String status) {
        
        if (section != null && status != null) {
            CollabSection sec = CollabSection.valueOf(section.toUpperCase());
            CollabStatus stat = CollabStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(postService.getCollabBySectionAndStatus(sec, stat));
        } else if (section != null) {
            CollabSection sec = CollabSection.valueOf(section.toUpperCase());
            return ResponseEntity.ok(postService.getCollabBySection(sec));
        } else if (status != null) {
            CollabStatus stat = CollabStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(postService.getCollabByStatus(stat));
        }
        
        return ResponseEntity.ok(postService.getAllCollab());
    }
    
    @PostMapping
    public ResponseEntity<?> createCollab(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String authorId = authentication.getName();
            String title = request.get("title");
            String description = request.get("description");
            String contactInfo = request.get("contactInfo");
            String section = request.get("section");
            
            CollabSection sec = CollabSection.valueOf(section.toUpperCase());
            Collab collab = postService.createCollab(authorId, title, description, contactInfo, sec);
            return ResponseEntity.ok(Map.of("success", true, "collab", collab));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCollab(@PathVariable Long id, @RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String authorId = authentication.getName();
            String title = request.get("title");
            String description = request.get("description");
            String contactInfo = request.get("contactInfo");
            String status = request.get("status");
            
            CollabStatus stat = CollabStatus.valueOf(status.toUpperCase());
            Collab collab = postService.updateCollab(id, title, description, contactInfo, stat, authorId);
            return ResponseEntity.ok(Map.of("success", true, "collab", collab));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCollab(@PathVariable Long id, Authentication authentication) {
        try {
            String authorId = authentication.getName();
            boolean deleted = postService.deleteCollab(id, authorId);
            
            if (deleted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Collab post deleted successfully"));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Post not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCollab(@PathVariable Long id) {
        Optional<Collab> collab = postService.getCollabById(id);
        if (collab.isPresent()) {
            return ResponseEntity.ok(Map.of("success", true, "collab", collab.get()));
        } else {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Collab post not found"));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Collab>> searchCollab(@RequestParam String keyword) {
        return ResponseEntity.ok(postService.searchCollab(keyword));
    }
}