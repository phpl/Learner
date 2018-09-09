package com.learner.learnerapp.repository;

import com.learner.learnerapp.domain.UserProgress;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the UserProgress entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

}
