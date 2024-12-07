import { create } from "zustand";

// Типизация данных пользователя
interface User {
  TelegramId: string | null; // Изменили id на TelegramId
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
  is_premium: boolean;
  ecobalance: number; 
  wallets: []; // Пустой массив по умолчанию
}

// Типизация данных карты из коллекции
interface UserCard {
  cardId: number; // ID карты
  serialNumber: number; // Серийный номер карты
  isActive: boolean; // Статус активности карты
  acquiredAt: string; // Дата приобретения карты
}

// Типизация состояния хранилища
interface UserStore {
  user: User; // Данные пользователя
  setUser: (userData: User) => void; // Установка пользователя
  updateUser: (updatedData: Partial<User>) => void; // Обновление данных пользователя
  clearUser: () => void; // Очистка данных пользователя
  walletAddress: string | null; // Адрес кошелька
  setWalletAddress: (address: string) => void; // Функция для обновления адреса кошелька
  collection: UserCard[]; // Коллекция карт
  setCollection: (collection: UserCard[]) => void; // Установка коллекции карт
  updateCardStatus: (cardId: number, isActive: boolean) => void; // Обновление статуса карты
}

const useUserStore = create<UserStore>((set) => ({
  user: {
    TelegramId: null, // Теперь используем TelegramId
    first_name: '',
    last_name: '',
    username: '',
    language_code: '',
    is_premium: false,
    ecobalance: 0.0, // Устанавливаем значение по умолчанию
    wallets: [], // Пустой массив по умолчанию 
  },
  setUser: (userData) => set({ user: { ...userData } }),
  updateUser: (updatedData) => set((state) => ({
    user: { ...state.user, ...updatedData },
  })),
  clearUser: () => set({
    user: {
      TelegramId: null,
      first_name: '',
      last_name: '',
      username: '',
      language_code: '',
      is_premium: false,
      ecobalance: 0.0,
      wallets: [],
    },
  }),
  walletAddress: null, // Изначально адрес кошелька пустой
  setWalletAddress: (address) => set({ walletAddress: address }), // Обновление адреса кошелька
  collection: [], // Изначально коллекция пуста
  setCollection: (collection) => set({ collection }), // Установка коллекции карт
  updateCardStatus: (cardId, isActive) => set((state) => ({
    collection: state.collection.map((card) =>
      card.cardId === cardId ? { ...card, isActive } : card
    ),
  })), // Обновление статуса карты
}));

export default useUserStore;

