package com.cuetjam.config;

import com.cuetjam.model.*;
import com.cuetjam.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private AlumniRepository alumniRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Load departments
        loadDepartments();
        
        // Load default admin user
        loadDefaultUsers();
    }

    private void loadDepartments() {
        if (departmentRepository.count() == 0) {
            List<Department> departments = Arrays.asList(
                new Department("Architecture", "ARC"),
                new Department("Biomedical Engineering", "BME"),
                new Department("Civil Engineering", "CE"),
                new Department("Computer Science & Engineering", "CSE"),
                new Department("Electrical And Electronic Engineering", "EEE"),
                new Department("Electronics & Telecommunication Engineering", "ETE"),
                new Department("Materials And Metallurgical Engineering", "MME"),
                new Department("Mechanical Engineering", "ME"),
                new Department("Mechatronics & Industrial Engineering", "MIE"),
                new Department("Petroleum And Mining Engineering", "PME"),
                new Department("Urban & Regional Planning", "URP"),
                new Department("Water Resources Engineering", "WRE")
            );
            
            departmentRepository.saveAll(departments);
            System.out.println("Loaded " + departments.size() + " departments");
        }
    }

    private void loadDefaultUsers() {
        Department cseDept = departmentRepository.findByCode("CSE")
            .orElseThrow(() -> new RuntimeException("CSE department not found"));
        
        // Create 5 admin students from CSE Batch 2022
        String[][] adminUsers = {
            {"Olid Hussan Opu", "u2204069@student.cuet.ac.bd", "123456"},
            {"Abdur Rashid Raj", "u2204072@student.cuet.ac.bd", "123456"},
            {"Sakawat Kabir", "u2204085@student.cuet.ac.bd", "123456"},
            {"Srabon Islam", "u2204096@student.cuet.ac.bd", "123456"},
            {"Mahfuzur Rahman", "u2204097@student.cuet.ac.bd", "123456"}
        };
        
        for (String[] userData : adminUsers) {
            if (userRepository.findByEmail(userData[1]).isEmpty()) {
                Student adminStudent = new Student();
                adminStudent.setUserId(UUID.randomUUID().toString());
                adminStudent.setName(userData[0]);
                adminStudent.setEmail(userData[1]);
                adminStudent.setPassword(passwordEncoder.encode(userData[2]));
                adminStudent.setDepartment(cseDept);
                adminStudent.setIsVerified(true);
                adminStudent.setUserType(UserType.STUDENT);
                adminStudent.setCreatedAt(LocalDateTime.now());
                adminStudent.setUpdatedAt(LocalDateTime.now());
                adminStudent.setBatch(2022);
                adminStudent.setIsAdmin(true);
                
                studentRepository.save(adminStudent);
                
                System.out.println("Created admin user: " + userData[0] + " (" + userData[1] + ") / " + userData[2]);
            }
        }
        
        // Create legacy admin student
        // if (userRepository.findByEmail("admin@cuet.ac.bd").isEmpty()) {
        //     Student adminStudent = new Student();
        //     adminStudent.setUserId(UUID.randomUUID().toString());
        //     adminStudent.setName("System Administrator");
        //     adminStudent.setEmail("admin@cuet.ac.bd");
        //     adminStudent.setPassword(passwordEncoder.encode("admin123"));
        //     adminStudent.setDepartment(cseDept);
        //     adminStudent.setIsVerified(true);
        //     adminStudent.setUserType(UserType.STUDENT);
        //     adminStudent.setCreatedAt(LocalDateTime.now());
        //     adminStudent.setUpdatedAt(LocalDateTime.now());
        //     adminStudent.setBatch(2020);
        //     adminStudent.setIsAdmin(true);
            
        //     studentRepository.save(adminStudent);
            
        //     System.out.println("Created admin user: admin@cuet.ac.bd / admin123");
        // }
        
        // Create sample faculty
        if (userRepository.findByEmail("faculty@cuet.ac.bd").isEmpty()) {
            Faculty faculty = new Faculty();
            faculty.setUserId(UUID.randomUUID().toString());
            faculty.setName("Dr. Pranab Kumar Dhar");
            faculty.setEmail("faculty@cuet.ac.bd");
            faculty.setPassword(passwordEncoder.encode("123456"));
            faculty.setDepartment(cseDept);
            faculty.setIsVerified(true);
            faculty.setUserType(UserType.FACULTY);
            faculty.setCreatedAt(LocalDateTime.now());
            faculty.setUpdatedAt(LocalDateTime.now());
            faculty.setDesignation("Professor");
            faculty.setResearchAreas("Machine Learning, Software Engineering");
            
            facultyRepository.save(faculty);
            
            System.out.println("Created faculty user: faculty@cuet.ac.bd / 123456");
        }
        
        // Create sample student
        if (userRepository.findByEmail("u2204011@student.cuet.ac.bd").isEmpty()) {
            Student student = new Student();
            student.setUserId(UUID.randomUUID().toString());
            student.setName("Asif Hasan");
            student.setEmail("u2204011@student.cuet.ac.bd");
            student.setPassword(passwordEncoder.encode("123456"));
            student.setDepartment(cseDept);
            student.setIsVerified(true);
            student.setUserType(UserType.STUDENT);
            student.setCreatedAt(LocalDateTime.now());
            student.setUpdatedAt(LocalDateTime.now());
            student.setBatch(2021);
            student.setIsAdmin(false);
            
            studentRepository.save(student);
            
            System.out.println("Created student user: u2204011@student.cuet.ac.bd / 123456");
        }
    }
}