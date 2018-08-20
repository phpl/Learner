package com.learner.learnerapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.learner.learnerapp.domain.CardInfo;
import com.learner.learnerapp.repository.CardInfoRepository;
import com.learner.learnerapp.web.rest.errors.BadRequestAlertException;
import com.learner.learnerapp.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * REST controller for managing CardInfo.
 */
@RestController
@RequestMapping("/api")
public class CardInfoResource {

    private final Logger log = LoggerFactory.getLogger(CardInfoResource.class);

    private static final String ENTITY_NAME = "cardInfo";

    private final CardInfoRepository cardInfoRepository;

    public CardInfoResource(CardInfoRepository cardInfoRepository) {
        this.cardInfoRepository = cardInfoRepository;
    }

    /**
     * POST  /card-infos : Create a new cardInfo.
     *
     * @param cardInfo the cardInfo to create
     * @return the ResponseEntity with status 201 (Created) and with body the new cardInfo, or with status 400 (Bad Request) if the cardInfo has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/card-infos")
    @Timed
    public ResponseEntity<CardInfo> createCardInfo(@Valid @RequestBody CardInfo cardInfo) throws URISyntaxException {
        log.debug("REST request to save CardInfo : {}", cardInfo);
        if (cardInfo.getId() != null) {
            throw new BadRequestAlertException("A new cardInfo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CardInfo result = cardInfoRepository.save(cardInfo);
        return ResponseEntity.created(new URI("/api/card-infos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /card-infos : Updates an existing cardInfo.
     *
     * @param cardInfo the cardInfo to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated cardInfo,
     * or with status 400 (Bad Request) if the cardInfo is not valid,
     * or with status 500 (Internal Server Error) if the cardInfo couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/card-infos")
    @Timed
    public ResponseEntity<CardInfo> updateCardInfo(@Valid @RequestBody CardInfo cardInfo) throws URISyntaxException {
        log.debug("REST request to update CardInfo : {}", cardInfo);
        if (cardInfo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        CardInfo result = cardInfoRepository.save(cardInfo);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, cardInfo.getId().toString()))
            .body(result);
    }

    /**
     * GET  /card-infos : get all the cardInfos.
     *
     * @param filter the filter of the request
     * @return the ResponseEntity with status 200 (OK) and the list of cardInfos in body
     */
    @GetMapping("/card-infos")
    @Timed
    public List<CardInfo> getAllCardInfos(@RequestParam(required = false) String filter) {
        if ("card-is-null".equals(filter)) {
            log.debug("REST request to get all CardInfos where card is null");
            return StreamSupport
                .stream(cardInfoRepository.findAll().spliterator(), false)
                .filter(cardInfo -> cardInfo.getCard() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all CardInfos");
        return cardInfoRepository.findAll();
    }

    /**
     * GET  /card-infos/:id : get the "id" cardInfo.
     *
     * @param id the id of the cardInfo to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the cardInfo, or with status 404 (Not Found)
     */
    @GetMapping("/card-infos/{id}")
    @Timed
    public ResponseEntity<CardInfo> getCardInfo(@PathVariable Long id) {
        log.debug("REST request to get CardInfo : {}", id);
        Optional<CardInfo> cardInfo = cardInfoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(cardInfo);
    }

    /**
     * DELETE  /card-infos/:id : delete the "id" cardInfo.
     *
     * @param id the id of the cardInfo to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/card-infos/{id}")
    @Timed
    public ResponseEntity<Void> deleteCardInfo(@PathVariable Long id) {
        log.debug("REST request to delete CardInfo : {}", id);

        cardInfoRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
