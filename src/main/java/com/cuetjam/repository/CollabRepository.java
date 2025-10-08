package com.cuetjam.repository;

import com.cuetjam.model.Collab;
import com.cuetjam.model.CollabSection;
import com.cuetjam.model.CollabStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollabRepository extends JpaRepository<Collab, Long> {
    List<Collab> findByAuthorIdOrderByCreatedTimeDesc(String authorId);
    List<Collab> findBySectionOrderByCreatedTimeDesc(CollabSection section);
    List<Collab> findByStatusOrderByCreatedTimeDesc(CollabStatus status);
    
    @Query("SELECT c FROM Collab c ORDER BY c.createdTime DESC")
    List<Collab> findAllOrderByCreatedTimeDesc();
    
    @Query("SELECT c FROM Collab c WHERE c.section = :section AND c.status = :status ORDER BY c.createdTime DESC")
    List<Collab> findBySectionAndStatusOrderByCreatedTimeDesc(@Param("section") CollabSection section, @Param("status") CollabStatus status);
    
    @Query("SELECT c FROM Collab c WHERE c.title LIKE %:keyword% OR c.description LIKE %:keyword% ORDER BY c.createdTime DESC")
    List<Collab> findByTitleOrDescriptionContainingOrderByCreatedTimeDesc(@Param("keyword") String keyword);
    
    @Query("SELECT c FROM Collab c WHERE c.section = :section AND (c.title LIKE %:keyword% OR c.description LIKE %:keyword%) ORDER BY c.createdTime DESC")
    List<Collab> findBySectionAndTitleOrDescriptionContainingOrderByCreatedTimeDesc(@Param("section") CollabSection section, @Param("keyword") String keyword);
}