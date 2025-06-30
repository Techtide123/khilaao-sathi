// src/store/useAppDataStore.js
import { create } from 'zustand'


const useUserStore = create((set, get) => ({
    users: null,
    isLoading: true,

    fetchUsers: async () => {
        if (get().users) {
            console.log("✅ Using cached data, no fetch");
            return;
        }
        const res = await fetch('/api/getusers', {
        })

        const json = await res.json()
        // console.log("Fecthin the Users res..........")
        // console.log(json.user)
        set({ users: json.user, isLoading: false })
    },
}))

export default useUserStore