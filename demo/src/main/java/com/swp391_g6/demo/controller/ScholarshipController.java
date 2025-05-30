package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.service.ScholarshipService;
import com.swp391_g6.demo.entity.Scholarship;
import com.swp391_g6.demo.dto.ScholarshipDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/scholarships")
public class ScholarshipController {

    @Autowired
    private ScholarshipService scholarshipService;

    @PostMapping("/get-all")
    public ResponseEntity<?> getAllScholarships() {
        List<Scholarship> scholarships = scholarshipService.getAllScholarships();
        List<ScholarshipDTO> dtos = scholarships.stream()
                .map(ScholarshipDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}