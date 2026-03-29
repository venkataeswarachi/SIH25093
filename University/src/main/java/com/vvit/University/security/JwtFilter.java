package com.vvit.University.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getServletPath();
        System.out.println("REQUEST PATH: " + request.getServletPath());
        if (path.startsWith("/auth") || path.startsWith("/api/auth")) {
            filterChain.doFilter(request, response);
            return;
        }


        if (path.contains("auth")) {  // 🔥 most reliable
            filterChain.doFilter(request, response);
            return;
        }
        if (
                path.startsWith("/auth") ||
                        path.startsWith("/api/auth") ||
                        path.equals("/login")
        ) {
            filterChain.doFilter(request, response);
            return;
        }
        String header = request.getHeader("Authorization");
        String authHeader = request.getHeader("Authorization");
        System.out.println("TOKEN HEADER: " + authHeader);
        if(header!=null && header.startsWith("Bearer ")){
            String token = header.substring(7);
            Claims claims = jwtUtil.extractClaims(token);
            String username = claims.getSubject();
            String role = claims.get("role",String.class);
            List<GrantedAuthority> authorities =
                    List.of(new SimpleGrantedAuthority("ROLE_" + role));

            Authentication auth =
                    new UsernamePasswordAuthenticationToken(
                            username, null, authorities);

            SecurityContextHolder.getContext().setAuthentication(auth);
        }
    filterChain.doFilter(request,response);
    }
}
