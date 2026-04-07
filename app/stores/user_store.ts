import { create } from 'zustand'

interface User {
  id: string
  name: string
  username: string
  profileImage?: string
}

interface UserStore {
  user: User | null
  roomId: string
  setUser: (user: User) => void
  setRoomId: (roomId: string) => void
  generateAndSetRoomId: () => string
  clearUser: () => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  roomId: '',
  
  setUser: (user: User) => set({ user }),
  
  setRoomId: (roomId: string) => set({ roomId }),
  
  generateAndSetRoomId: () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    set({ roomId: result })
    return result
  },
  
  clearUser: () => set({ user: null, roomId: '' })
}))
