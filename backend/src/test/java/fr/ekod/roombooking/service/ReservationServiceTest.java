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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Tests unitaires de la logique métier de ReservationService.
 *
 * Pas de Spring, pas de base de données : uniquement la classe, ses
 * dépendances mockées (Mockito) et JUnit. Chaque règle métier de
 * ReservationService.create()/cancel()/updateStatus() est couverte dans
 * les deux sens (cas qui passe et cas qui refuse).
 */
@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private RoomRepository roomRepository;

    @Mock
    private ReservationMapper reservationMapper;

    private ReservationService reservationService;

    private User owner;
    private User otherUser;
    private User admin;
    private Room room;

    @BeforeEach
    void setUp() {
        reservationService = new ReservationService(reservationRepository, roomRepository, reservationMapper);

        owner = User.builder().id(1L).email("user@ekod.fr").role(Role.USER).build();
        otherUser = User.builder().id(2L).email("autre@ekod.fr").role(Role.USER).build();
        admin = User.builder().id(3L).email("admin@ekod.fr").role(Role.ADMIN).build();

        room = Room.builder().id(10L).name("Salle Test").capacity(10).available(true).build();
    }

    // ──────────────────────────────────────────────────────────────────────
    // create() — règle : utilisateur authentifié
    // ──────────────────────────────────────────────────────────────────────

    @Test
    void create_whenUserIsNull_throwsUnauthorized() {
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        CreateReservationRequest request = new CreateReservationRequest(10L, start, start.plusHours(1), 5, "Réunion");

        assertThatThrownBy(() -> reservationService.create(request, null))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessage("Authentification requise");

        verifyNoInteractions(roomRepository, reservationRepository);
    }

    // ──────────────────────────────────────────────────────────────────────
    // create() — règle : dates dans le futur
    // ──────────────────────────────────────────────────────────────────────

    @Test
    void create_whenStartDateInPast_throwsConflict() {
        LocalDateTime start = LocalDateTime.now().minusDays(1);
        LocalDateTime end = LocalDateTime.now().plusDays(1);
        CreateReservationRequest request = new CreateReservationRequest(10L, start, end, 5, "Réunion");

        assertThatThrownBy(() -> reservationService.create(request, owner))
                .isInstanceOf(ReservationConflictException.class)
                .hasMessage("La date de début doit être dans le futur");

        verifyNoInteractions(roomRepository, reservationRepository);
    }

    @Test
    void create_whenEndDateInPast_throwsConflict() {
        LocalDateTime start = LocalDateTime.now().plusMinutes(10);
        LocalDateTime end = LocalDateTime.now().minusMinutes(10);
        CreateReservationRequest request = new CreateReservationRequest(10L, start, end, 5, "Réunion");

        assertThatThrownBy(() -> reservationService.create(request, owner))
                .isInstanceOf(ReservationConflictException.class)
                .hasMessage("La date de fin doit être dans le futur");

        verifyNoInteractions(roomRepository, reservationRepository);
    }

    // ──────────────────────────────────────────────────────────────────────
    // create() — règle : début avant fin
    // ──────────────────────────────────────────────────────────────────────

    @Test
    void create_whenStartAfterEnd_throwsConflict() {
        LocalDateTime start = LocalDateTime.now().plusHours(3);
        LocalDateTime end = LocalDateTime.now().plusHours(1);
        CreateReservationRequest request = new CreateReservationRequest(10L, start, end, 5, "Réunion");

        assertThatThrownBy(() -> reservationService.create(request, owner))
                .isInstanceOf(ReservationConflictException.class)
                .hasMessage("La date de début doit être antérieure à la date de fin");

        verifyNoInteractions(roomRepository, reservationRepository);
    }

    // ──────────────────────────────────────────────────────────────────────
    // create() — règle : la salle doit exister
    // ──────────────────────────────────────────────────────────────────────

    @Test
    void create_whenRoomNotFound_throwsNotFound() {
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        CreateReservationRequest request = new CreateReservationRequest(99L, start, start.plusHours(1), 5, "Réunion");
        when(roomRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reservationService.create(request, owner))
                .isInstanceOf(RoomNotFoundException.class)
                .hasMessage("Salle introuvable avec l'identifiant : 99");

        verifyNoInteractions(reservationRepository);
    }

    // ──────────────────────────────────────────────────────────────────────
    // create() — règle : la salle doit être disponible
    // ──────────────────────────────────────────────────────────────────────

    @Test
    void create_whenRoomNotAvailable_throwsConflict() {
        Room unavailableRoom = Room.builder().id(10L).name("Salle Test").capacity(10).available(false).build();
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        CreateReservationRequest request = new CreateReservationRequest(10L, start, start.plusHours(1), 5, "Réunion");
        when(roomRepository.findById(10L)).thenReturn(Optional.of(unavailableRoom));

        assertThatThrownBy(() -> reservationService.create(request, owner))
                .isInstanceOf(ReservationConflictException.class)
                .hasMessage("La salle n'est pas active ou disponible à la réservation");

        verify(reservationRepository, never()).existsOverlappingReservation(any(), any(), any());
        verify(reservationRepository, never()).save(any());
    }

    // ──────────────────────────────────────────────────────────────────────
    // create() — règle : capacité de la salle respectée
    // ──────────────────────────────────────────────────────────────────────

    @Test
    void create_whenAttendeesExceedCapacity_throwsConflict() {
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        CreateReservationRequest request = new CreateReservationRequest(10L, start, start.plusHours(1), 15, "Réunion");
        when(roomRepository.findById(10L)).thenReturn(Optional.of(room));

        assertThatThrownBy(() -> reservationService.create(request, owner))
                .isInstanceOf(ReservationConflictException.class)
                .hasMessage("Le nombre de participants (15) dépasse la capacité maximale de la salle (10)");

        verify(reservationRepository, never()).existsOverlappingReservation(any(), any(), any());
        verify(reservationRepository, never()).save(any());
    }

    // ──────────────────────────────────────────────────────────────────────
    // create() — règle : pas de chevauchement de créneau
    // ──────────────────────────────────────────────────────────────────────

    @Test
    void create_whenSlotOverlaps_throwsConflict() {
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        LocalDateTime end = start.plusHours(1);
        CreateReservationRequest request = new CreateReservationRequest(10L, start, end, 5, "Réunion");
        when(roomRepository.findById(10L)).thenReturn(Optional.of(room));
        when(reservationRepository.existsOverlappingReservation(10L, start, end)).thenReturn(true);

        assertThatThrownBy(() -> reservationService.create(request, owner))
                .isInstanceOf(ReservationConflictException.class)
                .hasMessage("La salle est déjà réservée sur ce créneau");

        verify(reservationRepository, never()).save(any());
    }

    // ──────────────────────────────────────────────────────────────────────
    // create() — cas nominal : toutes les règles respectées
    // ──────────────────────────────────────────────────────────────────────

    @Test
    void create_whenAllRulesRespected_savesAndReturnsDto() {
        LocalDateTime start = LocalDateTime.now().plusDays(1);
        LocalDateTime end = start.plusHours(1);
        CreateReservationRequest request = new CreateReservationRequest(10L, start, end, 5, "Réunion Bruno");

        when(roomRepository.findById(10L)).thenReturn(Optional.of(room));
        when(reservationRepository.existsOverlappingReservation(10L, start, end)).thenReturn(false);

        Reservation saved = Reservation.builder()
                .id(100L)
                .startDateTime(start)
                .endDateTime(end)
                .attendeesCount(5)
                .purpose("Réunion Bruno")
                .room(room)
                .user(owner)
                .build();
        when(reservationRepository.save(any(Reservation.class))).thenReturn(saved);

        ReservationDTO expectedDto = new ReservationDTO(
                100L, start, end, Reservation.Status.PENDING, "Réunion Bruno", 5,
                10L, "Salle Test", 1L, "user@ekod.fr", null
        );
        when(reservationMapper.toDto(saved)).thenReturn(expectedDto);

        ReservationDTO result = reservationService.create(request, owner);

        assertThat(result).isEqualTo(expectedDto);

        ArgumentCaptor<Reservation> captor = ArgumentCaptor.forClass(Reservation.class);
        verify(reservationRepository).save(captor.capture());
        Reservation toSave = captor.getValue();
        assertThat(toSave.getRoom()).isEqualTo(room);
        assertThat(toSave.getUser()).isEqualTo(owner);
        assertThat(toSave.getAttendeesCount()).isEqualTo(5);
        assertThat(toSave.getPurpose()).isEqualTo("Réunion Bruno");
    }

    // ──────────────────────────────────────────────────────────────────────
    // cancel() — règle : utilisateur authentifié
    // ──────────────────────────────────────────────────────────────────────

    @Test
    void cancel_whenUserIsNull_throwsUnauthorized() {
        assertThatThrownBy(() -> reservationService.cancel(1L, null))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessage("Authentification requise");

        verifyNoInteractions(reservationRepository);
    }

    // ──────────────────────────────────────────────────────────────────────
    // cancel() — règle : la réservation doit exister
    // ──────────────────────────────────────────────────────────────────────

    @Test
    void cancel_whenReservationNotFound_throwsNotFound() {
        when(reservationRepository.findById(404L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reservationService.cancel(404L, owner))
                .isInstanceOf(ReservationNotFoundException.class)
                .hasMessage("Réservation introuvable avec l'identifiant : 404");
    }

    // ──────────────────────────────────────────────────────────────────────
    // cancel() — règle : seul le propriétaire peut annuler
    // ──────────────────────────────────────────────────────────────────────

    @Test
    void cancel_whenNotOwner_throwsUnauthorized() {
        Reservation reservation = Reservation.builder()
                .id(1L).status(Reservation.Status.PENDING).room(room).user(owner).build();
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        assertThatThrownBy(() -> reservationService.cancel(1L, otherUser))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessage("Vous ne pouvez annuler que vos propres réservations");

        verify(reservationRepository, never()).save(any());
    }

    // ──────────────────────────────────────────────────────────────────────
    // cancel() — règle : impossible d'annuler deux fois
    // ──────────────────────────────────────────────────────────────────────

    @Test
    void cancel_whenAlreadyCancelled_throwsConflict() {
        Reservation reservation = Reservation.builder()
                .id(1L).status(Reservation.Status.CANCELLED).room(room).user(owner).build();
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        assertThatThrownBy(() -> reservationService.cancel(1L, owner))
                .isInstanceOf(ReservationConflictException.class)
                .hasMessage("Cette réservation est déjà annulée");

        verify(reservationRepository, never()).save(any());
    }

    // ──────────────────────────────────────────────────────────────────────
    // cancel() — cas nominal : le propriétaire annule sa réservation
    // ──────────────────────────────────────────────────────────────────────

    @Test
    void cancel_whenOwnerCancelsPendingReservation_setsStatusCancelled() {
        Reservation reservation = Reservation.builder()
                .id(1L).status(Reservation.Status.PENDING).room(room).user(owner).build();
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        reservationService.cancel(1L, owner);

        ArgumentCaptor<Reservation> captor = ArgumentCaptor.forClass(Reservation.class);
        verify(reservationRepository).save(captor.capture());
        assertThat(captor.getValue().getStatus()).isEqualTo(Reservation.Status.CANCELLED);
    }

    // ──────────────────────────────────────────────────────────────────────
    // updateStatus() — règle : propriétaire OU admin peut modifier le statut
    // ──────────────────────────────────────────────────────────────────────

    @Test
    void updateStatus_whenOwner_succeeds() {
        Reservation reservation = Reservation.builder()
                .id(1L).status(Reservation.Status.PENDING).room(room).user(owner).build();
        ReservationDTO dto = new ReservationDTO(
                1L, null, null, Reservation.Status.CONFIRMED, null, null, 10L, "Salle Test", 1L, "user@ekod.fr", null
        );
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(inv -> inv.getArgument(0));
        when(reservationMapper.toDto(any(Reservation.class))).thenReturn(dto);

        UpdateReservationStatusRequest request = new UpdateReservationStatusRequest(Reservation.Status.CONFIRMED);
        reservationService.updateStatus(1L, request, owner);

        assertThat(reservation.getStatus()).isEqualTo(Reservation.Status.CONFIRMED);
    }

    @Test
    void updateStatus_whenAdminNotOwner_succeeds() {
        Reservation reservation = Reservation.builder()
                .id(1L).status(Reservation.Status.PENDING).room(room).user(owner).build();
        ReservationDTO dto = new ReservationDTO(
                1L, null, null, Reservation.Status.CONFIRMED, null, null, 10L, "Salle Test", 1L, "user@ekod.fr", null
        );
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));
        when(reservationRepository.save(any(Reservation.class))).thenAnswer(inv -> inv.getArgument(0));
        when(reservationMapper.toDto(any(Reservation.class))).thenReturn(dto);

        UpdateReservationStatusRequest request = new UpdateReservationStatusRequest(Reservation.Status.CONFIRMED);
        reservationService.updateStatus(1L, request, admin);

        assertThat(reservation.getStatus()).isEqualTo(Reservation.Status.CONFIRMED);
    }

    @Test
    void updateStatus_whenNotOwnerAndNotAdmin_throwsUnauthorized() {
        Reservation reservation = Reservation.builder()
                .id(1L).status(Reservation.Status.PENDING).room(room).user(owner).build();
        when(reservationRepository.findById(1L)).thenReturn(Optional.of(reservation));

        UpdateReservationStatusRequest request = new UpdateReservationStatusRequest(Reservation.Status.CONFIRMED);

        assertThatThrownBy(() -> reservationService.updateStatus(1L, request, otherUser))
                .isInstanceOf(UnauthorizedAccessException.class)
                .hasMessage("Vous n'êtes pas autorisé à modifier cette réservation");

        verify(reservationRepository, never()).save(any());
    }
}
