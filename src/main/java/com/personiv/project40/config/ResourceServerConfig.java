package com.personiv.project40.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;

import com.personiv.project40.service.CustomUserDetailsService;

//public class ResourceServerConfig extends ResourceServerConfigurerAdapter{
//
//	@Override
//	public void configure(HttpSecurity http) throws Exception {
//		http
//		.authorizeRequests()
//		.antMatchers("/","/login").permitAll()
//		.antMatchers("/private")
//			.authenticated();
//	}
//	
//	
//
//
//}

@Configuration
public class ResourceServerConfig extends WebSecurityConfigurerAdapter {
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	CustomUserDetailsService userDetailsService;
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth)
			throws Exception {
		auth.inMemoryAuthentication()
			.withUser("user").password("userpwd").roles("USER")
			.and()
			.withUser("admin").password("adminpwd").roles("ADMIN")
			/* FIXME : check_token api validates client credentials via basic authorization */
			.and()
			.withUser("soncrserv").password("soncrserv").roles("CLIENT");
		
		//auth.userDetailsService(userDetailsService).passwordEncoder(new BCryptPasswordEncoder());
		auth.parentAuthenticationManager(authenticationManager);
	}
	
	@Override
	protected void configure(final HttpSecurity http) throws Exception {		
		http
		.authorizeRequests()
		.antMatchers("/","/login").permitAll()
		.antMatchers("/private").authenticated();			
	}
}
