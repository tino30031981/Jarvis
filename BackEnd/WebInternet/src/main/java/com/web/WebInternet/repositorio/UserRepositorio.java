package com.web.WebInternet.repositorio;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.web.WebInternet.model.User;

@Repository("UserRepositorio")
public interface UserRepositorio extends JpaRepository<User, Long> {
    User findByEmail(String email);
}