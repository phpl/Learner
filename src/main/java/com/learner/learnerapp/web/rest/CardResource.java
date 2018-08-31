package com.learner.learnerapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.learner.learnerapp.domain.Card;
import com.learner.learnerapp.domain.User;
import com.learner.learnerapp.domain.UserExtra;
import com.learner.learnerapp.repository.CardRepository;
import com.learner.learnerapp.repository.UserExtraRepository;
import com.learner.learnerapp.repository.UserRepository;
import com.learner.learnerapp.security.SecurityUtils;
import com.learner.learnerapp.web.rest.errors.BadRequestAlertException;
import com.learner.learnerapp.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import net.bytebuddy.asm.Advice;
import org.checkerframework.checker.units.qual.A;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Card.
 */
@RestController
@RequestMapping("/api")
public class CardResource {

    private final Logger log = LoggerFactory.getLogger(CardResource.class);

    private static final String ENTITY_NAME = "card";

    private final CardRepository cardRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserExtraRepository userExtraRepository;

    public CardResource(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    /**
     * POST  /cards : Create a new card.
     *
     * @param card the card to create
     * @return the ResponseEntity with status 201 (Created) and with body the new card, or with status 400 (Bad Request) if the card has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/cards")
    @Timed
    public ResponseEntity<Card> createCard(@Valid @RequestBody Card card) throws URISyntaxException {
        log.debug("REST request to save Card : {}", card);
        if (card.getId() != null) {
            throw new BadRequestAlertException("A new card cannot already have an ID", ENTITY_NAME, "idexists");
        }

        if (card.getUserExtra() == null) {
            Optional<UserExtra> currentUserExtra = getLoggedUserExtra();
            card.setUserExtra(currentUserExtra.get());
        }

        Card result = cardRepository.save(card);
        return ResponseEntity.created(new URI("/api/cards/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    private Optional<UserExtra> getLoggedUserExtra() {
        Optional<String> currentUserLogin = SecurityUtils.getCurrentUserLogin();
        Optional<User> currentUser = userRepository.findOneByLogin(currentUserLogin.get());
        return userExtraRepository.findById(currentUser.get().getId());
    }

    /**
     * PUT  /cards : Updates an existing card.
     *
     * @param card the card to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated card,
     * or with status 400 (Bad Request) if the card is not valid,
     * or with status 500 (Internal Server Error) if the card couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/cards")
    @Timed
    public ResponseEntity<Card> updateCard(@Valid @RequestBody Card card) throws URISyntaxException {
        log.debug("REST request to update Card : {}", card);
        if (card.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Card result = cardRepository.save(card);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, card.getId().toString()))
            .body(result);
    }

    /**
     * GET  /cards : get all the cards.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of cards in body
     */
    @GetMapping("/cards")
    @Timed
    public List<Card> getAllCards(@RequestParam(value="logged", required = false, defaultValue = "false") boolean logged,
                                  @RequestParam(value="categoryId", required = false) Long categoryId) {
        log.debug("REST request to get all Cards. User logged: {}. CategoryId exist: {}", logged, categoryId != null);

        List<Card> cards;

        if (logged) {
            cards = cardRepository.findAllByUserExtraId(getLoggedUserExtra().get().getId());
        } else if (categoryId != null) {
            cards = cardRepository.findAllByCategoryId(categoryId);
        } else {
            cards = cardRepository.findAll();
        }

        return cards;
    }

    /**
     * GET  /cards/:id : get the "id" card.
     *
     * @param id the id of the card to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the card, or with status 404 (Not Found)
     */
    @GetMapping("/cards/{id}")
    @Timed
    public ResponseEntity<Card> getCard(@PathVariable Long id) {
        log.debug("REST request to get Card : {}", id);
        Optional<Card> card = cardRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(card);
    }

    /**
     * DELETE  /cards/:id : delete the "id" card.
     *
     * @param id the id of the card to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/cards/{id}")
    @Timed
    public ResponseEntity<Void> deleteCard(@PathVariable Long id) {
        log.debug("REST request to delete Card : {}", id);

        cardRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
