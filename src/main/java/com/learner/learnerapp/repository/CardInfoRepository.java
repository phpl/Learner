package com.learner.learnerapp.repository;

import com.learner.learnerapp.domain.CardInfo;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the CardInfo entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CardInfoRepository extends JpaRepository<CardInfo, Long> {

}
