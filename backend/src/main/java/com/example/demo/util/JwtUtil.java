// src/main/java/com/example/demo/util/JwtUtil.java
package com.example.demo.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private final String secret = "SECRET_KEY";
    private final long validity = 1000L * 60 * 60;

    public String createToken(String sub) {
        return Jwts.builder()
                .setSubject(sub)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + validity))
                .signWith(SignatureAlgorithm.HS256, secret)
                .compact();
    }
}
