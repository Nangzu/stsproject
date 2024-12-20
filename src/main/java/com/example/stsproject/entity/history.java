package com.example.stsproject.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;


import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "history")
@Getter
@Setter
public class history {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int nums;

    @Column(nullable = false, length = 50)
    @JsonProperty("id") // JSON 직렬화 시 매핑
    private String id;

    @Column(nullable = false, length = 50)
    @JsonProperty("division") // JSON 직렬화 시 매핑
    private String division;

    @Column(nullable = false, precision = 10, scale = 2)
    @JsonProperty("amount") // JSON 직렬화 시 매핑
    private BigDecimal amount;

    @Column(nullable = true, length = 500)
    @JsonProperty("detail") // JSON 직렬화 시 매핑
    private String detail;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    @JsonProperty("dates") // JSON 직렬화 시 매핑
    private Date dates;

    public String getDivision() {
        return division;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getDetail() {
        return detail;
    }

    public Date getDates() {
        return dates;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public void setDates(Date dates) {
        this.dates = dates;
    }

    @Override
    public String toString() {
        return "history{" +
                "nums=" + nums +
                ", id='" + id + '\'' +
                ", division='" + division + '\'' +
                ", amount=" + amount +
                ", detail='" + detail + '\'' +
                ", dates=" + dates +
                '}';
    }
}
