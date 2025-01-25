import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface WillState {
  willAddresses: Record<string, string>
  setWillAddress: (userAddress: string, willAddress: string) => void
  getWillAddress: (userAddress: string) => string | null
}

export const useWillStore = create<WillState>()(
  persist(
    (set, get) => ({
      willAddresses: {},
      setWillAddress: (userAddress, willAddress) => 
        set((state) => ({
          willAddresses: {
            ...state.willAddresses,
            [userAddress]: willAddress
          }
        })),
      getWillAddress: (userAddress) => 
        get().willAddresses[userAddress] || null
    }),
    {
      name: 'will-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
) 