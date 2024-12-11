import { create } from "zustand";

// Типизация карточки из коллекции
export interface Card {
  cardId: number;
  serialNumber: string;
  isActive: boolean;
  acquiredAt: string | Date;
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

// Типизация для майнинга
export interface Mining {
  minedCoins: number;     // Количество добытых монет
  bonusCoins: number;     // Количество бонусных монет
  burnedCoins: number;    // Количество сожженных монет
  lastClaim: string;      // Дата последнего запроса (например, ISO 8601 строка)
}

export interface UpdatedCard extends Card {
  minedCoins: number;      // Количество намайненных монет
  remainingCoins: number;  // Оставшиеся монеты

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
  totalProfit: number; // Тип уже задан как number
  setTotalProfit: (profit: number) => void; // Убедитесь, что параметр profit имеет тип number

   // Добавляем состояния для майнинга
   mining: Mining;             // Добавляем объект для майнинга
   setMining: (miningData: Mining) => void; // Метод для обновления данных майнинга
   updateMining: (updatedData: Partial<Mining>) => void; // Метод для обновления части данных майнинга
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
  totalProfit: 0,
  setTotalProfit: (profit) => set({ totalProfit: profit }), // Реализуем сеттер
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
  setWalletAddress: (address) => set({ walletAddress: address }),

 // Добавляем данные для майнинга
 mining: {
  minedCoins: 0.0,      // Изначально 0 монет
  bonusCoins: 0.0,      // Изначально 0 бонусных монет
  burnedCoins: 0.0,     // Изначально 0 сожженных монет
  lastClaim: '',        // Изначально пустая строка
},

setMining: (miningData) => set({ mining: { ...miningData } }),
updateMining: (updatedData) => set((state) => ({
  mining: { ...state.mining, ...updatedData }
}))

}));

export default useUserStore;
