package com.cuetjam.repository;

import com.cuetjam.model.LostFound;
import com.cuetjam.model.LostFoundCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostFoundRepository extends JpaRepository<LostFound, Long> {
    List<LostFound> findByAuthorIdOrderByTimeOfPostDesc(String authorId);
    List<LostFound> findByCategoryOrderByTimeOfPostDesc(LostFoundCategory category);
    
    @Query("SELECT lf FROM LostFound lf ORDER BY lf.timeOfPost DESC")
    List<LostFound> findAllOrderByTimeOfPostDesc();
    
    @Query("SELECT lf FROM LostFound lf WHERE lf.title LIKE %:keyword% OR lf.description LIKE %:keyword% ORDER BY lf.timeOfPost DESC")
    List<LostFound> findByTitleOrDescriptionContainingOrderByTimeOfPostDesc(@Param("keyword") String keyword);
    
    @Query("SELECT lf FROM LostFound lf WHERE lf.category = :category AND (lf.title LIKE %:keyword% OR lf.description LIKE %:keyword%) ORDER BY lf.timeOfPost DESC")
    List<LostFound> findByCategoryAndTitleOrDescriptionContainingOrderByTimeOfPostDesc(@Param("category") LostFoundCategory category, @Param("keyword") String keyword);
}