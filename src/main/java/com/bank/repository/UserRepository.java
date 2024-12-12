package com.bank.repository;

import com.bank.entity.Users;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;



public interface UserRepository extends JpaRepository<Users, String> {
    Users findByEmail(String email);
    Users findByName(String name);

}
