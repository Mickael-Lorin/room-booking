package fr.ekod.roombooking.controller.admin;

import fr.ekod.roombooking.dto.room.CreateRoomRequest;
import fr.ekod.roombooking.dto.room.PatchRoomNameRequest;
import fr.ekod.roombooking.dto.room.RoomDTO;
import fr.ekod.roombooking.dto.room.UpdateRoomRequest;
import fr.ekod.roombooking.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/rooms")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminRoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<List<RoomDTO>> getAllRooms() {
        return ResponseEntity.ok(roomService.findAll());
    }

    @PostMapping
    public ResponseEntity<RoomDTO> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        RoomDTO created = roomService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoomDTO> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody UpdateRoomRequest request
    ) {
        return ResponseEntity.ok(roomService.update(id, request));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<RoomDTO> patchRoomName(
            @PathVariable Long id,
            @Valid @RequestBody PatchRoomNameRequest request
    ) {
        return ResponseEntity.ok(roomService.patchName(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.delete(id);
        return ResponseEntity.noContent().build();
    }
}