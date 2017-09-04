package com.personiv.project40.controller;

import java.security.Principal;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;

import com.personiv.project40.model.User;
import com.personiv.project40.service.UserService;


@RestController
public class UserResource {
	@Autowired
	private UserService userService;
	
	@RequestMapping(value = "/User/{id}", method = RequestMethod.GET)	   
	public User getUser(@PathVariable("id") Integer id){
		User user = userService.getUserById(id);
		return user;	
	}
	
	@RequestMapping(value = "/User/findByUsername/{username}", method = RequestMethod.GET)	   
	public User getUser(@PathVariable("username") String username){
		User user = userService.getUserByUsername(username);
		return user;	
	}
	@RequestMapping(value = "/User", method = RequestMethod.GET)
	public ResponseEntity<List<User>> listAllUsers() {
        List<User> users = userService.getUsers();
        if(users.isEmpty()){
            return new ResponseEntity<List<User>>(HttpStatus.NO_CONTENT);//You many decide to return HttpStatus.NOT_FOUND
        }
        return new ResponseEntity<List<User>>(users, HttpStatus.OK);
	}
//	@RequestMapping(value = "/User", method = RequestMethod.GET)	   
//	public List<User> getUser(){
//		List<User> users = userService.getUsers();
//		return users;	
//	}
	
	@RequestMapping(value = "/login", method = RequestMethod.POST)	   
	public User login(User user){
		User auth = userService.getUser(user.getUser_name(), user.getUser_pass());
		return auth;
	}
	
	@RequestMapping("/user")
	@ResponseBody
	public Principal user(Principal user) {
		System.out.println(user);
		return user;
	}
	

	@RequestMapping(value = "/private", method = RequestMethod.GET)	   
	public String test(){
		return "afsaf";
	}
	
}
