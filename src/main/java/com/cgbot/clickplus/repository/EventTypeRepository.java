package com.cgbot.clickplus.repository;

import com.cgbot.clickplus.domain.EventType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the EventType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventTypeRepository extends JpaRepository<EventType, Long> {

    @Query("select event_type from EventType event_type where event_type.user.login = ?#{principal.username}")
    List<EventType> findByUserIsCurrentUser();

    @Query("select event_type from EventType event_type where event_type.user.login = ?#{principal.username}")
    Page<EventType> findByUserIsCurrentUser(Pageable pageable);
}
