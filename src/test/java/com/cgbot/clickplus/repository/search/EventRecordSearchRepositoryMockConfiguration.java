package com.cgbot.clickplus.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of EventRecordSearchRepository to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class EventRecordSearchRepositoryMockConfiguration {

    @MockBean
    private EventRecordSearchRepository mockEventRecordSearchRepository;

}
