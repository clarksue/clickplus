package com.cgbot.clickplus.repository.search;

import com.cgbot.clickplus.domain.EventRecord;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the EventRecord entity.
 */
public interface EventRecordSearchRepository extends ElasticsearchRepository<EventRecord, Long> {
}
