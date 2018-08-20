package com.learner.learnerapp.repository;

import com.learner.learnerapp.domain.ImageData;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ImageData entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ImageDataRepository extends JpaRepository<ImageData, Long> {

}
