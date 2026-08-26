package com.example.demo.repository;

import com.example.demo.model.Business;
import com.example.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BusinessRepository extends JpaRepository<Business, Long> {
	List<Business> findByOwner(User owner);
	List<Business> findByOwnerIsNull();
}