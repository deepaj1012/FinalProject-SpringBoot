package com.helpbridge.service;

import com.helpbridge.enums.UserStatus;
import com.helpbridge.model.User;
import com.helpbridge.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // We can check status here or in controller
        // if (user.getStatus() != UserStatus.Approved) ...

        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPasswordHash(),
                java.util.Collections
                        .singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                "ROLE_" + user.getRole())));
    }
}
