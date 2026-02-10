package com.vvit.University.serviceImplementation;

import com.vvit.University.models.Users;
import com.vvit.University.payload.LoginDTO;
import com.vvit.University.payload.RequestDTO;
import com.vvit.University.payload.UserRegisterDTO;
import com.vvit.University.repository.UserRepository;
import com.vvit.University.security.JwtUtil;
import com.vvit.University.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public ResponseEntity<String> signup(UserRegisterDTO userDTO) {
        Users user = new Users();
        user.setEmail(userDTO.getEmail());
        user.setPassword(encoder.encode(userDTO.getPassword()));
        user.setRole(userDTO.getRole());
        try {
            userRepository.save(user);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("successfully created");
    }

    @Override
    public ResponseEntity<String> signin(LoginDTO dto) {
        Users user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found : signin"));


        if (user.isFirstlogin()) {
            return ResponseEntity
                    .status(200)
                    .body("CHANGE_PASSWORD_REQUIRED");
        }
        if (!encoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(token);
    }

    @Override
    public ResponseEntity<String> changePassword(RequestDTO request) {
        Users user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not Found!"));
        if(!user.isFirstlogin()){
            return ResponseEntity.status(403).body("Contact Admin");
        }
        user.setFirstlogin(false);
        user.setPassword(encoder.encode(request.getNewpassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Updated successfully.");
    }
}
