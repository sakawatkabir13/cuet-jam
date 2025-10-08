package com.cuetjam.service;

import com.cuetjam.model.*;
import com.cuetjam.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private LostFoundRepository lostFoundRepository;
    
    @Autowired
    private CollabRepository collabRepository;
    
    @Autowired
    private ResourceRepository resourceRepository;
    
    @Autowired
    private UserService userService;
    
    // Post methods
    public Post createPost(String authorId, String title, String description) {
        Post post = new Post(authorId, title, description);
        return postRepository.save(post);
    }
    
    public List<Post> getAllPosts() {
        return postRepository.findAllOrderByTimeOfPostDesc();
    }
    
    public List<Post> getPostsByAuthor(String authorId) {
        return postRepository.findByAuthorIdOrderByTimeOfPostDesc(authorId);
    }
    
    public Optional<Post> getPostById(Long postId) {
        return postRepository.findById(postId);
    }
    
    public Post updatePost(Long postId, String title, String description, String authorId) {
        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            if (!post.getAuthorId().equals(authorId)) {
                throw new RuntimeException("You can only update your own posts");
            }
            post.setTitle(title);
            post.setDescription(description);
            return postRepository.save(post);
        }
        throw new RuntimeException("Post not found");
    }
    
    public boolean deletePost(Long postId, String authorId) {
        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            Post post = postOpt.get();
            // Allow deletion if user is the author OR if user is an admin
            if (!post.getAuthorId().equals(authorId) && !userService.isAdmin(authorId)) {
                throw new RuntimeException("You can only delete your own posts or you must be an admin");
            }
            postRepository.delete(post);
            return true;
        }
        return false;
    }
    
    public List<Post> searchPosts(String keyword) {
        return postRepository.findByTitleOrDescriptionContainingOrderByTimeOfPostDesc(keyword);
    }
    
    // Lost & Found methods
    public LostFound createLostFound(String authorId, String title, String description, LostFoundCategory category, String url) {
        LostFound lostFound = new LostFound(authorId, title, description, category, url);
        return lostFoundRepository.save(lostFound);
    }
    
    public List<LostFound> getAllLostFound() {
        return lostFoundRepository.findAllOrderByTimeOfPostDesc();
    }
    
    public List<LostFound> getLostFoundByCategory(LostFoundCategory category) {
        return lostFoundRepository.findByCategoryOrderByTimeOfPostDesc(category);
    }
    
    public List<LostFound> getLostFoundByAuthor(String authorId) {
        return lostFoundRepository.findByAuthorIdOrderByTimeOfPostDesc(authorId);
    }
    
    public Optional<LostFound> getLostFoundById(Long id) {
        return lostFoundRepository.findById(id);
    }
    
    public LostFound updateLostFound(Long id, String title, String description, String url, String authorId) {
        Optional<LostFound> lostFoundOpt = lostFoundRepository.findById(id);
        if (lostFoundOpt.isPresent()) {
            LostFound lostFound = lostFoundOpt.get();
            if (!lostFound.getAuthorId().equals(authorId)) {
                throw new RuntimeException("You can only update your own posts");
            }
            lostFound.setTitle(title);
            lostFound.setDescription(description);
            lostFound.setUrl(url);
            return lostFoundRepository.save(lostFound);
        }
        throw new RuntimeException("Lost & Found post not found");
    }
    
    public boolean deleteLostFound(Long id, String authorId) {
        Optional<LostFound> lostFoundOpt = lostFoundRepository.findById(id);
        if (lostFoundOpt.isPresent()) {
            LostFound lostFound = lostFoundOpt.get();
            // Allow deletion if user is the author OR if user is an admin
            if (!lostFound.getAuthorId().equals(authorId) && !userService.isAdmin(authorId)) {
                throw new RuntimeException("You can only delete your own posts or you must be an admin");
            }
            lostFoundRepository.delete(lostFound);
            return true;
        }
        return false;
    }
    
    public List<LostFound> searchLostFound(String keyword) {
        return lostFoundRepository.findByTitleOrDescriptionContainingOrderByTimeOfPostDesc(keyword);
    }
    
    // Collab methods
    public Collab createCollab(String authorId, String title, String description, String contactInfo, CollabSection section) {
        Collab collab = new Collab(authorId, title, description, contactInfo, section);
        return collabRepository.save(collab);
    }
    
    public List<Collab> getAllCollab() {
        return collabRepository.findAllOrderByCreatedTimeDesc();
    }
    
    public List<Collab> getCollabBySection(CollabSection section) {
        return collabRepository.findBySectionOrderByCreatedTimeDesc(section);
    }
    
    public List<Collab> getCollabByStatus(CollabStatus status) {
        return collabRepository.findByStatusOrderByCreatedTimeDesc(status);
    }
    
    public List<Collab> getCollabBySectionAndStatus(CollabSection section, CollabStatus status) {
        return collabRepository.findBySectionAndStatusOrderByCreatedTimeDesc(section, status);
    }
    
    public List<Collab> getCollabByAuthor(String authorId) {
        return collabRepository.findByAuthorIdOrderByCreatedTimeDesc(authorId);
    }
    
    public Optional<Collab> getCollabById(Long id) {
        return collabRepository.findById(id);
    }
    
    public Collab updateCollab(Long id, String title, String description, String contactInfo, CollabStatus status, String authorId) {
        Optional<Collab> collabOpt = collabRepository.findById(id);
        if (collabOpt.isPresent()) {
            Collab collab = collabOpt.get();
            if (!collab.getAuthorId().equals(authorId)) {
                throw new RuntimeException("You can only update your own posts");
            }
            collab.setTitle(title);
            collab.setDescription(description);
            collab.setContactInfo(contactInfo);
            collab.setStatus(status);
            return collabRepository.save(collab);
        }
        throw new RuntimeException("Collab post not found");
    }
    
    public boolean deleteCollab(Long id, String authorId) {
        Optional<Collab> collabOpt = collabRepository.findById(id);
        if (collabOpt.isPresent()) {
            Collab collab = collabOpt.get();
            // Allow deletion if user is the author OR if user is an admin
            if (!collab.getAuthorId().equals(authorId) && !userService.isAdmin(authorId)) {
                throw new RuntimeException("You can only delete your own posts or you must be an admin");
            }
            collabRepository.delete(collab);
            return true;
        }
        return false;
    }
    
    public List<Collab> searchCollab(String keyword) {
        return collabRepository.findByTitleOrDescriptionContainingOrderByCreatedTimeDesc(keyword);
    }
    
    // Resource methods
    public Resource createResource(String authorId, String title, String description, String url, ResourceCategory category) {
        Resource resource = new Resource(authorId, title, description, url, category);
        return resourceRepository.save(resource);
    }
    
    public List<Resource> getAllResources() {
        return resourceRepository.findAllOrderByCreatedTimeDesc();
    }
    
    public List<Resource> getResourcesByCategory(ResourceCategory category) {
        return resourceRepository.findByCategoryOrderByCreatedTimeDesc(category);
    }
    
    public List<Resource> getResourcesByAuthor(String authorId) {
        return resourceRepository.findByAuthorIdOrderByCreatedTimeDesc(authorId);
    }
    
    public Optional<Resource> getResourceById(Long id) {
        return resourceRepository.findById(id);
    }
    
    public Resource updateResource(Long id, String title, String description, String url, String authorId) {
        Optional<Resource> resourceOpt = resourceRepository.findById(id);
        if (resourceOpt.isPresent()) {
            Resource resource = resourceOpt.get();
            if (!resource.getAuthorId().equals(authorId)) {
                throw new RuntimeException("You can only update your own posts");
            }
            resource.setTitle(title);
            resource.setDescription(description);
            resource.setUrl(url);
            return resourceRepository.save(resource);
        }
        throw new RuntimeException("Resource not found");
    }
    
    public boolean deleteResource(Long id, String authorId) {
        Optional<Resource> resourceOpt = resourceRepository.findById(id);
        if (resourceOpt.isPresent()) {
            Resource resource = resourceOpt.get();
            // Allow deletion if user is the author OR if user is an admin
            if (!resource.getAuthorId().equals(authorId) && !userService.isAdmin(authorId)) {
                throw new RuntimeException("You can only delete your own posts or you must be an admin");
            }
            resourceRepository.delete(resource);
            return true;
        }
        return false;
    }
    
    public List<Resource> searchResources(String keyword) {
        return resourceRepository.findByTitleOrDescriptionContainingOrderByCreatedTimeDesc(keyword);
    }
    
    // Admin Content Moderation Methods
    
    public boolean deletePostAsAdmin(Long postId, String adminId) {
        if (!userService.isAdmin(adminId)) {
            throw new RuntimeException("Only admins can delete any posts");
        }
        
        Optional<Post> postOpt = postRepository.findById(postId);
        if (postOpt.isPresent()) {
            postRepository.delete(postOpt.get());
            System.out.println("Admin " + adminId + " deleted post ID: " + postId);
            return true;
        }
        return false;
    }
    
    public boolean deleteLostFoundAsAdmin(Long id, String adminId) {
        if (!userService.isAdmin(adminId)) {
            throw new RuntimeException("Only admins can delete any posts");
        }
        
        Optional<LostFound> lostFoundOpt = lostFoundRepository.findById(id);
        if (lostFoundOpt.isPresent()) {
            lostFoundRepository.delete(lostFoundOpt.get());
            System.out.println("Admin " + adminId + " deleted Lost & Found post ID: " + id);
            return true;
        }
        return false;
    }
    
    public boolean deleteCollabAsAdmin(Long id, String adminId) {
        if (!userService.isAdmin(adminId)) {
            throw new RuntimeException("Only admins can delete any posts");
        }
        
        Optional<Collab> collabOpt = collabRepository.findById(id);
        if (collabOpt.isPresent()) {
            collabRepository.delete(collabOpt.get());
            System.out.println("Admin " + adminId + " deleted Collab post ID: " + id);
            return true;
        }
        return false;
    }
    
    public boolean deleteResourceAsAdmin(Long id, String adminId) {
        if (!userService.isAdmin(adminId)) {
            throw new RuntimeException("Only admins can delete any posts");
        }
        
        Optional<Resource> resourceOpt = resourceRepository.findById(id);
        if (resourceOpt.isPresent()) {
            resourceRepository.delete(resourceOpt.get());
            System.out.println("Admin " + adminId + " deleted Resource ID: " + id);
            return true;
        }
        return false;
    }
}