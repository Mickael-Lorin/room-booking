package fr.ekod.roombooking.repository.specification;

import fr.ekod.roombooking.entity.Room;
import org.springframework.data.jpa.domain.Specification;

public final class RoomSpecifications {

    private RoomSpecifications() {
    }

    public static Specification<Room> hasMinCapacity(Integer minCapacity) {
        return (root, query, cb) ->
                minCapacity == null ? null : cb.greaterThanOrEqualTo(root.get("capacity"), minCapacity);
    }

    public static Specification<Room> hasEquipment(String equipment) {
        return (root, query, cb) ->
                equipment == null || equipment.isBlank()
                        ? null
                        : cb.like(cb.lower(root.get("equipment")), "%" + equipment.toLowerCase() + "%");
    }

    public static Specification<Room> isAvailable(Boolean available) {
        return (root, query, cb) ->
                available == null ? null : cb.equal(root.get("available"), available);
    }

    public static Specification<Room> hasLocation(String location) {
        return (root, query, cb) ->
                location == null || location.isBlank()
                        ? null
                        : cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%");
    }
}
