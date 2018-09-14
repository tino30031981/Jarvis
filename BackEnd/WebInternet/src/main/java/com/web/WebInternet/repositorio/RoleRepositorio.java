package com.web.WebInternet.repositorio;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.web.WebInternet.model.Role;

@Repository("RoleRepositorio")
public interface RoleRepositorio extends JpaRepository<Role, Integer> {
    Role findByRole(String role);

}