package fr.ekod.roombooking.controller;

import fr.ekod.roombooking.dto.reservation.ReservationDTO;
import fr.ekod.roombooking.dto.room.CreateRoomRequest;
import fr.ekod.roombooking.dto.room.PatchRoomNameRequest;
import fr.ekod.roombooking.dto.room.RoomDTO;
import fr.ekod.roombooking.dto.room.UpdateRoomRequest;
import fr.ekod.roombooking.service.ReservationService;
import fr.ekod.roombooking.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final ReservationService reservationService;

    @GetMapping
    public List<RoomDTO> getAllRooms() {
        return roomService.findAll();
    }

    @GetMapping("/search")
    public List<RoomDTO> searchRooms(
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) String equipment,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) String location
    ) {
        return roomService.search(minCapacity, equipment, available, location);
    }

    @GetMapping("/{id}")
    public RoomDTO getRoomById(@PathVariable Long id) {
        return roomService.findById(id);
    }

    @GetMapping("/{id}/reservations")
    public List<ReservationDTO> getRoomReservations(@PathVariable Long id) {
        return reservationService.findByRoomId(id);
    }

}
