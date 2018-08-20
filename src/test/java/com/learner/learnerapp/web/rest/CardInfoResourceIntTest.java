package com.learner.learnerapp.web.rest;

import com.learner.learnerapp.LearnerappApp;

import com.learner.learnerapp.domain.CardInfo;
import com.learner.learnerapp.repository.CardInfoRepository;
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
 * Test class for the CardInfoResource REST controller.
 *
 * @see CardInfoResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LearnerappApp.class)
public class CardInfoResourceIntTest {

    private static final Integer DEFAULT_REPETITIONS = 1;
    private static final Integer UPDATED_REPETITIONS = 2;

    private static final Double DEFAULT_DIFFICULTY = 0D;
    private static final Double UPDATED_DIFFICULTY = 1D;

    private static final Double DEFAULT_DAYS_BETWEEN_REVIEWS = 1D;
    private static final Double UPDATED_DAYS_BETWEEN_REVIEWS = 2D;

    private static final LocalDate DEFAULT_DATE_LAST_REVIEWED = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_LAST_REVIEWED = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private CardInfoRepository cardInfoRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCardInfoMockMvc;

    private CardInfo cardInfo;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CardInfoResource cardInfoResource = new CardInfoResource(cardInfoRepository);
        this.restCardInfoMockMvc = MockMvcBuilders.standaloneSetup(cardInfoResource)
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
    public static CardInfo createEntity(EntityManager em) {
        CardInfo cardInfo = new CardInfo()
            .repetitions(DEFAULT_REPETITIONS)
            .difficulty(DEFAULT_DIFFICULTY)
            .daysBetweenReviews(DEFAULT_DAYS_BETWEEN_REVIEWS)
            .dateLastReviewed(DEFAULT_DATE_LAST_REVIEWED);
        return cardInfo;
    }

    @Before
    public void initTest() {
        cardInfo = createEntity(em);
    }

    @Test
    @Transactional
    public void createCardInfo() throws Exception {
        int databaseSizeBeforeCreate = cardInfoRepository.findAll().size();

        // Create the CardInfo
        restCardInfoMockMvc.perform(post("/api/card-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cardInfo)))
            .andExpect(status().isCreated());

        // Validate the CardInfo in the database
        List<CardInfo> cardInfoList = cardInfoRepository.findAll();
        assertThat(cardInfoList).hasSize(databaseSizeBeforeCreate + 1);
        CardInfo testCardInfo = cardInfoList.get(cardInfoList.size() - 1);
        assertThat(testCardInfo.getRepetitions()).isEqualTo(DEFAULT_REPETITIONS);
        assertThat(testCardInfo.getDifficulty()).isEqualTo(DEFAULT_DIFFICULTY);
        assertThat(testCardInfo.getDaysBetweenReviews()).isEqualTo(DEFAULT_DAYS_BETWEEN_REVIEWS);
        assertThat(testCardInfo.getDateLastReviewed()).isEqualTo(DEFAULT_DATE_LAST_REVIEWED);
    }

    @Test
    @Transactional
    public void createCardInfoWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = cardInfoRepository.findAll().size();

        // Create the CardInfo with an existing ID
        cardInfo.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCardInfoMockMvc.perform(post("/api/card-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cardInfo)))
            .andExpect(status().isBadRequest());

        // Validate the CardInfo in the database
        List<CardInfo> cardInfoList = cardInfoRepository.findAll();
        assertThat(cardInfoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllCardInfos() throws Exception {
        // Initialize the database
        cardInfoRepository.saveAndFlush(cardInfo);

        // Get all the cardInfoList
        restCardInfoMockMvc.perform(get("/api/card-infos?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(cardInfo.getId().intValue())))
            .andExpect(jsonPath("$.[*].repetitions").value(hasItem(DEFAULT_REPETITIONS)))
            .andExpect(jsonPath("$.[*].difficulty").value(hasItem(DEFAULT_DIFFICULTY.doubleValue())))
            .andExpect(jsonPath("$.[*].daysBetweenReviews").value(hasItem(DEFAULT_DAYS_BETWEEN_REVIEWS.doubleValue())))
            .andExpect(jsonPath("$.[*].dateLastReviewed").value(hasItem(DEFAULT_DATE_LAST_REVIEWED.toString())));
    }
    

    @Test
    @Transactional
    public void getCardInfo() throws Exception {
        // Initialize the database
        cardInfoRepository.saveAndFlush(cardInfo);

        // Get the cardInfo
        restCardInfoMockMvc.perform(get("/api/card-infos/{id}", cardInfo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(cardInfo.getId().intValue()))
            .andExpect(jsonPath("$.repetitions").value(DEFAULT_REPETITIONS))
            .andExpect(jsonPath("$.difficulty").value(DEFAULT_DIFFICULTY.doubleValue()))
            .andExpect(jsonPath("$.daysBetweenReviews").value(DEFAULT_DAYS_BETWEEN_REVIEWS.doubleValue()))
            .andExpect(jsonPath("$.dateLastReviewed").value(DEFAULT_DATE_LAST_REVIEWED.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingCardInfo() throws Exception {
        // Get the cardInfo
        restCardInfoMockMvc.perform(get("/api/card-infos/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCardInfo() throws Exception {
        // Initialize the database
        cardInfoRepository.saveAndFlush(cardInfo);

        int databaseSizeBeforeUpdate = cardInfoRepository.findAll().size();

        // Update the cardInfo
        CardInfo updatedCardInfo = cardInfoRepository.findById(cardInfo.getId()).get();
        // Disconnect from session so that the updates on updatedCardInfo are not directly saved in db
        em.detach(updatedCardInfo);
        updatedCardInfo
            .repetitions(UPDATED_REPETITIONS)
            .difficulty(UPDATED_DIFFICULTY)
            .daysBetweenReviews(UPDATED_DAYS_BETWEEN_REVIEWS)
            .dateLastReviewed(UPDATED_DATE_LAST_REVIEWED);

        restCardInfoMockMvc.perform(put("/api/card-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCardInfo)))
            .andExpect(status().isOk());

        // Validate the CardInfo in the database
        List<CardInfo> cardInfoList = cardInfoRepository.findAll();
        assertThat(cardInfoList).hasSize(databaseSizeBeforeUpdate);
        CardInfo testCardInfo = cardInfoList.get(cardInfoList.size() - 1);
        assertThat(testCardInfo.getRepetitions()).isEqualTo(UPDATED_REPETITIONS);
        assertThat(testCardInfo.getDifficulty()).isEqualTo(UPDATED_DIFFICULTY);
        assertThat(testCardInfo.getDaysBetweenReviews()).isEqualTo(UPDATED_DAYS_BETWEEN_REVIEWS);
        assertThat(testCardInfo.getDateLastReviewed()).isEqualTo(UPDATED_DATE_LAST_REVIEWED);
    }

    @Test
    @Transactional
    public void updateNonExistingCardInfo() throws Exception {
        int databaseSizeBeforeUpdate = cardInfoRepository.findAll().size();

        // Create the CardInfo

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCardInfoMockMvc.perform(put("/api/card-infos")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(cardInfo)))
            .andExpect(status().isBadRequest());

        // Validate the CardInfo in the database
        List<CardInfo> cardInfoList = cardInfoRepository.findAll();
        assertThat(cardInfoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCardInfo() throws Exception {
        // Initialize the database
        cardInfoRepository.saveAndFlush(cardInfo);

        int databaseSizeBeforeDelete = cardInfoRepository.findAll().size();

        // Get the cardInfo
        restCardInfoMockMvc.perform(delete("/api/card-infos/{id}", cardInfo.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<CardInfo> cardInfoList = cardInfoRepository.findAll();
        assertThat(cardInfoList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CardInfo.class);
        CardInfo cardInfo1 = new CardInfo();
        cardInfo1.setId(1L);
        CardInfo cardInfo2 = new CardInfo();
        cardInfo2.setId(cardInfo1.getId());
        assertThat(cardInfo1).isEqualTo(cardInfo2);
        cardInfo2.setId(2L);
        assertThat(cardInfo1).isNotEqualTo(cardInfo2);
        cardInfo1.setId(null);
        assertThat(cardInfo1).isNotEqualTo(cardInfo2);
    }
}
