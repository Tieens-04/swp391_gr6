package com.swp391_g6.demo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "id_generator")
public class IdGenerator {

    @Id
    @Column(name = "type", length = 10, nullable = false)
    private String type;

    @Column(name = "current_number", nullable = false)
    private int currentNumber = 0;

    public IdGenerator() {
    }

    public IdGenerator(String type, int currentNumber) {
        this.type = type;
        this.currentNumber = currentNumber;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getCurrentNumber() {
        return currentNumber;
    }

    public void setCurrentNumber(int currentNumber) {
        this.currentNumber = currentNumber;
    }

}