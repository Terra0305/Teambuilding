package com.example.demo.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 내용이 비어있는 게 정상입니다. JpaRepository가 마법을 부릴 겁니다.
}
