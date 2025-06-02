package com.swp391_g6.demo.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.entity.Seeker;
import com.swp391_g6.demo.service.SeekerService;
import com.swp391_g6.demo.util.JwtUtil;

@RestController
@RequestMapping("/api/seeker")
public class SeekerController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private SeekerService seekerService;

    
    @PostMapping("/profile")
    public ResponseEntity<?> getSeekerProfile(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required");
        }

        User user = jwtUtil.extractUserFromToken(token);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        Seeker seeker = seekerService.findByUser(user);
        if (seeker == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seeker profile not found");
        }

        return ResponseEntity.ok(seeker);
    }
}
