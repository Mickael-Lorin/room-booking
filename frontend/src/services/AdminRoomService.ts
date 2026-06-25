import { adminRoomsApi } from '../api/adminRoomsApi'
import type {
    CreateRoomPayload,
    PatchRoomNamePayload,
    Room,
    UpdateRoomPayload,
} from '../types/room'

export const adminRoomService = {
    getRooms(): Promise<Room[]> {
        return adminRoomsApi.getRooms()
    },

    createRoom(payload: CreateRoomPayload): Promise<Room> {
        return adminRoomsApi.createRoom(payload)
    },

    updateRoom(id: number, payload: UpdateRoomPayload): Promise<Room> {
        return adminRoomsApi.updateRoom(id, payload)
    },

    patchRoomName(id: number, payload: PatchRoomNamePayload): Promise<Room> {
        return adminRoomsApi.patchRoomName(id, payload)
    },

    deleteRoom(id: number): Promise<void> {
        return adminRoomsApi.deleteRoom(id)
    },
}