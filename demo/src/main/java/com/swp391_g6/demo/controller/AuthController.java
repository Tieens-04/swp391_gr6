package com.swp391_g6.demo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.swp391_g6.demo.dto.EmailRequest;
import com.swp391_g6.demo.dto.LoginRequest;
import com.swp391_g6.demo.dto.OtpVerificationRequest;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.service.AuthService;
import com.swp391_g6.demo.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthService authService;

    // [POST] /api/auth/send-otp - Gửi mã OTP đến email
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody EmailRequest request) {
        authService.sendOtp(request.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body("Mã OTP đã được gửi đến email của bạn");
    }

    // [POST] /api/auth/verify-otp - Xác thực mã OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerificationRequest request) {
        boolean isValid = authService.verifyOtp(request.getEmail(), request.getOtp(), request.getTask());

        if (!isValid) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("OTP không hợp lệ hoặc đã hết hạn");
        }
        return ResponseEntity.status(HttpStatus.OK).body("OTP hợp lệ. Tiếp tục đăng ký.");
    }

    // [POST] /api/auth/register - Đăng ký người dùng
    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        authService.createUser(user.getFullName(), user.getEmail(), user.getPasswordHash(), user.getRole());
        String jwt = jwtUtil.generateToken(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("token", jwt));
    }

    // [POST] /api/auth/login - Đăng nhập người dùng
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        User user = authService.authenticate(request.getEmail(), request.getPassword());
        if (user != null) {
            String jwt = jwtUtil.generateToken(user);
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("token", jwt));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody EmailRequest request) {
        authService.sendResetPasswordEmail(request.getEmail());
        return ResponseEntity.status(HttpStatus.OK).body("Mã xác thực đã được gửi đến email của bạn");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        authService.updatePassword(email, newPassword);
        return ResponseEntity.status(HttpStatus.OK).body("Mật khẩu đã được cập nhật thành công");
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
        }
        String newToken = jwtUtil.refreshToken(token);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("token", newToken));
    }

}
