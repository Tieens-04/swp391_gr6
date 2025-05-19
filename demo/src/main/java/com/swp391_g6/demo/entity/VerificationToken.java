package com.swp391_g6.demo.entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "verification_tokens")
public class VerificationToken {

    @Id
    @Column(name = "email")
    private String email;

    @Column(name = "otp_code")
    private String otp_code;

    @Column(name = "expires_at")
    private Timestamp expiresAt;

    public VerificationToken() {
    }

    public VerificationToken(String email, String otp_code, Timestamp expiresAt) {
        this.email = email;
        this.otp_code = otp_code;
        this.expiresAt = expiresAt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp_code() {
        return otp_code;
    }

    public void setOtp_code(String otp_code) {
        this.otp_code = otp_code;
    }

    public Timestamp getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Timestamp expiresAt) {
        this.expiresAt = expiresAt;
    }

}
