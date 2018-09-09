package com.learner.learnerapp.web.rest;

import com.learner.learnerapp.LearnerappApp;

import com.learner.learnerapp.domain.UserProgress;
import com.learner.learnerapp.repository.UserProgressRepository;
import com.learner.learnerapp.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;


import static com.learner.learnerapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the UserProgressResource REST controller.
 *
 * @see UserProgressResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LearnerappApp.class)
public class UserProgressResourceIntTest {

    private static final LocalDate DEFAULT_DAY = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DAY = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_DAILY_REPETITIONS = 1;
    private static final Integer UPDATED_DAILY_REPETITIONS = 2;

    @Autowired
    private UserProgressRepository userProgressRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restUserProgressMockMvc;

    private UserProgress userProgress;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final UserProgressResource userProgressResource = new UserProgressResource(userProgressRepository);
        this.restUserProgressMockMvc = MockMvcBuilders.standaloneSetup(userProgressResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserProgress createEntity(EntityManager em) {
        UserProgress userProgress = new UserProgress()
            .day(DEFAULT_DAY)
            .dailyRepetitions(DEFAULT_DAILY_REPETITIONS);
        return userProgress;
    }

    @Before
    public void initTest() {
        userProgress = createEntity(em);
    }

    @Test
    @Transactional
    public void createUserProgress() throws Exception {
        int databaseSizeBeforeCreate = userProgressRepository.findAll().size();

        // Create the UserProgress
        restUserProgressMockMvc.perform(post("/api/user-progresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userProgress)))
            .andExpect(status().isCreated());

        // Validate the UserProgress in the database
        List<UserProgress> userProgressList = userProgressRepository.findAll();
        assertThat(userProgressList).hasSize(databaseSizeBeforeCreate + 1);
        UserProgress testUserProgress = userProgressList.get(userProgressList.size() - 1);
        assertThat(testUserProgress.getDay()).isEqualTo(DEFAULT_DAY);
        assertThat(testUserProgress.getDailyRepetitions()).isEqualTo(DEFAULT_DAILY_REPETITIONS);
    }

    @Test
    @Transactional
    public void createUserProgressWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = userProgressRepository.findAll().size();

        // Create the UserProgress with an existing ID
        userProgress.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserProgressMockMvc.perform(post("/api/user-progresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userProgress)))
            .andExpect(status().isBadRequest());

        // Validate the UserProgress in the database
        List<UserProgress> userProgressList = userProgressRepository.findAll();
        assertThat(userProgressList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllUserProgresses() throws Exception {
        // Initialize the database
        userProgressRepository.saveAndFlush(userProgress);

        // Get all the userProgressList
        restUserProgressMockMvc.perform(get("/api/user-progresses?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userProgress.getId().intValue())))
            .andExpect(jsonPath("$.[*].day").value(hasItem(DEFAULT_DAY.toString())))
            .andExpect(jsonPath("$.[*].dailyRepetitions").value(hasItem(DEFAULT_DAILY_REPETITIONS)));
    }
    

    @Test
    @Transactional
    public void getUserProgress() throws Exception {
        // Initialize the database
        userProgressRepository.saveAndFlush(userProgress);

        // Get the userProgress
        restUserProgressMockMvc.perform(get("/api/user-progresses/{id}", userProgress.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(userProgress.getId().intValue()))
            .andExpect(jsonPath("$.day").value(DEFAULT_DAY.toString()))
            .andExpect(jsonPath("$.dailyRepetitions").value(DEFAULT_DAILY_REPETITIONS));
    }
    @Test
    @Transactional
    public void getNonExistingUserProgress() throws Exception {
        // Get the userProgress
        restUserProgressMockMvc.perform(get("/api/user-progresses/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateUserProgress() throws Exception {
        // Initialize the database
        userProgressRepository.saveAndFlush(userProgress);

        int databaseSizeBeforeUpdate = userProgressRepository.findAll().size();

        // Update the userProgress
        UserProgress updatedUserProgress = userProgressRepository.findById(userProgress.getId()).get();
        // Disconnect from session so that the updates on updatedUserProgress are not directly saved in db
        em.detach(updatedUserProgress);
        updatedUserProgress
            .day(UPDATED_DAY)
            .dailyRepetitions(UPDATED_DAILY_REPETITIONS);

        restUserProgressMockMvc.perform(put("/api/user-progresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedUserProgress)))
            .andExpect(status().isOk());

        // Validate the UserProgress in the database
        List<UserProgress> userProgressList = userProgressRepository.findAll();
        assertThat(userProgressList).hasSize(databaseSizeBeforeUpdate);
        UserProgress testUserProgress = userProgressList.get(userProgressList.size() - 1);
        assertThat(testUserProgress.getDay()).isEqualTo(UPDATED_DAY);
        assertThat(testUserProgress.getDailyRepetitions()).isEqualTo(UPDATED_DAILY_REPETITIONS);
    }

    @Test
    @Transactional
    public void updateNonExistingUserProgress() throws Exception {
        int databaseSizeBeforeUpdate = userProgressRepository.findAll().size();

        // Create the UserProgress

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restUserProgressMockMvc.perform(put("/api/user-progresses")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(userProgress)))
            .andExpect(status().isBadRequest());

        // Validate the UserProgress in the database
        List<UserProgress> userProgressList = userProgressRepository.findAll();
        assertThat(userProgressList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteUserProgress() throws Exception {
        // Initialize the database
        userProgressRepository.saveAndFlush(userProgress);

        int databaseSizeBeforeDelete = userProgressRepository.findAll().size();

        // Get the userProgress
        restUserProgressMockMvc.perform(delete("/api/user-progresses/{id}", userProgress.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<UserProgress> userProgressList = userProgressRepository.findAll();
        assertThat(userProgressList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserProgress.class);
        UserProgress userProgress1 = new UserProgress();
        userProgress1.setId(1L);
        UserProgress userProgress2 = new UserProgress();
        userProgress2.setId(userProgress1.getId());
        assertThat(userProgress1).isEqualTo(userProgress2);
        userProgress2.setId(2L);
        assertThat(userProgress1).isNotEqualTo(userProgress2);
        userProgress1.setId(null);
        assertThat(userProgress1).isNotEqualTo(userProgress2);
    }
}
