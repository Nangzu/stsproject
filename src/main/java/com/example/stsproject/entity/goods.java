package com.example.stsproject.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "goods") // 테이블 이름을 명시
public class goods {

    @Id
    @Column(name = "goods_id") // primary key
    private String goodsId;

    @Column(name = "id")
    private String id;

    @Column(name = "mrate")
    private BigDecimal mrate;

    @Column(name = "limit")
    private BigDecimal limit;

    @Column(name = "dates")
    private Date dates;

    @Column(name = "detail")
    private String detail;

    @Column(name = "b_name")
    private String bName;

    @Column(name = "score")
    private BigDecimal score;

    // 기본 생성자
    public goods() {}

    // 게터 및 세터
    public String getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(String goodsId) {
        this.goodsId = goodsId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public BigDecimal getMrate() {
        return mrate;
    }

    public void setMrate(BigDecimal mrate) {
        this.mrate = mrate;
    }

    public BigDecimal getLimit() {
        return limit;
    }

    public void setLimit(BigDecimal limit) {
        this.limit = limit;
    }

    public Date getDates() {
        return dates;
    }

    public void setDates(Date dates) {
        this.dates = dates;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public String getbName() {
        return bName;
    }

    public void setbName(String bName) {
        this.bName = bName;
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }
}
