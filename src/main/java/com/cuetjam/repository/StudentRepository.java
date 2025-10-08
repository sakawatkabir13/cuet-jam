package com.cuetjam.repository;

import com.cuetjam.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    List<Student> findByBatch(Integer batch);
    List<Student> findByIsAdminTrue();
    
    @Query("SELECT s FROM Student s WHERE s.department.id = :departmentId")
    List<Student> findByDepartment(@Param("departmentId") Long departmentId);
    
    @Query("SELECT s FROM Student s WHERE s.batch = :batch AND s.department.id = :departmentId")
    List<Student> findByBatchAndDepartment(@Param("batch") Integer batch, @Param("departmentId") Long departmentId);
}