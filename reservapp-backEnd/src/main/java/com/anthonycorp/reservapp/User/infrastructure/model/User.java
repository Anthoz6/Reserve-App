package com.anthonycorp.reservapp.User.infrastructure.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;
    // Return the email as the username
    @Getter
    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String password;

    @ManyToOne()
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.getName()));
    }

    @Override
    public String getUsername() {
        return this.email; //Return the email as the username
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Return true if the account is not expired
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Return true if the account is not locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Return true if the credentials are not expired
    }

    @Override
    public boolean isEnabled() {
        return true; // Return true if the account is enabled
    }
}
