package com.learner.learnerapp.repository;

import com.learner.learnerapp.domain.TextData;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the TextData entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TextDataRepository extends JpaRepository<TextData, Long> {

}
