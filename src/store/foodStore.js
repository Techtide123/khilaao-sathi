// src/store/useAppDataStore.js
import { create } from 'zustand'


const usefoodStore = create((set, get) => ({
    data: null,
    isLoading: true,

    fetchData: async () => {
        if (get().data) {
            console.log("✅ Fetching from the cache .......");
            return;
        }
        const res = await fetch('/api/getfood?filter=all', {
        })

        const json = await res.json()
        // console.log("Fecthin the food res..........")
        console.log(json.foods)
        set({ data: json.foods, isLoading: false })
    },
}))

export default usefoodStore