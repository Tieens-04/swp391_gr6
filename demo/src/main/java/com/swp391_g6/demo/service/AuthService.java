package com.swp391_g6.demo.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.swp391_g6.demo.repository.UserRepository;
import com.swp391_g6.demo.repository.VerificationTokenRepository;
import com.swp391_g6.demo.util.EmailUtil;
import com.swp391_g6.demo.entity.User;
import com.swp391_g6.demo.entity.VerificationToken;

@Service
public class AuthService {

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private EmailUtil emailUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private IdGeneratorService idGeneratorService;

    public void sendOtp(String email) {
        String otp = String.format("%06d", new Random().nextInt(999999));

        VerificationToken token = new VerificationToken();
        token.setEmail(email);
        token.setOtp_code(otp);;
        token.setExpiresAt(Timestamp.valueOf(LocalDateTime.now().plusMinutes(5)));

        verificationTokenRepository.save(token);
        emailUtil.sendOtpEmail(email, otp);
    }

    public boolean verifyOtp(String email, String otp) {
        Optional<VerificationToken> optionalToken = verificationTokenRepository.findById(email);

        if (optionalToken.isEmpty())
            return false;

        VerificationToken token = optionalToken.get();

        if (token.getExpiresAt().before(Timestamp.valueOf(LocalDateTime.now())))
            return false;

        return token.getOtp_code().equals(otp);
    }

    public void createUser(String full_name, String email, String password, String role) {
        String user_id = idGeneratorService.generateId("USER", false, 10);
        String password_hash = passwordEncoder.encode(password);
        User user = new User();
        user.setUserId(user_id);
        user.setFullName(full_name);
        user.setEmail(email);
        user.setPasswordHash(password_hash);
        user.setRole(role);
        Timestamp now = Timestamp.from(java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Bangkok")).toInstant());
        user.setCreatedAt(now);
        user.setUpdatedAt(now);
        userRepository.save(user);
    }

    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPasswordHash())) {
            return user;
        }
        return null;
    }

}
