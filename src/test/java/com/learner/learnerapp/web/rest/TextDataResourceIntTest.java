package com.learner.learnerapp.web.rest;

import com.learner.learnerapp.LearnerappApp;

import com.learner.learnerapp.domain.TextData;
import com.learner.learnerapp.repository.TextDataRepository;
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
import java.util.List;


import static com.learner.learnerapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the TextDataResource REST controller.
 *
 * @see TextDataResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LearnerappApp.class)
public class TextDataResourceIntTest {

    private static final String DEFAULT_FRONT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_FRONT_TEXT = "BBBBBBBBBB";

    private static final String DEFAULT_BACK_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_BACK_TEXT = "BBBBBBBBBB";

    @Autowired
    private TextDataRepository textDataRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restTextDataMockMvc;

    private TextData textData;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final TextDataResource textDataResource = new TextDataResource(textDataRepository);
        this.restTextDataMockMvc = MockMvcBuilders.standaloneSetup(textDataResource)
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
    public static TextData createEntity(EntityManager em) {
        TextData textData = new TextData()
            .frontText(DEFAULT_FRONT_TEXT)
            .backText(DEFAULT_BACK_TEXT);
        return textData;
    }

    @Before
    public void initTest() {
        textData = createEntity(em);
    }

    @Test
    @Transactional
    public void createTextData() throws Exception {
        int databaseSizeBeforeCreate = textDataRepository.findAll().size();

        // Create the TextData
        restTextDataMockMvc.perform(post("/api/text-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(textData)))
            .andExpect(status().isCreated());

        // Validate the TextData in the database
        List<TextData> textDataList = textDataRepository.findAll();
        assertThat(textDataList).hasSize(databaseSizeBeforeCreate + 1);
        TextData testTextData = textDataList.get(textDataList.size() - 1);
        assertThat(testTextData.getFrontText()).isEqualTo(DEFAULT_FRONT_TEXT);
        assertThat(testTextData.getBackText()).isEqualTo(DEFAULT_BACK_TEXT);
    }

    @Test
    @Transactional
    public void createTextDataWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = textDataRepository.findAll().size();

        // Create the TextData with an existing ID
        textData.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restTextDataMockMvc.perform(post("/api/text-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(textData)))
            .andExpect(status().isBadRequest());

        // Validate the TextData in the database
        List<TextData> textDataList = textDataRepository.findAll();
        assertThat(textDataList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllTextData() throws Exception {
        // Initialize the database
        textDataRepository.saveAndFlush(textData);

        // Get all the textDataList
        restTextDataMockMvc.perform(get("/api/text-data?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(textData.getId().intValue())))
            .andExpect(jsonPath("$.[*].frontText").value(hasItem(DEFAULT_FRONT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].backText").value(hasItem(DEFAULT_BACK_TEXT.toString())));
    }
    

    @Test
    @Transactional
    public void getTextData() throws Exception {
        // Initialize the database
        textDataRepository.saveAndFlush(textData);

        // Get the textData
        restTextDataMockMvc.perform(get("/api/text-data/{id}", textData.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(textData.getId().intValue()))
            .andExpect(jsonPath("$.frontText").value(DEFAULT_FRONT_TEXT.toString()))
            .andExpect(jsonPath("$.backText").value(DEFAULT_BACK_TEXT.toString()));
    }
    @Test
    @Transactional
    public void getNonExistingTextData() throws Exception {
        // Get the textData
        restTextDataMockMvc.perform(get("/api/text-data/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateTextData() throws Exception {
        // Initialize the database
        textDataRepository.saveAndFlush(textData);

        int databaseSizeBeforeUpdate = textDataRepository.findAll().size();

        // Update the textData
        TextData updatedTextData = textDataRepository.findById(textData.getId()).get();
        // Disconnect from session so that the updates on updatedTextData are not directly saved in db
        em.detach(updatedTextData);
        updatedTextData
            .frontText(UPDATED_FRONT_TEXT)
            .backText(UPDATED_BACK_TEXT);

        restTextDataMockMvc.perform(put("/api/text-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedTextData)))
            .andExpect(status().isOk());

        // Validate the TextData in the database
        List<TextData> textDataList = textDataRepository.findAll();
        assertThat(textDataList).hasSize(databaseSizeBeforeUpdate);
        TextData testTextData = textDataList.get(textDataList.size() - 1);
        assertThat(testTextData.getFrontText()).isEqualTo(UPDATED_FRONT_TEXT);
        assertThat(testTextData.getBackText()).isEqualTo(UPDATED_BACK_TEXT);
    }

    @Test
    @Transactional
    public void updateNonExistingTextData() throws Exception {
        int databaseSizeBeforeUpdate = textDataRepository.findAll().size();

        // Create the TextData

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restTextDataMockMvc.perform(put("/api/text-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(textData)))
            .andExpect(status().isBadRequest());

        // Validate the TextData in the database
        List<TextData> textDataList = textDataRepository.findAll();
        assertThat(textDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteTextData() throws Exception {
        // Initialize the database
        textDataRepository.saveAndFlush(textData);

        int databaseSizeBeforeDelete = textDataRepository.findAll().size();

        // Get the textData
        restTextDataMockMvc.perform(delete("/api/text-data/{id}", textData.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<TextData> textDataList = textDataRepository.findAll();
        assertThat(textDataList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TextData.class);
        TextData textData1 = new TextData();
        textData1.setId(1L);
        TextData textData2 = new TextData();
        textData2.setId(textData1.getId());
        assertThat(textData1).isEqualTo(textData2);
        textData2.setId(2L);
        assertThat(textData1).isNotEqualTo(textData2);
        textData1.setId(null);
        assertThat(textData1).isNotEqualTo(textData2);
    }
}
