package com.personiv.project40;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
public class AppConfig extends WebMvcConfigurerAdapter {
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
       registry.addViewController("/").setViewName("index");
       //registry.addViewController("/login").setViewName("login");
    }
}
