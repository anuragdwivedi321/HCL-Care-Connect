package com.careconnect.ehr.security;

import com.careconnect.ehr.entity.User;
import com.careconnect.ehr.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        String trimmed = identifier.trim();
        String normalized = trimmed.toLowerCase().replace(" ", ".");

        User user = userRepository.findByUsernameIgnoreCase(trimmed)
                .or(() -> userRepository.findByUsernameIgnoreCase(normalized))
                .or(() -> userRepository.findByEmailIgnoreCase(trimmed))
                .or(() -> userRepository.findByFullNameIgnoreCase(trimmed))
                .orElseThrow(() -> new UsernameNotFoundException("User '" + identifier + "' not found in our database. Please Sign Up first!"));

        return new CustomUserDetails(user);
    }
}
