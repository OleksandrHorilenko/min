import { create } from "zustand";

// Типизация данных пользователя
interface User {
  TelegramId: string | null; // Изменили id на TelegramId
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
  is_premium: boolean;
}

// Типизация состояния хранилища
interface UserStore {
  user: User;
  setUser: (userData: User) => void;
  updateUser: (updatedData: Partial<User>) => void;
  clearUser: () => void;
  walletAddress: string | null; // Добавлен адрес кошелька
  setWalletAddress: (address: string) => void; // Функция для обновления адреса кошелька
}

const useUserStore = create<UserStore>((set) => ({
  user: {
    TelegramId: null, // Теперь используем TelegramId
    first_name: '',
    last_name: '',
    username: '',
    language_code: '',
    is_premium: false,
  },
  setUser: (userData) => set({ user: { ...userData } }),
  updateUser: (updatedData) => set((state) => ({
    user: { ...state.user, ...updatedData }
  })),
  clearUser: () => set({ user: { TelegramId: null, first_name: '', last_name: '', username: '', language_code: '', is_premium: false } }),
  walletAddress: null, // Изначально адрес кошелька пустой
  setWalletAddress: (address) => set({ walletAddress: address }), // Обновление адреса кошелька
}));

export default useUserStore;
