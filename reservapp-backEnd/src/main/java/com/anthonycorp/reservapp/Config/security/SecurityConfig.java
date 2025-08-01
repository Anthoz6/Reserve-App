package com.anthonycorp.reservapp.Config.security;

import com.anthonycorp.reservapp.Config.web.filter.JwtTokenValidator;
import com.anthonycorp.reservapp.User.application.UserDetails.UserDetailsServiceImpl;
import com.anthonycorp.reservapp.Utils.web.JwtUtils;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtUtils jwtUtils;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(http -> {
                    http.requestMatchers(HttpMethod.POST, "/auth/login").permitAll();

                    // Users
                    http.requestMatchers(HttpMethod.GET, "/users").hasRole("ADMIN");
                    http.requestMatchers(HttpMethod.POST, "/users").hasAnyRole("ADMIN", "PROVIDER", "CUSTOMER");
                    http.requestMatchers(HttpMethod.PATCH, "/users/{userId}").hasRole("ADMIN");
                    http.requestMatchers(HttpMethod.DELETE, "/users/{userId}").hasRole("ADMIN");

                    // Services
                    http.requestMatchers(HttpMethod.GET, "/services/**").hasAnyRole("CUSTOMER", "PROVIDER", "ADMIN");
                    http.requestMatchers(HttpMethod.POST, "/services/**").hasRole("PROVIDER");
                    http.requestMatchers(HttpMethod.PATCH, "/services/**").hasRole("PROVIDER");
                    http.requestMatchers(HttpMethod.DELETE, "/services/**").hasAnyRole("PROVIDER", "ADMIN");

                    // Reservations
                    http.requestMatchers("/reservations/**").hasRole("CUSTOMER");

                    // Provider Reservations and Service Management
                    http.requestMatchers("/provider/reservations/**").hasRole("PROVIDER");
                    http.requestMatchers("/provider/services/**").hasRole("ADMIN");
                    
                    http.anyRequest().denyAll();
                })
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((req, res, ex) -> {
                            System.out.println("AUTH ERROR: " + ex.getMessage());
                            res.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
                        })
                        .accessDeniedHandler((req, res, ex) -> {
                            System.out.println("ACCESS DENIED: " + ex.getMessage());
                            res.sendError(HttpServletResponse.SC_FORBIDDEN, ex.getMessage());
                        })
                )
                .addFilterBefore(new JwtTokenValidator(jwtUtils), BasicAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsServiceImpl userDetailsService) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder());
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
