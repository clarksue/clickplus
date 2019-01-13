package com.cgbot.clickplus.repository.search;

import com.cgbot.clickplus.domain.EventType;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the EventType entity.
 */
public interface EventTypeSearchRepository extends ElasticsearchRepository<EventType, Long> {
}
