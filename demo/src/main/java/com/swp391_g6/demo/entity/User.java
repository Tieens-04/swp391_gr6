package com.swp391_g6.demo.entity;

import java.sql.Date;
import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(name = "user_id")
    private String user_id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "password_hash")
    private String password_hash;

    @Column(name = "role")
    private String role;

    @Column(name = "phone")
    private String phone;

    @Column(name = "date_of_birth")
    private Date date_of_birth;

    @Column(name = "gender")
    private String gender;

    @Column(name = "created_at", updatable = false)
    private Timestamp created_at;

    @Column(name = "updated_at")
    private Timestamp updated_at;

    public User() {
    }

    public User(String email, String password_hash) {
        this.email = email;
        this.password_hash = password_hash;
    }

    public User(String name, String email, String password_hash, String role, String phone, Date date_of_birth, String gender) {
        this.name = name;
        this.email = email;
        this.password_hash = password_hash;
        this.role = role;
        this.phone = phone;
        this.date_of_birth = date_of_birth;
        this.gender = gender;
    }

    public User(String user_id, String name, String email, String password_hash, String role, String phone,
                Date date_of_birth, String gender) {
        this.user_id = user_id;
        this.name = name;
        this.email = email;
        this.password_hash = password_hash;
        this.role = role;
        this.phone = phone;
        this.date_of_birth = date_of_birth;
        this.gender = gender;
    }

    public String getUserId() {
        return user_id;
    }

    public void setUserId(String user_id) {
        this.user_id = user_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return password_hash;
    }

    public void setPasswordHash(String password_hash) {
        this.password_hash = password_hash;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Date getDateOfBirth() {
        return date_of_birth;
    }

    public void setDateOfBirth(Date date_of_birth) {
        this.date_of_birth = date_of_birth;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Timestamp getCreatedAt() {
        return created_at;
    }

    public void setCreatedAt(Timestamp created_at) {
        this.created_at = created_at;
    }

    public Timestamp getUpdatedAt() {
        return updated_at;
    }

    public void setUpdatedAt(Timestamp updated_at) {
        this.updated_at = updated_at;
    }

}
