package com.learner.learnerapp.repository;

import com.learner.learnerapp.domain.Card;
import com.learner.learnerapp.domain.User;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Optional;


/**
 * Spring Data  repository for the Card entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CardRepository extends JpaRepository<Card, Long> {

    @Transactional
    Long deleteAllByUserExtraId(long userExtraId);
}
