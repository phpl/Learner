package com.learner.learnerapp.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.learner.learnerapp.domain.User;
import com.learner.learnerapp.domain.UserExtra;
import com.learner.learnerapp.domain.UserProgress;
import com.learner.learnerapp.repository.UserExtraRepository;
import com.learner.learnerapp.repository.UserProgressRepository;
import com.learner.learnerapp.repository.UserRepository;
import com.learner.learnerapp.security.SecurityUtils;
import com.learner.learnerapp.web.rest.errors.BadRequestAlertException;
import com.learner.learnerapp.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for managing UserProgress.
 */
@RestController
@RequestMapping("/api")
public class UserProgressResource {

    private final Logger log = LoggerFactory.getLogger(UserProgressResource.class);

    private static final String ENTITY_NAME = "userProgress";

    private final UserProgressRepository userProgressRepository;

    private final UserRepository userRepository;
    private final UserExtraRepository userExtraRepository;

    public UserProgressResource(UserProgressRepository userProgressRepository, UserRepository userRepository, UserExtraRepository userExtraRepository) {
        this.userProgressRepository = userProgressRepository;
        this.userRepository = userRepository;
        this.userExtraRepository = userExtraRepository;
    }

    /**
     * POST  /user-progresses : Create a new userProgress.
     *
     * @param userProgress the userProgress to create
     * @return the ResponseEntity with status 201 (Created) and with body the new userProgress, or with status 400 (Bad Request) if the userProgress has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/user-progresses")
    @Timed
    public ResponseEntity<UserProgress> createUserProgress(@RequestBody UserProgress userProgress) throws URISyntaxException {
        log.debug("REST request to save UserProgress : {}", userProgress);
        if (userProgress.getId() != null) {
            throw new BadRequestAlertException("A new userProgress cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserProgress result = userProgressRepository.save(userProgress);
        return ResponseEntity.created(new URI("/api/user-progresses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /user-progresses : Updates an existing userProgress.
     *
     * @param userProgress the userProgress to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated userProgress,
     * or with status 400 (Bad Request) if the userProgress is not valid,
     * or with status 500 (Internal Server Error) if the userProgress couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/user-progresses")
    @Timed
    public ResponseEntity<UserProgress> updateUserProgress(@RequestBody UserProgress userProgress) throws URISyntaxException {
        log.debug("REST request to update UserProgress : {}", userProgress);
        if (userProgress.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UserProgress result = userProgressRepository.save(userProgress);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, userProgress.getId().toString()))
            .body(result);
    }

    /**
     * GET  /user-progresses : get all the userProgresses.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of userProgresses in body
     */
    @GetMapping("/user-progresses")
    @Timed
    public List<UserProgress> getAllUserProgresses() {
        log.debug("REST request to get all UserProgresses");
        return userProgressRepository.findAll();
    }

    /**
     * GET  /user-progresses/:id : get the "id" userProgress.
     *
     * @param id the id of the userProgress to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the userProgress, or with status 404 (Not Found)
     */

    /**
     * GET  /user-progresses-logged : get all the userProgresses for logged user.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of userProgresses in body
     */
    @GetMapping("/user-progresses-logged")
    @Timed
    public List<UserProgress> getAllUserProgressesForLoggedUsers() {
        log.debug("REST request to get all UserProgresses for loggedUser");
        List<UserProgress> allByUserExtraId = userProgressRepository.findAllByUserExtraId(getLoggedUserExtra().get().getId());

        return getListOfUserProgressFilledWIthDatesBetween(allByUserExtraId);
    }

    private List<UserProgress> getListOfUserProgressFilledWIthDatesBetween(List<UserProgress> allByUserExtraId) {
        List<UserProgress> allByUserExtraIdFilledWithDatesBetween = allByUserExtraId.stream()
            .sorted(Comparator.comparing(UserProgress::getDay)).collect(Collectors.toList());

        if (allByUserExtraId.size() > 1) {
            for (int i = 1; i < allByUserExtraId.size(); i++) {
                LocalDate date1 = allByUserExtraIdFilledWithDatesBetween.get(i - 1).getDay().plusDays(1);
                LocalDate date2 = allByUserExtraIdFilledWithDatesBetween.get(i).getDay();

                while (date1.isBefore(date2)) {
                    UserProgress userProgress = new UserProgress();
                    userProgress.setDailyRepetitions(0);
                    userProgress.setDay(date1);
                    allByUserExtraIdFilledWithDatesBetween.add(userProgress);
                    date1 = date1.plusDays(1);
                }
            }
        }

        return allByUserExtraIdFilledWithDatesBetween.stream()
            .sorted(Comparator.comparing(UserProgress::getDay)).collect(Collectors.toList());
    }


    private Optional<UserExtra> getLoggedUserExtra() {
        Optional<String> currentUserLogin = SecurityUtils.getCurrentUserLogin();
        Optional<User> currentUser = userRepository.findOneByLogin(currentUserLogin.get());
        return userExtraRepository.findById(currentUser.get().getId());
    }

    /**
     * GET  /user-progresses/:id : get the "id" userProgress.
     *
     * @param id the id of the userProgress to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the userProgress, or with status 404 (Not Found)
     */

    @GetMapping("/user-progresses/{id}")
    @Timed
    public ResponseEntity<UserProgress> getUserProgress(@PathVariable Long id) {
        log.debug("REST request to get UserProgress : {}", id);
        Optional<UserProgress> userProgress = userProgressRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userProgress);
    }

    /**
     * GET  /user-progresses-today : get the today userProgress.
     *
     * @return the ResponseEntity with status 200 (OK) and with body the userProgress, or with status 404 (Not Found)
     */

    @GetMapping("/user-progresses-today")
    @Timed
    public ResponseEntity<UserProgress> getTodayUserProgress() {
        log.debug("REST request to get today UserProgress");
        Optional<UserProgress> userProgress = Optional.ofNullable(userProgressRepository.findByDayAndUserExtraId(LocalDate.now(), getLoggedUserExtra().get().getId()));
        return ResponseUtil.wrapOrNotFound(userProgress);
    }

    /**
     * DELETE  /user-progresses/:id : delete the "id" userProgress.
     *
     * @param id the id of the userProgress to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/user-progresses/{id}")
    @Timed
    public ResponseEntity<Void> deleteUserProgress(@PathVariable Long id) {
        log.debug("REST request to delete UserProgress : {}", id);

        userProgressRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
