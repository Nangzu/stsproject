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

    @Column(name = "CATEGORY")
    private String category;

    @Column(name = "AMOUNT")
    private Double amount;

    @Column(name = "TRANSACTION_DATE")
    private LocalDateTime date = LocalDateTime.now();

    @Column(name = "U_DATE")
    private String udate;

    @ManyToOne
    @JoinColumn(name = "USER_ID", nullable = false)
    private Users user;

    public Long getId(){return id;}
    public void setId(Long id){this.id = id;}

    public String getType() {
        return type;
    }
    public void setType(String type) {this.type = type;}

    public String getUDate() {
        return udate;
    }
    public void setUDate(String udate) {this.udate = udate;}

    public LocalDateTime getDate() {return date;}
    public void setDate(LocalDateTime date){this.date = date;}


    public void setUser(Users user) {
        this.user = user;
    }
    public Users getUser() {return user;}

    public String getDescription(){return description;}
    public void setDescription(String description){this.description = description;}

    public String getCategory(){return category;}
    public void setCategory(String category){this.category = category;}


    public Double getAmount(){return amount;}
    public void setAmount(Double amount){this.amount = amount;}

    public Transactions() {}

    public Long getId(){return id;}
    public void setId(Long id){this.id = id;}
}