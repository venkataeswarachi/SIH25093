package com.vvit.University.services;

import com.vvit.University.payload.LoginDTO;
import com.vvit.University.payload.RequestDTO;
import com.vvit.University.payload.UserRegisterDTO;
import org.springframework.http.ResponseEntity;

public interface UserService {
    public ResponseEntity<String> signup(UserRegisterDTO userRegisterDTO);
    public ResponseEntity<String> signin(LoginDTO dto);
    public ResponseEntity<String> changePassword(RequestDTO request);
}
