package com.cgbot.clickplus.repository;

import com.cgbot.clickplus.domain.EventRecord;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the EventRecord entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventRecordRepository extends JpaRepository<EventRecord, Long> {

    @Query("select event_record from EventRecord event_record where event_record.user.login = ?#{principal.username}")
    List<EventRecord> findByUserIsCurrentUser();

}
