package com.personiv.project40.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.personiv.project40.facade.IAuthenticationFacade;

@Controller
public class SecurityController {
	
	@Autowired
    private IAuthenticationFacade authenticationFacade;
	
	@RequestMapping(value = "/username", method = RequestMethod.GET)
    @ResponseBody
    public String currentUserName(Authentication authentication) {
		System.out.println(authentication);
        return authentication.getName();
    }
	
	@RequestMapping(value = "/username2", method = RequestMethod.GET)
	@ResponseBody
	public String currentUserNameSimple() {
	   Authentication authentication = authenticationFacade.getAuthentication();
	   return authentication.getName();
	}
}