package com.swp391_g6.demo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.util.JwtUtil;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/user-manage")
    public ResponseEntity<?> userManage(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        if (token == null || token.isEmpty()) {
            System.out.println("Token is required for user management");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is required");
        }

        User user = jwtUtil.extractUserFromToken(token);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        } else if (user.getRole() == null || !user.getRole().equals("admin")) {
            System.out.println("Access denied for user: " + user.getEmail() + " with role: " + user.getRole());
            System.out.println("Token: " + token);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
        }

        return ResponseEntity.ok(user);
    }

}
