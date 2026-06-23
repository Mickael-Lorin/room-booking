package fr.ekod.roombooking.controller;

import fr.ekod.roombooking.dto.room.RoomDTO;
import fr.ekod.roombooking.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

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
}
