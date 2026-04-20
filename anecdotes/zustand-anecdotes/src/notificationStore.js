import { create } from 'zustand'
export const useMessageStore = create((set) => ({
    message: '',
    actions: {
        setNotificationMessage: (message) => {
            set({message})
            setTimeout(() => {
                set({ message: '' })
            }, 5000)}
    }
}))

export const useNotification = () =>
    useMessageStore((state) => state.message)