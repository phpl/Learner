package com.learner.learnerapp.repository;

import com.learner.learnerapp.domain.Category;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;


/**
 * Spring Data  repository for the Category entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Transactional
    Long deleteAllByUserExtraId(long userExtraId);
}
