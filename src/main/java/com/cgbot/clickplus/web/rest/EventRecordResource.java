package com.cgbot.clickplus.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.cgbot.clickplus.domain.EventRecord;
import com.cgbot.clickplus.domain.EventType;
import com.cgbot.clickplus.domain.User;
import com.cgbot.clickplus.repository.EventRecordRepository;
import com.cgbot.clickplus.repository.EventTypeRepository;
import com.cgbot.clickplus.repository.search.EventRecordSearchRepository;
import com.cgbot.clickplus.service.UserService;
import com.cgbot.clickplus.web.rest.errors.BadRequestAlertException;
import com.cgbot.clickplus.web.rest.util.HeaderUtil;
import com.cgbot.clickplus.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing EventRecord.
 */
@RestController
@RequestMapping("/api")
public class EventRecordResource {

    private final Logger log = LoggerFactory.getLogger(EventRecordResource.class);

    private static final String ENTITY_NAME = "eventRecord";

    private final EventRecordRepository eventRecordRepository;

    private final EventRecordSearchRepository eventRecordSearchRepository;
    
    private final EventTypeRepository eventTypeRepository;
    
    private final UserService userService;

    public EventRecordResource(EventRecordRepository eventRecordRepository, EventRecordSearchRepository eventRecordSearchRepository,
    		EventTypeRepository eventTypeRepository, UserService userService) {
        this.eventRecordRepository = eventRecordRepository;
        this.eventRecordSearchRepository = eventRecordSearchRepository;
        this.eventTypeRepository = eventTypeRepository;
        this.userService = userService;
    }

    /**
     * POST  /event-records : Create a new eventRecord.
     *
     * @param eventRecord the eventRecord to create
     * @return the ResponseEntity with status 201 (Created) and with body the new eventRecord, or with status 400 (Bad Request) if the eventRecord has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/event-records")
    @Timed
    public ResponseEntity<EventRecord> createEventRecord(@Valid @RequestBody EventRecord eventRecord) throws URISyntaxException {
        log.debug("REST request to save EventRecord : {}", eventRecord);
        if (eventRecord.getId() != null) {
            throw new BadRequestAlertException("A new eventRecord cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventRecord result = eventRecordRepository.save(eventRecord);
        eventRecordSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/event-records/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/event-records/{id}")
    @Timed
    public ResponseEntity<EventRecord> createEventRecord(@PathVariable Long id) throws URISyntaxException {
        log.debug("REST request to save EventRecord of type : {} for login user", id);
        Optional<EventType> eventType = eventTypeRepository.findById(id);
        if (eventType.isPresent() == false) {
        	throw new BadRequestAlertException("type id not found", ENTITY_NAME, "notypeid");
        }
        Optional<User> user = userService.getUserWithAuthorities();
        if (user.isPresent() == false) {
        	throw new BadRequestAlertException("user not login", ENTITY_NAME, "notlogin");
        }
        EventRecord eventRecord = new EventRecord();
        eventRecord.setUser(user.get());
        eventRecord.setEventType(eventType.get());
        eventRecord.setCreatedAt(ZonedDateTime.now());
        eventRecord.setUpdatedAt(eventRecord.getCreatedAt());
        EventRecord result = eventRecordRepository.save(eventRecord);
        eventRecordSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/event-records/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }
    
    /**
     * PUT  /event-records : Updates an existing eventRecord.
     *
     * @param eventRecord the eventRecord to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated eventRecord,
     * or with status 400 (Bad Request) if the eventRecord is not valid,
     * or with status 500 (Internal Server Error) if the eventRecord couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/event-records")
    @Timed
    public ResponseEntity<EventRecord> updateEventRecord(@Valid @RequestBody EventRecord eventRecord) throws URISyntaxException {
        log.debug("REST request to update EventRecord : {}", eventRecord);
        if (eventRecord.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        EventRecord result = eventRecordRepository.save(eventRecord);
        eventRecordSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, eventRecord.getId().toString()))
            .body(result);
    }

    /**
     * GET  /event-records : get all the eventRecords.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of eventRecords in body
     */
    @GetMapping("/event-records")
    @Timed
    public ResponseEntity<List<EventRecord>> getAllEventRecords(Pageable pageable) {
        log.debug("REST request to get a page of EventRecords");
        Page<EventRecord> page = eventRecordRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/event-records");
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET  /event-records/:id : get the "id" eventRecord.
     *
     * @param id the id of the eventRecord to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the eventRecord, or with status 404 (Not Found)
     */
    @GetMapping("/event-records/{id}")
    @Timed
    public ResponseEntity<EventRecord> getEventRecord(@PathVariable Long id) {
        log.debug("REST request to get EventRecord : {}", id);
        Optional<EventRecord> eventRecord = eventRecordRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(eventRecord);
    }

    /**
     * DELETE  /event-records/:id : delete the "id" eventRecord.
     *
     * @param id the id of the eventRecord to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/event-records/{id}")
    @Timed
    public ResponseEntity<Void> deleteEventRecord(@PathVariable Long id) {
        log.debug("REST request to delete EventRecord : {}", id);

        eventRecordRepository.deleteById(id);
        eventRecordSearchRepository.deleteById(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }

    /**
     * SEARCH  /_search/event-records?query=:query : search for the eventRecord corresponding
     * to the query.
     *
     * @param query the query of the eventRecord search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/event-records")
    @Timed
    public ResponseEntity<List<EventRecord>> searchEventRecords(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of EventRecords for query {}", query);
        Page<EventRecord> page = eventRecordSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/_search/event-records");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

}
