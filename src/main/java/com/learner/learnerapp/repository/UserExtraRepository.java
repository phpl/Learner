package com.learner.learnerapp.repository;

import com.learner.learnerapp.domain.UserExtra;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the UserExtra entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserExtraRepository extends JpaRepository<UserExtra, Long> {

}
