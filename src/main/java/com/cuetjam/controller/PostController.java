package com.cuetjam.controller;

import com.cuetjam.model.*;
import com.cuetjam.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PostController {
    
    @Autowired
    private PostService postService;
    
    // CUET Today Posts
    @GetMapping("/cuet-today")
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }
    
    @PostMapping("/cuet-today")
    public ResponseEntity<?> createPost(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String authorId = authentication.getName();
            String title = request.get("title");
            String description = request.get("description");
            
            System.out.println("DEBUG: Creating post with authorId: " + authorId);
            System.out.println("DEBUG: Authentication principal class: " + authentication.getPrincipal().getClass().getName());
            System.out.println("DEBUG: Authentication principal: " + authentication.getPrincipal());
            
            Post post = postService.createPost(authorId, title, description);
            return ResponseEntity.ok(Map.of("success", true, "post", post));
        } catch (Exception e) {
            System.out.println("DEBUG: Error creating post: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PutMapping("/cuet-today/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable Long postId, @RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String authorId = authentication.getName();
            String title = request.get("title");
            String description = request.get("description");
            
            Post post = postService.updatePost(postId, title, description, authorId);
            return ResponseEntity.ok(Map.of("success", true, "post", post));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/cuet-today/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId, Authentication authentication) {
        try {
            String authorId = authentication.getName();
            boolean deleted = postService.deletePost(postId, authorId);
            
            if (deleted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Post deleted successfully"));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Post not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @GetMapping("/cuet-today/{postId}")
    public ResponseEntity<?> getPost(@PathVariable Long postId) {
        Optional<Post> post = postService.getPostById(postId);
        if (post.isPresent()) {
            return ResponseEntity.ok(Map.of("success", true, "post", post.get()));
        } else {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Post not found"));
        }
    }
    
    @GetMapping("/cuet-today/search")
    public ResponseEntity<List<Post>> searchPosts(@RequestParam String keyword) {
        return ResponseEntity.ok(postService.searchPosts(keyword));
    }
    
    // Lost & Found
    @GetMapping("/lost-found")
    public ResponseEntity<List<LostFound>> getAllLostFound(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            LostFoundCategory cat = LostFoundCategory.valueOf(category.toUpperCase());
            return ResponseEntity.ok(postService.getLostFoundByCategory(cat));
        }
        return ResponseEntity.ok(postService.getAllLostFound());
    }
    
    @PostMapping("/lost-found")
    public ResponseEntity<?> createLostFound(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String authorId = authentication.getName();
            String title = request.get("title");
            String description = request.get("description");
            String category = request.get("category");
            String url = request.get("url");
            
            LostFoundCategory cat = LostFoundCategory.valueOf(category.toUpperCase());
            LostFound lostFound = postService.createLostFound(authorId, title, description, cat, url);
            return ResponseEntity.ok(Map.of("success", true, "post", lostFound));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @PutMapping("/lost-found/{id}")
    public ResponseEntity<?> updateLostFound(@PathVariable Long id, @RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String authorId = authentication.getName();
            String title = request.get("title");
            String description = request.get("description");
            String url = request.get("url");
            
            LostFound lostFound = postService.updateLostFound(id, title, description, url, authorId);
            return ResponseEntity.ok(Map.of("success", true, "post", lostFound));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @DeleteMapping("/lost-found/{id}")
    public ResponseEntity<?> deleteLostFound(@PathVariable Long id, Authentication authentication) {
        try {
            String authorId = authentication.getName();
            boolean deleted = postService.deleteLostFound(id, authorId);
            
            if (deleted) {
                return ResponseEntity.ok(Map.of("success", true, "message", "Lost & Found post deleted successfully"));
            } else {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Post not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
    
    @GetMapping("/lost-found/search")
    public ResponseEntity<List<LostFound>> searchLostFound(@RequestParam String keyword) {
        return ResponseEntity.ok(postService.searchLostFound(keyword));
    }
}