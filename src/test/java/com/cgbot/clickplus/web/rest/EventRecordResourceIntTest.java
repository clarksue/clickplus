package com.cgbot.clickplus.web.rest;

import com.cgbot.clickplus.ClickplusApp;

import com.cgbot.clickplus.domain.EventRecord;
import com.cgbot.clickplus.domain.User;
import com.cgbot.clickplus.domain.EventType;
import com.cgbot.clickplus.repository.EventRecordRepository;
import com.cgbot.clickplus.repository.EventTypeRepository;
import com.cgbot.clickplus.repository.search.EventRecordSearchRepository;
import com.cgbot.clickplus.service.UserService;
import com.cgbot.clickplus.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.ZoneOffset;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;


import static com.cgbot.clickplus.web.rest.TestUtil.sameInstant;
import static com.cgbot.clickplus.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the EventRecordResource REST controller.
 *
 * @see EventRecordResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ClickplusApp.class)
public class EventRecordResourceIntTest {

    private static final ZonedDateTime DEFAULT_CREATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_CREATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final ZonedDateTime DEFAULT_UPDATED_AT = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_UPDATED_AT = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    @Autowired
    private EventRecordRepository eventRecordRepository;

    /**
     * This repository is mocked in the com.cgbot.clickplus.repository.search test package.
     *
     * @see com.cgbot.clickplus.repository.search.EventRecordSearchRepositoryMockConfiguration
     */
    @Autowired
    private EventRecordSearchRepository mockEventRecordSearchRepository;
    
    @Autowired
    private EventTypeRepository eventTypeRepository;
    
    @Autowired
    private UserService userService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restEventRecordMockMvc;

    private EventRecord eventRecord;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EventRecordResource eventRecordResource = new EventRecordResource(eventRecordRepository, mockEventRecordSearchRepository, 
        		eventTypeRepository, userService);
        this.restEventRecordMockMvc = MockMvcBuilders.standaloneSetup(eventRecordResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventRecord createEntity(EntityManager em) {
        EventRecord eventRecord = new EventRecord()
            .createdAt(DEFAULT_CREATED_AT)
            .updatedAt(DEFAULT_UPDATED_AT);
        // Add required entity
        User user = UserResourceIntTest.createEntity(em);
        em.persist(user);
        em.flush();
        eventRecord.setUser(user);
        // Add required entity
        EventType eventType = EventTypeResourceIntTest.createEntity(em);
        em.persist(eventType);
        em.flush();
        eventRecord.setEventType(eventType);
        return eventRecord;
    }

    @Before
    public void initTest() {
        eventRecord = createEntity(em);
    }

    @Test
    @Transactional
    public void createEventRecord() throws Exception {
        int databaseSizeBeforeCreate = eventRecordRepository.findAll().size();

        // Create the EventRecord
        restEventRecordMockMvc.perform(post("/api/event-records")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventRecord)))
            .andExpect(status().isCreated());

        // Validate the EventRecord in the database
        List<EventRecord> eventRecordList = eventRecordRepository.findAll();
        assertThat(eventRecordList).hasSize(databaseSizeBeforeCreate + 1);
        EventRecord testEventRecord = eventRecordList.get(eventRecordList.size() - 1);
        assertThat(testEventRecord.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testEventRecord.getUpdatedAt()).isEqualTo(DEFAULT_UPDATED_AT);

        // Validate the EventRecord in Elasticsearch
        verify(mockEventRecordSearchRepository, times(1)).save(testEventRecord);
    }

    @Test
    @Transactional
    public void createEventRecordWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = eventRecordRepository.findAll().size();

        // Create the EventRecord with an existing ID
        eventRecord.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventRecordMockMvc.perform(post("/api/event-records")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventRecord)))
            .andExpect(status().isBadRequest());

        // Validate the EventRecord in the database
        List<EventRecord> eventRecordList = eventRecordRepository.findAll();
        assertThat(eventRecordList).hasSize(databaseSizeBeforeCreate);

        // Validate the EventRecord in Elasticsearch
        verify(mockEventRecordSearchRepository, times(0)).save(eventRecord);
    }

    @Test
    @Transactional
    public void getAllEventRecords() throws Exception {
        // Initialize the database
        eventRecordRepository.saveAndFlush(eventRecord);

        // Get all the eventRecordList
        restEventRecordMockMvc.perform(get("/api/event-records?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventRecord.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))));
    }
    
    @Test
    @Transactional
    public void getEventRecord() throws Exception {
        // Initialize the database
        eventRecordRepository.saveAndFlush(eventRecord);

        // Get the eventRecord
        restEventRecordMockMvc.perform(get("/api/event-records/{id}", eventRecord.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(eventRecord.getId().intValue()))
            .andExpect(jsonPath("$.createdAt").value(sameInstant(DEFAULT_CREATED_AT)))
            .andExpect(jsonPath("$.updatedAt").value(sameInstant(DEFAULT_UPDATED_AT)));
    }

    @Test
    @Transactional
    public void getNonExistingEventRecord() throws Exception {
        // Get the eventRecord
        restEventRecordMockMvc.perform(get("/api/event-records/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEventRecord() throws Exception {
        // Initialize the database
        eventRecordRepository.saveAndFlush(eventRecord);

        int databaseSizeBeforeUpdate = eventRecordRepository.findAll().size();

        // Update the eventRecord
        EventRecord updatedEventRecord = eventRecordRepository.findById(eventRecord.getId()).get();
        // Disconnect from session so that the updates on updatedEventRecord are not directly saved in db
        em.detach(updatedEventRecord);
        updatedEventRecord
            .createdAt(UPDATED_CREATED_AT)
            .updatedAt(UPDATED_UPDATED_AT);

        restEventRecordMockMvc.perform(put("/api/event-records")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEventRecord)))
            .andExpect(status().isOk());

        // Validate the EventRecord in the database
        List<EventRecord> eventRecordList = eventRecordRepository.findAll();
        assertThat(eventRecordList).hasSize(databaseSizeBeforeUpdate);
        EventRecord testEventRecord = eventRecordList.get(eventRecordList.size() - 1);
        assertThat(testEventRecord.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testEventRecord.getUpdatedAt()).isEqualTo(UPDATED_UPDATED_AT);

        // Validate the EventRecord in Elasticsearch
        verify(mockEventRecordSearchRepository, times(1)).save(testEventRecord);
    }

    @Test
    @Transactional
    public void updateNonExistingEventRecord() throws Exception {
        int databaseSizeBeforeUpdate = eventRecordRepository.findAll().size();

        // Create the EventRecord

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEventRecordMockMvc.perform(put("/api/event-records")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventRecord)))
            .andExpect(status().isBadRequest());

        // Validate the EventRecord in the database
        List<EventRecord> eventRecordList = eventRecordRepository.findAll();
        assertThat(eventRecordList).hasSize(databaseSizeBeforeUpdate);

        // Validate the EventRecord in Elasticsearch
        verify(mockEventRecordSearchRepository, times(0)).save(eventRecord);
    }

    @Test
    @Transactional
    public void deleteEventRecord() throws Exception {
        // Initialize the database
        eventRecordRepository.saveAndFlush(eventRecord);

        int databaseSizeBeforeDelete = eventRecordRepository.findAll().size();

        // Get the eventRecord
        restEventRecordMockMvc.perform(delete("/api/event-records/{id}", eventRecord.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<EventRecord> eventRecordList = eventRecordRepository.findAll();
        assertThat(eventRecordList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the EventRecord in Elasticsearch
        verify(mockEventRecordSearchRepository, times(1)).deleteById(eventRecord.getId());
    }

    @Test
    @Transactional
    public void searchEventRecord() throws Exception {
        // Initialize the database
        eventRecordRepository.saveAndFlush(eventRecord);
        when(mockEventRecordSearchRepository.search(queryStringQuery("id:" + eventRecord.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(eventRecord), PageRequest.of(0, 1), 1));
        // Search the eventRecord
        restEventRecordMockMvc.perform(get("/api/_search/event-records?query=id:" + eventRecord.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventRecord.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(sameInstant(DEFAULT_CREATED_AT))))
            .andExpect(jsonPath("$.[*].updatedAt").value(hasItem(sameInstant(DEFAULT_UPDATED_AT))));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventRecord.class);
        EventRecord eventRecord1 = new EventRecord();
        eventRecord1.setId(1L);
        EventRecord eventRecord2 = new EventRecord();
        eventRecord2.setId(eventRecord1.getId());
        assertThat(eventRecord1).isEqualTo(eventRecord2);
        eventRecord2.setId(2L);
        assertThat(eventRecord1).isNotEqualTo(eventRecord2);
        eventRecord1.setId(null);
        assertThat(eventRecord1).isNotEqualTo(eventRecord2);
    }
}
