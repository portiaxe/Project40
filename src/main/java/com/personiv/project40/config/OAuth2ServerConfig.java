package com.personiv.project40.config;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultAccessTokenConverter;

@Configuration
@EnableAuthorizationServer
public class OAuth2ServerConfig extends AuthorizationServerConfigurerAdapter {

	@Autowired
	private AuthenticationManager authenticationManager;
	
	
	@Bean
	public DataSource dataSource() {
	    DriverManagerDataSource dataSource = new DriverManagerDataSource();
	 
	    dataSource.setDriverClassName("com.mysql.jdbc.Driver");
	    dataSource.setUrl("jdbc:mysql://localhost/jwt");
	    dataSource.setUsername("root");
	    dataSource.setPassword("whosyourdaddy");
	    return dataSource;
	}
	@Override	
	public void configure(final ClientDetailsServiceConfigurer clients)
			throws Exception {
//		clients.inMemory()
//				.withClient("project40_clients")
//				.authorizedGrantTypes("authorization_code","client_credentials", "refresh_token")
//				.authorities("ROLE_CLIENT","ROLE_TRUSTED_CLIENT")
//				.scopes("read", "write" ,"trust")
//				.resourceIds("oauth2-resource")
//				.secret("Ksw3+Bu8ip%K^8re;v<R");
		
//		clients.inMemory()
//		.withClient("project40_clients")
//		.authorizedGrantTypes("authorization_code","client_credentials", "refresh_token")
//		.authorities("ROLE_CLIENT","ROLE_TRUSTED_CLIENT")
//		.scopes("read", "write" ,"trust")
//		.resourceIds("oauth2-resource")
//		.secret("Ksw3+Bu8ip%K^8re;v<R");
		clients.jdbc(dataSource());
		
	}

	@Override
	public void configure(AuthorizationServerSecurityConfigurer oauthServer)
			throws Exception {
		oauthServer.checkTokenAccess("isAuthenticated()");
	}
	
	@Bean
	public DefaultAccessTokenConverter defaultAccessTokenConverter() {
		return new DefaultAccessTokenConverter();
	}
	
	@Override
	public void configure(AuthorizationServerEndpointsConfigurer endpoints)
			throws Exception {
		endpoints.authenticationManager(authenticationManager);
	}
}
