package com.swp391_g6.demo.controller;

import com.swp391_g6.demo.service.ScholarshipService;
import com.swp391_g6.demo.util.JwtUtil;
import com.swp391_g6.demo.entity.Scholarship;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.dto.ScholarshipDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/scholarships")
public class ScholarshipController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ScholarshipService scholarshipService;

    @PostMapping("/get-all")
    public ResponseEntity<?> getAllScholarships(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required");
        }

        User user = jwtUtil.extractUserFromToken(token);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        List<Scholarship> scholarships = scholarshipService.getAllScholarships();
        List<ScholarshipDTO> dtos = scholarships.stream()
                .map(ScholarshipDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}