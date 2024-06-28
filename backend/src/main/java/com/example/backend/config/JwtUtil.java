package com.example.backend.config;

import com.example.backend.model.Agent;
import com.example.backend.repository.IAgentRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParserBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.function.Function;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class JwtUtil {

    private final IAgentRepository agentRepository;

    private static final long EXPIRATION_TIME = 86_400_000;
    private final String SECRET_KEY = "XxOUNMLNLKOUVSLQNSUMSIILOFOHOODIWpK1gyZAZLY=";

    public String createToken(Authentication authentication) {
        String email = authentication.getName();
        String roles =
                authentication.getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.joining(","));

        Agent agent = agentRepository.findByEmail(email);
        if (agent == null) {
            throw new UsernameNotFoundException(email);
        }

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .setSubject(email)
                .claim("roles", roles)
                .claim("userId", agent.getId())
                .claim("languagePreference", agent.getLanguagePreference())
                .claim("themePreference", agent.getThemePreference())
                .claim("firstName", agent.getFirstName())
                .claim("lastName", agent.getLastName())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token, String username) {
        final String usernameFromToken = getUsernameFromToken(token);
        return (username.equals(usernameFromToken) && !isTokenExpired(token));
    }

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }


    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        JwtParserBuilder parserBuilder = Jwts.parserBuilder();
        parserBuilder.setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()));
        return parserBuilder.build().parseClaimsJws(token).getBody();
    }
}