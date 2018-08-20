package com.learner.learnerapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.learner.learnerapp.domain.TextData;
import com.learner.learnerapp.repository.TextDataRepository;
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
 * REST controller for managing TextData.
 */
@RestController
@RequestMapping("/api")
public class TextDataResource {

    private final Logger log = LoggerFactory.getLogger(TextDataResource.class);

    private static final String ENTITY_NAME = "textData";

    private final TextDataRepository textDataRepository;

    public TextDataResource(TextDataRepository textDataRepository) {
        this.textDataRepository = textDataRepository;
    }

    /**
     * POST  /text-data : Create a new textData.
     *
     * @param textData the textData to create
     * @return the ResponseEntity with status 201 (Created) and with body the new textData, or with status 400 (Bad Request) if the textData has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/text-data")
    @Timed
    public ResponseEntity<TextData> createTextData(@RequestBody TextData textData) throws URISyntaxException {
        log.debug("REST request to save TextData : {}", textData);
        if (textData.getId() != null) {
            throw new BadRequestAlertException("A new textData cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TextData result = textDataRepository.save(textData);
        return ResponseEntity.created(new URI("/api/text-data/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /text-data : Updates an existing textData.
     *
     * @param textData the textData to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated textData,
     * or with status 400 (Bad Request) if the textData is not valid,
     * or with status 500 (Internal Server Error) if the textData couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/text-data")
    @Timed
    public ResponseEntity<TextData> updateTextData(@RequestBody TextData textData) throws URISyntaxException {
        log.debug("REST request to update TextData : {}", textData);
        if (textData.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        TextData result = textDataRepository.save(textData);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, textData.getId().toString()))
            .body(result);
    }

    /**
     * GET  /text-data : get all the textData.
     *
     * @param filter the filter of the request
     * @return the ResponseEntity with status 200 (OK) and the list of textData in body
     */
    @GetMapping("/text-data")
    @Timed
    public List<TextData> getAllTextData(@RequestParam(required = false) String filter) {
        if ("card-is-null".equals(filter)) {
            log.debug("REST request to get all TextDatas where card is null");
            return StreamSupport
                .stream(textDataRepository.findAll().spliterator(), false)
                .filter(textData -> textData.getCard() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all TextData");
        return textDataRepository.findAll();
    }

    /**
     * GET  /text-data/:id : get the "id" textData.
     *
     * @param id the id of the textData to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the textData, or with status 404 (Not Found)
     */
    @GetMapping("/text-data/{id}")
    @Timed
    public ResponseEntity<TextData> getTextData(@PathVariable Long id) {
        log.debug("REST request to get TextData : {}", id);
        Optional<TextData> textData = textDataRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(textData);
    }

    /**
     * DELETE  /text-data/:id : delete the "id" textData.
     *
     * @param id the id of the textData to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/text-data/{id}")
    @Timed
    public ResponseEntity<Void> deleteTextData(@PathVariable Long id) {
        log.debug("REST request to delete TextData : {}", id);

        textDataRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
