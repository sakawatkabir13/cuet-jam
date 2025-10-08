package com.cuetjam.repository;

import com.cuetjam.model.Resource;
import com.cuetjam.model.ResourceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByAuthorIdOrderByCreatedTimeDesc(String authorId);
    List<Resource> findByCategoryOrderByCreatedTimeDesc(ResourceCategory category);
    
    @Query("SELECT r FROM Resource r ORDER BY r.createdTime DESC")
    List<Resource> findAllOrderByCreatedTimeDesc();
    
    @Query("SELECT r FROM Resource r WHERE r.title LIKE %:keyword% OR r.description LIKE %:keyword% ORDER BY r.createdTime DESC")
    List<Resource> findByTitleOrDescriptionContainingOrderByCreatedTimeDesc(@Param("keyword") String keyword);
    
    @Query("SELECT r FROM Resource r WHERE r.category = :category AND (r.title LIKE %:keyword% OR r.description LIKE %:keyword%) ORDER BY r.createdTime DESC")
    List<Resource> findByCategoryAndTitleOrDescriptionContainingOrderByCreatedTimeDesc(@Param("category") ResourceCategory category, @Param("keyword") String keyword);
}