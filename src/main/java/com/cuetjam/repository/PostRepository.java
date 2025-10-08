package com.cuetjam.repository;

import com.cuetjam.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByAuthorIdOrderByTimeOfPostDesc(String authorId);
    
    @Query("SELECT p FROM Post p ORDER BY p.timeOfPost DESC")
    List<Post> findAllOrderByTimeOfPostDesc();
    
    @Query("SELECT p FROM Post p WHERE p.title LIKE %:keyword% OR p.description LIKE %:keyword% ORDER BY p.timeOfPost DESC")
    List<Post> findByTitleOrDescriptionContainingOrderByTimeOfPostDesc(@Param("keyword") String keyword);
    
    @Query("SELECT p FROM Post p WHERE p.author.department.id = :departmentId ORDER BY p.timeOfPost DESC")
    List<Post> findByAuthorDepartmentOrderByTimeOfPostDesc(@Param("departmentId") Long departmentId);
}