package com.vvit.University.security;

import com.vvit.University.models.Users;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
@Component
public class JwtUtil {
    @Value("${jwt.secret}")
    private String SECRET;
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(
                SECRET.getBytes()
        );
    }
    public String generateToken(Users user){

        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role",user.getRole() )
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() +  1000L * 60 * 60 * 24 * 7))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();

    }
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .parseClaimsJws(token)
                .getBody();
    }
}
