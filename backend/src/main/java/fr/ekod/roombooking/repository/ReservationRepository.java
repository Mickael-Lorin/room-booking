package fr.ekod.roombooking.repository;

import fr.ekod.roombooking.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("""
            SELECT r FROM Reservation r
            JOIN FETCH r.room
            JOIN FETCH r.user
            ORDER BY r.startDateTime DESC
            """)
    List<Reservation> findAllWithDetails();

    @Query("""
            SELECT r FROM Reservation r
            JOIN FETCH r.room
            JOIN FETCH r.user
            WHERE r.user.id = :userId
            ORDER BY r.startDateTime DESC
            """)
    List<Reservation> findByUserIdWithDetails(@Param("userId") Long userId);

    @Query("""
            SELECT r FROM Reservation r
            JOIN FETCH r.room
            JOIN FETCH r.user
            WHERE r.room.id = :roomId
            ORDER BY r.startDateTime ASC
            """)
    List<Reservation> findByRoomIdWithDetails(@Param("roomId") Long roomId);

    @Query("""
            SELECT COUNT(r) > 0 FROM Reservation r
            WHERE r.room.id = :roomId
            AND r.status <> fr.ekod.roombooking.entity.Reservation.Status.CANCELLED
            AND r.startDateTime < :endDateTime
            AND r.endDateTime > :startDateTime
            """)
    boolean existsOverlappingReservation(
            @Param("roomId") Long roomId,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime
    );
}
