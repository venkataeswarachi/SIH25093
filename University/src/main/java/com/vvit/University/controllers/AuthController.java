package com.vvit.University.controllers;

import com.vvit.University.payload.LoginDTO;
import com.vvit.University.payload.RequestDTO;
import com.vvit.University.payload.UserRegisterDTO;
import com.vvit.University.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserService userService;
    @PostMapping("/signup")
    public ResponseEntity<String> Register(@RequestBody UserRegisterDTO user){
       return userService.signup(user);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO){
        return userService.signin(loginDTO);
    }
    @PostMapping("/changepassword")
    public ResponseEntity<String> changePass(@RequestBody RequestDTO requestDTO){
        return userService.changePassword(requestDTO);
    }

}
