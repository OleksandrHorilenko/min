import { create } from "zustand";

// Типизация карточки из коллекции
interface Card {
  cardId: number;
  serialNumber: string;
  isActive: boolean;
  acquiredAt: string;
  rarity: string;         // Редкость карты
  title: string;          // Название карты
  description: string;    // Описание карты
  miningcoins: number;    // Количество добываемых монет
  miningperiod: number;   // Период добычи
  miningcycle: number;    // Цикл добычи
  price: number;          // Цена карты
  edition: number;        // Тираж карты
  _id: string;
}

// Типизация данных пользователя
interface User {
  TelegramId: string;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
  is_premium: boolean;
  ecobalance: number;
  wallets: []; // Пустой массив по умолчанию
}

// Типизация состояния хранилища
interface UserStore {
  user: User;
  userCollection: Card[]; // Добавляем коллекцию пользователя
  setUser: (userData: User) => void;
  updateUser: (updatedData: Partial<User>) => void;
  clearUser: () => void;
  setUserCollection: (collectionData: Card[]) => void; // Метод для обновления коллекции
  walletAddress: string | null;
  setWalletAddress: (address: string) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: {
    TelegramId: '',
    first_name: '',
    last_name: '',
    username: '',
    language_code: '',
    is_premium: false,
    ecobalance: 0.0,
    wallets: []
  },
  userCollection: [], // Изначально коллекция пуста
  setUser: (userData) => set({ user: { ...userData } }),
  updateUser: (updatedData) => set((state) => ({
    user: { ...state.user, ...updatedData }
  })),
  clearUser: () =>
    set({
      user: {
        TelegramId: '',
        first_name: '',
        last_name: '',
        username: '',
        language_code: '',
        is_premium: false,
        ecobalance: 0.0,
        wallets: []
      },
      userCollection: [] // Очищаем коллекцию при сбросе
    }),
  setUserCollection: (collectionData) =>
    set({ userCollection: collectionData }), // Метод для обновления коллекции
  walletAddress: null,
  setWalletAddress: (address) => set({ walletAddress: address })
}));

export default useUserStore;
