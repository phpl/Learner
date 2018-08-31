package com.learner.learnerapp.repository;

import com.learner.learnerapp.domain.Card;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;


/**
 * Spring Data  repository for the Card entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CardRepository extends JpaRepository<Card, Long> {

    @Transactional
    Long deleteAllByUserExtraId(long userExtraId);

    List<Card> findAllByUserExtraId(long userExtraId);

    List<Card> findAllByCategoryId(long categoryId);
}
