package com.learner.learnerapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.learner.learnerapp.domain.ImageData;
import com.learner.learnerapp.repository.ImageDataRepository;
import com.learner.learnerapp.web.rest.errors.BadRequestAlertException;
import com.learner.learnerapp.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * REST controller for managing ImageData.
 */
@RestController
@RequestMapping("/api")
public class ImageDataResource {

    private final Logger log = LoggerFactory.getLogger(ImageDataResource.class);

    private static final String ENTITY_NAME = "imageData";

    private final ImageDataRepository imageDataRepository;

    public ImageDataResource(ImageDataRepository imageDataRepository) {
        this.imageDataRepository = imageDataRepository;
    }

    /**
     * POST  /image-data : Create a new imageData.
     *
     * @param imageData the imageData to create
     * @return the ResponseEntity with status 201 (Created) and with body the new imageData, or with status 400 (Bad Request) if the imageData has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/image-data")
    @Timed
    public ResponseEntity<ImageData> createImageData(@RequestBody ImageData imageData) throws URISyntaxException {
        log.debug("REST request to save ImageData : {}", imageData);
        if (imageData.getId() != null) {
            throw new BadRequestAlertException("A new imageData cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ImageData result = imageDataRepository.save(imageData);
        return ResponseEntity.created(new URI("/api/image-data/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /image-data : Updates an existing imageData.
     *
     * @param imageData the imageData to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated imageData,
     * or with status 400 (Bad Request) if the imageData is not valid,
     * or with status 500 (Internal Server Error) if the imageData couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/image-data")
    @Timed
    public ResponseEntity<ImageData> updateImageData(@RequestBody ImageData imageData) throws URISyntaxException {
        log.debug("REST request to update ImageData : {}", imageData);
        if (imageData.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ImageData result = imageDataRepository.save(imageData);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, imageData.getId().toString()))
            .body(result);
    }

    /**
     * GET  /image-data : get all the imageData.
     *
     * @param filter the filter of the request
     * @return the ResponseEntity with status 200 (OK) and the list of imageData in body
     */
    @GetMapping("/image-data")
    @Timed
    public List<ImageData> getAllImageData(@RequestParam(required = false) String filter) {
        if ("card-is-null".equals(filter)) {
            log.debug("REST request to get all ImageDatas where card is null");
            return StreamSupport
                .stream(imageDataRepository.findAll().spliterator(), false)
                .filter(imageData -> imageData.getCard() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all ImageData");
        return imageDataRepository.findAll();
    }

    /**
     * GET  /image-data/:id : get the "id" imageData.
     *
     * @param id the id of the imageData to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the imageData, or with status 404 (Not Found)
     */
    @GetMapping("/image-data/{id}")
    @Timed
    public ResponseEntity<ImageData> getImageData(@PathVariable Long id) {
        log.debug("REST request to get ImageData : {}", id);
        Optional<ImageData> imageData = imageDataRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(imageData);
    }

    /**
     * DELETE  /image-data/:id : delete the "id" imageData.
     *
     * @param id the id of the imageData to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/image-data/{id}")
    @Timed
    public ResponseEntity<Void> deleteImageData(@PathVariable Long id) {
        log.debug("REST request to delete ImageData : {}", id);

        imageDataRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
