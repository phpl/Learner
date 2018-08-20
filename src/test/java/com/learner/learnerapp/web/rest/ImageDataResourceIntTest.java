package com.learner.learnerapp.web.rest;

import com.learner.learnerapp.LearnerappApp;

import com.learner.learnerapp.domain.ImageData;
import com.learner.learnerapp.repository.ImageDataRepository;
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
import java.util.List;


import static com.learner.learnerapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the ImageDataResource REST controller.
 *
 * @see ImageDataResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = LearnerappApp.class)
public class ImageDataResourceIntTest {

    private static final byte[] DEFAULT_FRONT_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_FRONT_IMAGE = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_FRONT_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_FRONT_IMAGE_CONTENT_TYPE = "image/png";

    private static final byte[] DEFAULT_BACK_IMAGE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_BACK_IMAGE = TestUtil.createByteArray(2, "1");
    private static final String DEFAULT_BACK_IMAGE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_BACK_IMAGE_CONTENT_TYPE = "image/png";

    @Autowired
    private ImageDataRepository imageDataRepository;


    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restImageDataMockMvc;

    private ImageData imageData;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ImageDataResource imageDataResource = new ImageDataResource(imageDataRepository);
        this.restImageDataMockMvc = MockMvcBuilders.standaloneSetup(imageDataResource)
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
    public static ImageData createEntity(EntityManager em) {
        ImageData imageData = new ImageData()
            .frontImage(DEFAULT_FRONT_IMAGE)
            .frontImageContentType(DEFAULT_FRONT_IMAGE_CONTENT_TYPE)
            .backImage(DEFAULT_BACK_IMAGE)
            .backImageContentType(DEFAULT_BACK_IMAGE_CONTENT_TYPE);
        return imageData;
    }

    @Before
    public void initTest() {
        imageData = createEntity(em);
    }

    @Test
    @Transactional
    public void createImageData() throws Exception {
        int databaseSizeBeforeCreate = imageDataRepository.findAll().size();

        // Create the ImageData
        restImageDataMockMvc.perform(post("/api/image-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(imageData)))
            .andExpect(status().isCreated());

        // Validate the ImageData in the database
        List<ImageData> imageDataList = imageDataRepository.findAll();
        assertThat(imageDataList).hasSize(databaseSizeBeforeCreate + 1);
        ImageData testImageData = imageDataList.get(imageDataList.size() - 1);
        assertThat(testImageData.getFrontImage()).isEqualTo(DEFAULT_FRONT_IMAGE);
        assertThat(testImageData.getFrontImageContentType()).isEqualTo(DEFAULT_FRONT_IMAGE_CONTENT_TYPE);
        assertThat(testImageData.getBackImage()).isEqualTo(DEFAULT_BACK_IMAGE);
        assertThat(testImageData.getBackImageContentType()).isEqualTo(DEFAULT_BACK_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void createImageDataWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = imageDataRepository.findAll().size();

        // Create the ImageData with an existing ID
        imageData.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restImageDataMockMvc.perform(post("/api/image-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(imageData)))
            .andExpect(status().isBadRequest());

        // Validate the ImageData in the database
        List<ImageData> imageDataList = imageDataRepository.findAll();
        assertThat(imageDataList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllImageData() throws Exception {
        // Initialize the database
        imageDataRepository.saveAndFlush(imageData);

        // Get all the imageDataList
        restImageDataMockMvc.perform(get("/api/image-data?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(imageData.getId().intValue())))
            .andExpect(jsonPath("$.[*].frontImageContentType").value(hasItem(DEFAULT_FRONT_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].frontImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_FRONT_IMAGE))))
            .andExpect(jsonPath("$.[*].backImageContentType").value(hasItem(DEFAULT_BACK_IMAGE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].backImage").value(hasItem(Base64Utils.encodeToString(DEFAULT_BACK_IMAGE))));
    }
    

    @Test
    @Transactional
    public void getImageData() throws Exception {
        // Initialize the database
        imageDataRepository.saveAndFlush(imageData);

        // Get the imageData
        restImageDataMockMvc.perform(get("/api/image-data/{id}", imageData.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(imageData.getId().intValue()))
            .andExpect(jsonPath("$.frontImageContentType").value(DEFAULT_FRONT_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.frontImage").value(Base64Utils.encodeToString(DEFAULT_FRONT_IMAGE)))
            .andExpect(jsonPath("$.backImageContentType").value(DEFAULT_BACK_IMAGE_CONTENT_TYPE))
            .andExpect(jsonPath("$.backImage").value(Base64Utils.encodeToString(DEFAULT_BACK_IMAGE)));
    }
    @Test
    @Transactional
    public void getNonExistingImageData() throws Exception {
        // Get the imageData
        restImageDataMockMvc.perform(get("/api/image-data/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateImageData() throws Exception {
        // Initialize the database
        imageDataRepository.saveAndFlush(imageData);

        int databaseSizeBeforeUpdate = imageDataRepository.findAll().size();

        // Update the imageData
        ImageData updatedImageData = imageDataRepository.findById(imageData.getId()).get();
        // Disconnect from session so that the updates on updatedImageData are not directly saved in db
        em.detach(updatedImageData);
        updatedImageData
            .frontImage(UPDATED_FRONT_IMAGE)
            .frontImageContentType(UPDATED_FRONT_IMAGE_CONTENT_TYPE)
            .backImage(UPDATED_BACK_IMAGE)
            .backImageContentType(UPDATED_BACK_IMAGE_CONTENT_TYPE);

        restImageDataMockMvc.perform(put("/api/image-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedImageData)))
            .andExpect(status().isOk());

        // Validate the ImageData in the database
        List<ImageData> imageDataList = imageDataRepository.findAll();
        assertThat(imageDataList).hasSize(databaseSizeBeforeUpdate);
        ImageData testImageData = imageDataList.get(imageDataList.size() - 1);
        assertThat(testImageData.getFrontImage()).isEqualTo(UPDATED_FRONT_IMAGE);
        assertThat(testImageData.getFrontImageContentType()).isEqualTo(UPDATED_FRONT_IMAGE_CONTENT_TYPE);
        assertThat(testImageData.getBackImage()).isEqualTo(UPDATED_BACK_IMAGE);
        assertThat(testImageData.getBackImageContentType()).isEqualTo(UPDATED_BACK_IMAGE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    public void updateNonExistingImageData() throws Exception {
        int databaseSizeBeforeUpdate = imageDataRepository.findAll().size();

        // Create the ImageData

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restImageDataMockMvc.perform(put("/api/image-data")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(imageData)))
            .andExpect(status().isBadRequest());

        // Validate the ImageData in the database
        List<ImageData> imageDataList = imageDataRepository.findAll();
        assertThat(imageDataList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteImageData() throws Exception {
        // Initialize the database
        imageDataRepository.saveAndFlush(imageData);

        int databaseSizeBeforeDelete = imageDataRepository.findAll().size();

        // Get the imageData
        restImageDataMockMvc.perform(delete("/api/image-data/{id}", imageData.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<ImageData> imageDataList = imageDataRepository.findAll();
        assertThat(imageDataList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ImageData.class);
        ImageData imageData1 = new ImageData();
        imageData1.setId(1L);
        ImageData imageData2 = new ImageData();
        imageData2.setId(imageData1.getId());
        assertThat(imageData1).isEqualTo(imageData2);
        imageData2.setId(2L);
        assertThat(imageData1).isNotEqualTo(imageData2);
        imageData1.setId(null);
        assertThat(imageData1).isNotEqualTo(imageData2);
    }
}
