package fr.ekod.roombooking.controller.admin;

import fr.ekod.roombooking.dto.reservation.ReservationDTO;
import fr.ekod.roombooking.dto.reservation.UpdateReservationStatusRequest;
import fr.ekod.roombooking.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<ReservationDTO>> getAllReservations() {
        return ResponseEntity.ok(reservationService.findAll());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ReservationDTO> updateReservationStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReservationStatusRequest request
    ) {
        return ResponseEntity.ok(reservationService.updateStatusAsAdmin(id, request));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ReservationDTO> cancelReservation(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.cancelAsAdmin(id));
    }
}