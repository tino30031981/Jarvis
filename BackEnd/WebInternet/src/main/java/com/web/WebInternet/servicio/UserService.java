package com.web.WebInternet.servicio;

import com.web.WebInternet.model.Role;
import com.web.WebInternet.model.User;
import com.web.WebInternet.repositorio.RoleRepositorio;
import com.web.WebInternet.repositorio.UserRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;

@Service("userService")
public class UserService {

    private UserRepositorio userRepositorio;
    private RoleRepositorio roleRepositorio;
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserService(UserRepositorio userRepository,
                       RoleRepositorio roleRepository,
                       BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepositorio = userRepository;
        this.roleRepositorio = roleRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public User findUserByEmail(String email) {
        return userRepositorio.findByEmail(email);
    }

    public void saveUser(User user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setActive(1);
        Role userRole = roleRepositorio.findByRole("ADMIN");
        user.setRoles(new HashSet<Role>(Arrays.asList(userRole)));
        userRepositorio.save(user);
    }

}