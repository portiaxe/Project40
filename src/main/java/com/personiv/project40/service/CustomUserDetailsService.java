package com.personiv.project40.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.personiv.project40.model.User;
import com.personiv.project40.model.Role;
import java.util.HashSet;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class CustomUserDetailsService implements UserDetailsService {
	private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);
	
	@Autowired
	private UserService userService;

	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userService.getUserByUsername(username);
		 if (user == null) {
             logger.debug("user not found with the provided username");
             return null;
         }
		 return new org.springframework.security.core.userdetails
				 .User(user.getUser_name(), user.getUser_pass(),getAuthorities(user));
    
	}
	private Set<GrantedAuthority> getAuthorities(User user){
		Set<GrantedAuthority> authorities = new HashSet<>();
		
		for(Role r: user.getRoles()) {
			GrantedAuthority grantedAuthority = new SimpleGrantedAuthority(r.getRole());
			authorities.add(grantedAuthority);
		}
		return authorities;
	}
	
	 

}
