package com.learner.learnerapp.repository;

import com.learner.learnerapp.domain.UserProgress;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the UserProgress entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {

    List<UserProgress> findAllByUserExtraId(long userExtraId);

}
