package fr.ekod.roombooking.controller;

import fr.ekod.roombooking.dto.reservation.CreateReservationRequest;
import fr.ekod.roombooking.dto.reservation.ReservationDTO;
import fr.ekod.roombooking.dto.reservation.UpdateReservationStatusRequest;
import fr.ekod.roombooking.entity.User;
import fr.ekod.roombooking.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping("/me")
    public List<ReservationDTO> getMyReservations(@AuthenticationPrincipal User user) {
        return reservationService.findByCurrentUser(user);
    }

    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(
            @Valid @RequestBody CreateReservationRequest request,
            @AuthenticationPrincipal User user
    ) {
        ReservationDTO created = reservationService.create(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}/status")
    public ReservationDTO updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReservationStatusRequest request,
            @AuthenticationPrincipal User user
    ) {
        return reservationService.updateStatus(id, request, user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(
            @PathVariable Long id,
            @AuthenticationPrincipal User user
    ) {
        reservationService.cancel(id, user);
        return ResponseEntity.noContent().build();
    }
}
