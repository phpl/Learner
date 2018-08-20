package com.learner.learnerapp.repository;

import com.learner.learnerapp.domain.Card;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Card entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CardRepository extends JpaRepository<Card, Long> {

    @Query(value = "select distinct card from Card card left join fetch card.tags",
        countQuery = "select count(distinct card) from Card card")
    Page<Card> findAllWithEagerRelationships(Pageable pageable);

    @Query(value = "select distinct card from Card card left join fetch card.tags")
    List<Card> findAllWithEagerRelationships();

    @Query("select card from Card card left join fetch card.tags where card.id =:id")
    Optional<Card> findOneWithEagerRelationships(@Param("id") Long id);

}
