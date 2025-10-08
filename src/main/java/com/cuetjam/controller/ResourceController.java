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
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ResourceController {
    
    @Autowired
    private PostService postService;
    
    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            ResourceCategory cat = ResourceCategory.valueOf(category.toUpperCase());
            return ResponseEntity.ok(postService.getResourcesByCategory(cat));
        }
        return ResponseEntity.ok(postService.getAllResources());
    }
    
    @PostMapping
    public ResponseEntity<?> createResource(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String authorId = authentication.getName();
            String title = request.get("title");
            String description = request.get("description");
            String url = request.get("url");
            String category = request.get("category");
            
            ResourceCategory cat = ResourceCategory.valueOf(category.toUpperCase());
            Resource resource = postService.createResource(authorId, title, description, url, cat);
            return ResponseEntity.ok(Map.of("success", true, "resource", resource));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateResource(@PathVariable Long id, @RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String authorId = authentication.getName();
            String title = request.get("title");
            String description = request.get("description");
            String url = request.get("url");
            
            Resource resource = postService.updateResource(id, title, description, url, authorId);
            return ResponseEntity.ok(Map.of("success", true, "resource", resource));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResource(@PathVariable Long id, Authentication authentication) {
        try {
            String authorId = authentication.getName();
            boolean deleted = postService.deleteResource(id, authorId);
            
            if (deleted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Resource deleted successfully"));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Resource not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getResource(@PathVariable Long id) {
        Optional<Resource> resource = postService.getResourceById(id);
        if (resource.isPresent()) {
            return ResponseEntity.ok(Map.of("success", true, "resource", resource.get()));
        } else {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Resource not found"));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Resource>> searchResources(@RequestParam String keyword) {
        return ResponseEntity.ok(postService.searchResources(keyword));
    }
}