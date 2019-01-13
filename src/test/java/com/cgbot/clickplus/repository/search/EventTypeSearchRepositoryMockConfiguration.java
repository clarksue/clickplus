package com.cgbot.clickplus.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of EventTypeSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class EventTypeSearchRepositoryMockConfiguration {

    @MockBean
    private EventTypeSearchRepository mockEventTypeSearchRepository;

}
