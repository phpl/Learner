package com.learner.learnerapp.web.rest;

import com.learner.learnerapp.LearnerappApp;

import com.learner.learnerapp.domain.Card;
import com.learner.learnerapp.repository.CardRepository;
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
import org.springframework.util.Base64Utils;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.List;


import static com.learner.learnerapp.web.rest.TestUtil.sameInstant;
import static com.learner.learnerapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the CardResource REST controller.
 *
 * @see CardResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LearnerappApp.class)
public class CardResourceIntTest {

    private static final String DEFAULT_FRONT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_FRONT_TEXT = "BBBBBBBBBB";

    private static final String DEFAULT_BACK_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_BACK_TEXT = "BBBBBBBBBB";

    private static final byte[] DEFAULT_FRONT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_FRONT_IMAGE = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_FRONT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_FRONT_IMAGE_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_BACK_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_BACK_IMAGE = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_BACK_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_BACK_IMAGE_CONTENT_TYPE = "image/png";

    private static final Integer DEFAULT_REPETITIONS = 1;
    private static final Integer UPDATED_REPETITIONS = 2;

    private static final Double DEFAULT_DIFFICULTY = 0D;
    private static final Double UPDATED_DIFFICULTY = 1D;

    private static final Double DEFAULT_DAYS_BETWEEN_REVIEWS = 1D;
    private static final Double UPDATED_DAYS_BETWEEN_REVIEWS = 2D;

    private static final ZonedDateTime DEFAULT_DATE_LAST_REVIEWED = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE_LAST_REVIEWED = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private CardRepository cardRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restCardMockMvc;

    private Card card;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final CardResource cardResource = new CardResource(cardRepository);
        this.restCardMockMvc = MockMvcBuilders.standaloneSetup(cardResource)
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
    public static Card createEntity(EntityManager em) {
        Card card = new Card()
            .frontText(DEFAULT_FRONT_TEXT)
            .backText(DEFAULT_BACK_TEXT)
            .frontImage(DEFAULT_FRONT_IMAGE)
            .frontImageContentType(DEFAULT_FRONT_IMAGE_CONTENT_TYPE)
            .backImage(DEFAULT_BACK_IMAGE)
            .backImageContentType(DEFAULT_BACK_IMAGE_CONTENT_TYPE)
            .repetitions(DEFAULT_REPETITIONS)
            .difficulty(DEFAULT_DIFFICULTY)
            .daysBetweenReviews(DEFAULT_DAYS_BETWEEN_REVIEWS)
            .dateLastReviewed(DEFAULT_DATE_LAST_REVIEWED);
        return card;
    }

    @Before
    public void initTest() {
        card = createEntity(em);
    }

    @Test
    @Transactional
    public void createCard() throws Exception {
        int databaseSizeBeforeCreate = cardRepository.findAll().size();

        // Create the Card
        restCardMockMvc.perform(post("/api/cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(card)))
            .andExpect(status().isCreated());

        // Validate the Card in the database
        List<Card> cardList = cardRepository.findAll();
        assertThat(cardList).hasSize(databaseSizeBeforeCreate + 1);
        Card testCard = cardList.get(cardList.size() - 1);
        assertThat(testCard.getFrontText()).isEqualTo(DEFAULT_FRONT_TEXT);
        assertThat(testCard.getBackText()).isEqualTo(DEFAULT_BACK_TEXT);
        assertThat(testCard.getFrontImage()).isEqualTo(DEFAULT_FRONT_IMAGE);
        assertThat(testCard.getFrontImageContentType()).isEqualTo(DEFAULT_FRONT_IMAGE_CONTENT_TYPE);
        assertThat(testCard.getBackImage()).isEqualTo(DEFAULT_BACK_IMAGE);
        assertThat(testCard.getBackImageContentType()).isEqualTo(DEFAULT_BACK_IMAGE_CONTENT_TYPE);
        assertThat(testCard.getRepetitions()).isEqualTo(DEFAULT_REPETITIONS);
        assertThat(testCard.getDifficulty()).isEqualTo(DEFAULT_DIFFICULTY);
        assertThat(testCard.getDaysBetweenReviews()).isEqualTo(DEFAULT_DAYS_BETWEEN_REVIEWS);
        assertThat(testCard.getDateLastReviewed()).isEqualTo(DEFAULT_DATE_LAST_REVIEWED);
    }

    @Test
    @Transactional
    public void createCardWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = cardRepository.findAll().size();

        // Create the Card with an existing ID
        card.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restCardMockMvc.perform(post("/api/cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(card)))
            .andExpect(status().isBadRequest());

        // Validate the Card in the database
        List<Card> cardList = cardRepository.findAll();
        assertThat(cardList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllCards() throws Exception {
        // Initialize the database
        cardRepository.saveAndFlush(card);

        // Get all the categoryList
        restCardMockMvc.perform(get("/api/cards?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(card.getId().intValue())))
            .andExpect(jsonPath("$.[*].frontText").value(hasItem(DEFAULT_FRONT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].backText").value(hasItem(DEFAULT_BACK_TEXT.toString())))
            .andExpect(jsonPath("$.[*].frontImageContentType").value(hasItem(DEFAULT_FRONT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].frontImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_FRONT_IMAGE))))
            .andExpect(jsonPath("$.[*].backImageContentType").value(hasItem(DEFAULT_BACK_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].backImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_BACK_IMAGE))))
            .andExpect(jsonPath("$.[*].repetitions").value(hasItem(DEFAULT_REPETITIONS)))
            .andExpect(jsonPath("$.[*].difficulty").value(hasItem(DEFAULT_DIFFICULTY.doubleValue())))
            .andExpect(jsonPath("$.[*].daysBetweenReviews").value(hasItem(DEFAULT_DAYS_BETWEEN_REVIEWS.doubleValue())))
            .andExpect(jsonPath("$.[*].dateLastReviewed").value(hasItem(sameInstant(DEFAULT_DATE_LAST_REVIEWED))));
    }
    

    @Test
    @Transactional
    public void getCard() throws Exception {
        // Initialize the database
        cardRepository.saveAndFlush(card);

        // Get the card
        restCardMockMvc.perform(get("/api/cards/{id}", card.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(card.getId().intValue()))
            .andExpect(jsonPath("$.frontText").value(DEFAULT_FRONT_TEXT.toString()))
            .andExpect(jsonPath("$.backText").value(DEFAULT_BACK_TEXT.toString()))
            .andExpect(jsonPath("$.frontImageContentType").value(DEFAULT_FRONT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.frontImage").value(Base64Utils.encodeToString(DEFAULT_FRONT_IMAGE)))
            .andExpect(jsonPath("$.backImageContentType").value(DEFAULT_BACK_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.backImage").value(Base64Utils.encodeToString(DEFAULT_BACK_IMAGE)))
            .andExpect(jsonPath("$.repetitions").value(DEFAULT_REPETITIONS))
            .andExpect(jsonPath("$.difficulty").value(DEFAULT_DIFFICULTY.doubleValue()))
            .andExpect(jsonPath("$.daysBetweenReviews").value(DEFAULT_DAYS_BETWEEN_REVIEWS.doubleValue()))
            .andExpect(jsonPath("$.dateLastReviewed").value(sameInstant(DEFAULT_DATE_LAST_REVIEWED)));
    }
    @Test
    @Transactional
    public void getNonExistingCard() throws Exception {
        // Get the card
        restCardMockMvc.perform(get("/api/cards/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateCard() throws Exception {
        // Initialize the database
        cardRepository.saveAndFlush(card);

        int databaseSizeBeforeUpdate = cardRepository.findAll().size();

        // Update the card
        Card updatedCard = cardRepository.findById(card.getId()).get();
        // Disconnect from session so that the updates on updatedCard are not directly saved in db
        em.detach(updatedCard);
        updatedCard
            .frontText(UPDATED_FRONT_TEXT)
            .backText(UPDATED_BACK_TEXT)
            .frontImage(UPDATED_FRONT_IMAGE)
            .frontImageContentType(UPDATED_FRONT_IMAGE_CONTENT_TYPE)
            .backImage(UPDATED_BACK_IMAGE)
            .backImageContentType(UPDATED_BACK_IMAGE_CONTENT_TYPE)
            .repetitions(UPDATED_REPETITIONS)
            .difficulty(UPDATED_DIFFICULTY)
            .daysBetweenReviews(UPDATED_DAYS_BETWEEN_REVIEWS)
            .dateLastReviewed(UPDATED_DATE_LAST_REVIEWED);

        restCardMockMvc.perform(put("/api/cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedCard)))
            .andExpect(status().isOk());

        // Validate the Card in the database
        List<Card> cardList = cardRepository.findAll();
        assertThat(cardList).hasSize(databaseSizeBeforeUpdate);
        Card testCard = cardList.get(cardList.size() - 1);
        assertThat(testCard.getFrontText()).isEqualTo(UPDATED_FRONT_TEXT);
        assertThat(testCard.getBackText()).isEqualTo(UPDATED_BACK_TEXT);
        assertThat(testCard.getFrontImage()).isEqualTo(UPDATED_FRONT_IMAGE);
        assertThat(testCard.getFrontImageContentType()).isEqualTo(UPDATED_FRONT_IMAGE_CONTENT_TYPE);
        assertThat(testCard.getBackImage()).isEqualTo(UPDATED_BACK_IMAGE);
        assertThat(testCard.getBackImageContentType()).isEqualTo(UPDATED_BACK_IMAGE_CONTENT_TYPE);
        assertThat(testCard.getRepetitions()).isEqualTo(UPDATED_REPETITIONS);
        assertThat(testCard.getDifficulty()).isEqualTo(UPDATED_DIFFICULTY);
        assertThat(testCard.getDaysBetweenReviews()).isEqualTo(UPDATED_DAYS_BETWEEN_REVIEWS);
        assertThat(testCard.getDateLastReviewed()).isEqualTo(UPDATED_DATE_LAST_REVIEWED);
    }

    @Test
    @Transactional
    public void updateNonExistingCard() throws Exception {
        int databaseSizeBeforeUpdate = cardRepository.findAll().size();

        // Create the Card

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restCardMockMvc.perform(put("/api/cards")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(card)))
            .andExpect(status().isBadRequest());

        // Validate the Card in the database
        List<Card> cardList = cardRepository.findAll();
        assertThat(cardList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteCard() throws Exception {
        // Initialize the database
        cardRepository.saveAndFlush(card);

        int databaseSizeBeforeDelete = cardRepository.findAll().size();

        // Get the card
        restCardMockMvc.perform(delete("/api/cards/{id}", card.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Card> cardList = cardRepository.findAll();
        assertThat(cardList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Card.class);
        Card card1 = new Card();
        card1.setId(1L);
        Card card2 = new Card();
        card2.setId(card1.getId());
        assertThat(card1).isEqualTo(card2);
        card2.setId(2L);
        assertThat(card1).isNotEqualTo(card2);
        card1.setId(null);
        assertThat(card1).isNotEqualTo(card2);
    }
}
