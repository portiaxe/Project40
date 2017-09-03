package com.personiv.project40.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.personiv.project40.dao.UserDao;
import com.personiv.project40.model.Role;
import com.personiv.project40.model.User;

@Service
public class UserService {
	
	@Autowired
	private UserDao userDao;
	
	public User getUser(String username,String password) {
		return userDao.getUser(username,password);
	}
	
	public User getUserById(Integer id) {
		return userDao.findUserById(id);
	}
	public User getUserByUsername(String username) {
		return userDao.getUserByUsername(username);
	}
	public List<User> getUsers() {
		return userDao.getUsers();
	}
	
	public List<Role> getRoles(Integer id){
		return userDao.getRoles(id);
	}
	
}
