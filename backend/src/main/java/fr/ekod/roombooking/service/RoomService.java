package fr.ekod.roombooking.service;

import fr.ekod.roombooking.dto.room.CreateRoomRequest;
import fr.ekod.roombooking.dto.room.PatchRoomNameRequest;
import fr.ekod.roombooking.dto.room.RoomDTO;
import fr.ekod.roombooking.dto.room.UpdateRoomRequest;
import fr.ekod.roombooking.entity.Room;
import fr.ekod.roombooking.exception.RoomNotFoundException;
import fr.ekod.roombooking.mapper.RoomMapper;
import fr.ekod.roombooking.repository.RoomRepository;
import fr.ekod.roombooking.repository.specification.RoomSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomMapper roomMapper;

    private static final Sort ROOM_ORDER = Sort.by("id").ascending();

    public List<RoomDTO> findAll() {
        return roomMapper.toDtoList(roomRepository.findAll(ROOM_ORDER));
    }

    public RoomDTO findById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException(id));
        return roomMapper.toDto(room);
    }

    public List<RoomDTO> search(Integer minCapacity, String equipment, Boolean available, String location) {
        Specification<Room> spec = Specification.allOf(
                RoomSpecifications.hasMinCapacity(minCapacity),
                RoomSpecifications.hasEquipment(equipment),
                RoomSpecifications.isAvailable(available),
                RoomSpecifications.hasLocation(location)
        );

        return roomMapper.toDtoList(roomRepository.findAll(spec, ROOM_ORDER));
    }

    @Transactional
    public RoomDTO create(CreateRoomRequest request) {
        Room room = Room.builder()
                .name(request.name())
                .description(request.description())
                .capacity(request.capacity())
                .location(request.location())
                .equipment(request.equipment())
                .available(request.available() != null ? request.available() : true)
                .imageUrl(request.imageUrl())
                .build();

        return roomMapper.toDto(roomRepository.save(room));
    }

    @Transactional
    public RoomDTO update(Long id, UpdateRoomRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException(id));

        room.setName(request.name());
        room.setDescription(request.description());
        room.setCapacity(request.capacity());
        room.setLocation(request.location());
        room.setEquipment(request.equipment());
        room.setAvailable(request.available());
        room.setImageUrl(request.imageUrl());

        return roomMapper.toDto(roomRepository.save(room));
    }

    @Transactional
    public RoomDTO patchName(Long id, PatchRoomNameRequest request) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RoomNotFoundException(id));

        room.setName(request.name());

        return roomMapper.toDto(roomRepository.save(room));
    }

    @Transactional
    public void delete(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RoomNotFoundException(id);
        }
        roomRepository.deleteById(id);
    }
}
