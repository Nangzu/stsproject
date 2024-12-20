package com.example.stsproject.entity;

import jakarta.persistence.*;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "TRANSACTIONS")
public class Transactions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // "income" or "expense"

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "AMOUNT")
    private Double amount;

    @Column(name = "TRANSACTION_DATE")
    private LocalDateTime date = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private Users user;

    public String getType() {
        return type;
    }
    public void setUser(Users user) {
        this.user = user;
    }

    public String getDescription(){return description;}
    public Double getAmount(){return amount;}

    public void setDescription(String description){this.description = description;}
    public void setAmount(Double amount){this.amount = amount;}
    public Transactions() {}
}