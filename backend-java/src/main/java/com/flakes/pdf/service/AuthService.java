package com.flakes.pdf.service;

import com.flakes.pdf.model.User;
import com.flakes.pdf.repository.UserRepository;
import com.flakes.pdf.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Service class for User Authentication and Registration.
 */
@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    /**
     * Registers a new user in the system.
     * Encrypts the password before saving to MongoDB.
     */
    public Map<String, Object> register(User user) {
        // Check if user already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent() || 
            userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("User with this email or username already exists");
        }

        // Hash the password for security
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        // Generate JWT token for the new user
        String token = jwtUtils.generateToken(savedUser.getEmail());

        return createAuthResponse("User created successfully", savedUser, token);
    }

    /**
     * Authenticates a user and returns a JWT token.
     */
    public Map<String, Object> login(String emailOrUsername, String password) {
        // Find user by either email or username
        User user = userRepository.findByEmailOrUsername(emailOrUsername, emailOrUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify the password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate JWT token
        String token = jwtUtils.generateToken(user.getEmail());

        return createAuthResponse("User logged in successfully", user, token);
    }

    /**
     * Helper method to build a consistent authentication response.
     */
    private Map<String, Object> createAuthResponse(String message, User user, String token) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("user", user);
        response.put("token", token);
        return response;
    }
}
