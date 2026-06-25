package fr.ekod.roombooking.service;

import fr.ekod.roombooking.dto.reservation.CreateReservationRequest;
import fr.ekod.roombooking.dto.reservation.ReservationDTO;
import fr.ekod.roombooking.dto.reservation.UpdateReservationStatusRequest;
import fr.ekod.roombooking.entity.Reservation;
import fr.ekod.roombooking.entity.Role;
import fr.ekod.roombooking.entity.Room;
import fr.ekod.roombooking.entity.User;
import fr.ekod.roombooking.exception.ReservationConflictException;
import fr.ekod.roombooking.exception.ReservationNotFoundException;
import fr.ekod.roombooking.exception.RoomNotFoundException;
import fr.ekod.roombooking.exception.UnauthorizedAccessException;
import fr.ekod.roombooking.mapper.ReservationMapper;
import fr.ekod.roombooking.repository.ReservationRepository;
import fr.ekod.roombooking.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final ReservationMapper reservationMapper;
    public List<ReservationDTO> findAll() {
        return reservationMapper.toDtoList(reservationRepository.findAllWithDetails());
    }

    public List<ReservationDTO> findByCurrentUser(User user) {
        requireAuthenticated(user);
        return reservationMapper.toDtoList(reservationRepository.findByUserIdWithDetails(user.getId()));
    }

    public List<ReservationDTO> findByRoomId(Long roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new RoomNotFoundException(roomId);
        }
        return reservationMapper.toDtoList(reservationRepository.findByRoomIdWithDetails(roomId));
    }

    @Transactional
    public ReservationDTO updateStatusAsAdmin(Long id, UpdateReservationStatusRequest request) {
        Reservation reservation = findReservationOrThrow(id);

        reservation.setStatus(request.status());
        return reservationMapper.toDto(reservationRepository.save(reservation));
    }

    @Transactional
    public ReservationDTO cancelAsAdmin(Long id) {
        Reservation reservation = findReservationOrThrow(id);

        if (reservation.getStatus() == Reservation.Status.CANCELLED) {
            throw new ReservationConflictException("Cette réservation est déjà annulée");
        }

        reservation.setStatus(Reservation.Status.CANCELLED);
        return reservationMapper.toDto(reservationRepository.save(reservation));
    }

    @Transactional
    public ReservationDTO create(CreateReservationRequest request, User user) {
        requireAuthenticated(user);
        validateFutureDates(request.startDateTime(), request.endDateTime());
        validateDateRange(request.startDateTime(), request.endDateTime());

        Room room = roomRepository.findById(request.roomId())
                .orElseThrow(() -> new RoomNotFoundException(request.roomId()));

        validateRoomAvailable(room);
        validateCapacity(request.attendeesCount(), room);

        if (reservationRepository.existsOverlappingReservation(
                request.roomId(), request.startDateTime(), request.endDateTime())) {
            throw new ReservationConflictException("La salle est déjà réservée sur ce créneau");
        }

        Reservation reservation = Reservation.builder()
                .startDateTime(request.startDateTime())
                .endDateTime(request.endDateTime())
                .purpose(request.purpose())
                .attendeesCount(request.attendeesCount())
                .room(room)
                .user(user)
                .build();

        return reservationMapper.toDto(reservationRepository.save(reservation));
    }

    @Transactional
    public ReservationDTO updateStatus(Long id, UpdateReservationStatusRequest request, User user) {
        requireAuthenticated(user);
        Reservation reservation = findReservationOrThrow(id);
        requireOwnerOrAdmin(reservation, user);

        reservation.setStatus(request.status());
        return reservationMapper.toDto(reservationRepository.save(reservation));
    }

    @Transactional
    public void cancel(Long id, User user) {
        requireAuthenticated(user);
        Reservation reservation = findReservationOrThrow(id);
        requireOwner(reservation, user);

        if (reservation.getStatus() == Reservation.Status.CANCELLED) {
            throw new ReservationConflictException("Cette réservation est déjà annulée");
        }

        reservation.setStatus(Reservation.Status.CANCELLED);
        reservationRepository.save(reservation);
    }

    private Reservation findReservationOrThrow(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ReservationNotFoundException(id));
    }

    private void validateFutureDates(LocalDateTime start, LocalDateTime end) {
        LocalDateTime now = LocalDateTime.now();
        if (!start.isAfter(now)) {
            throw new ReservationConflictException("La date de début doit être dans le futur");
        }
        if (!end.isAfter(now)) {
            throw new ReservationConflictException("La date de fin doit être dans le futur");
        }
    }

    private void validateDateRange(LocalDateTime start, LocalDateTime end) {
        if (!start.isBefore(end)) {
            throw new ReservationConflictException("La date de début doit être antérieure à la date de fin");
        }
    }

    private void validateRoomAvailable(Room room) {
        if (!Boolean.TRUE.equals(room.getAvailable())) {
            throw new ReservationConflictException("La salle n'est pas active ou disponible à la réservation");
        }
    }

    private void validateCapacity(int attendeesCount, Room room) {
        if (attendeesCount > room.getCapacity()) {
            throw new ReservationConflictException(
                    "Le nombre de participants (" + attendeesCount + ") dépasse la capacité maximale de la salle ("
                            + room.getCapacity() + ")"
            );
        }
    }

    private void requireAuthenticated(User user) {
        if (user == null) {
            throw new UnauthorizedAccessException();
        }
    }

    private void requireOwner(Reservation reservation, User user) {
        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedAccessException("Vous ne pouvez annuler que vos propres réservations");
        }
    }

    private void requireOwnerOrAdmin(Reservation reservation, User user) {
        boolean isOwner = reservation.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedAccessException("Vous n'êtes pas autorisé à modifier cette réservation");
        }
    }
}
