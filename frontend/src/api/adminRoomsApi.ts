import { apiRequest } from './http'
import type {
    CreateRoomPayload,
    PatchRoomNamePayload,
    Room,
    UpdateRoomPayload,
} from '../types/room'

const ADMIN_ROOMS_ENDPOINT = '/admin/rooms'

export const adminRoomsApi = {
    getRooms(): Promise<Room[]> {
        return apiRequest<Room[]>(ADMIN_ROOMS_ENDPOINT, {
            authenticated: true,
        })
    },

    createRoom(payload: CreateRoomPayload): Promise<Room> {
        return apiRequest<Room>(ADMIN_ROOMS_ENDPOINT, {
            method: 'POST',
            authenticated: true,
            body: payload,
        })
    },

    updateRoom(id: number, payload: UpdateRoomPayload): Promise<Room> {
        return apiRequest<Room>(`${ADMIN_ROOMS_ENDPOINT}/${id}`, {
            method: 'PUT',
            authenticated: true,
            body: payload,
        })
    },

    patchRoomName(id: number, payload: PatchRoomNamePayload): Promise<Room> {
        return apiRequest<Room>(`${ADMIN_ROOMS_ENDPOINT}/${id}`, {
            method: 'PATCH',
            authenticated: true,
            body: payload,
        })
    },

    deleteRoom(id: number): Promise<void> {
        return apiRequest<void>(`${ADMIN_ROOMS_ENDPOINT}/${id}`, {
            method: 'DELETE',
            authenticated: true,
        })
    },
}