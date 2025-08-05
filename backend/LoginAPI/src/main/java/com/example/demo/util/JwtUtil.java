// src/main/java/com/example/demo/util/JwtUtil.java
package com.example.demo.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.nio.charset.StandardCharsets;
import io.jsonwebtoken.Claims;


@Component
public class JwtUtil {
    private final String secret = "a-very-long-and-secure-secret-key-for-jwt-256-bits";
    private final long validity = 1000L * 60 * 60;

    Key secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), SignatureAlgorithm.HS256.getJcaName());

    public String createToken(String sub) {
        return Jwts.builder()
                .setSubject(sub)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + validity))
                .signWith(secretKey)
                .compact();
    }
    
public Claims getClaims(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token)
            .getBody();
}

public boolean validateToken(String token) {
    try {
        Jwts.parserBuilder()
            .setSigningKey(secretKey)
            .build()
            .parseClaimsJws(token);
        return true;
    } catch (Exception e) {
        return false;
    }
}


}
