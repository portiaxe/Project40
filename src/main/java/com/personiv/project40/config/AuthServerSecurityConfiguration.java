package com.personiv.project40.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.personiv.project40.service.CustomUserDetailsService;


@Configuration
public class AuthServerSecurityConfiguration extends WebSecurityConfigurerAdapter {
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	CustomUserDetailsService userDetailsService;
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth)
			throws Exception {
//		auth.inMemoryAuthentication()
//			.withUser("user").password("userpwd").roles("USER")
//			.and()
//			.withUser("admin").password("adminpwd").roles("ADMIN")
//			/* FIXME : check_token api validates client credentials via basic authorization */
//			.and()
//			.withUser("soncrserv").password("soncrserv").roles("CLIENT");
//		
		auth.userDetailsService(userDetailsService).passwordEncoder(new BCryptPasswordEncoder());
		auth.parentAuthenticationManager(authenticationManager);
	}
	
	@Override
	protected void configure(final HttpSecurity http) throws Exception {
		
		http
			.antMatcher("/")
			.formLogin().loginPage("/").permitAll() //redirect to this page if no authenticated
		.and()
			.requestMatchers()
			.antMatchers("/","/login", "/oauth/authorize", "/oauth/confirm_access")
		.and()
			.authorizeRequests().anyRequest().authenticated();
//		http
//		.antMatcher("/")
//		.formLogin().loginPage("/login").permitAll()
//	    .and()
//			.requestMatchers()
//			.antMatchers("/","/login", "/oauth/authorize", "/oauth/confirm_access")
//		.and()
//			.authorizeRequests().anyRequest().authenticated();
	}
}
