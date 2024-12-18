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
  miningcycle: number;
  profitperhour: number;
  minedcoins: number;
  remainingcoins: number;   
  price: number;          // Цена карты
  edition: number; 
  cardlastclaim: string | Date;     
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
  userCollection: Card[]; // Коллекция пользователя
  setUser: (userData: User) => void;
  updateUser: (updatedData: Partial<User>) => void;
  clearUser: () => void;
  setUserCollection: (collectionData: Card[]) => void;
  walletAddress: string | null;
  setWalletAddress: (address: string) => void;
  totalProfit: number;
  setTotalProfit: (profit: number) => void;

  // Данные для майнинга
  mining: Mining;
  setMining: (miningData: Mining) => void;
  updateMining: (updatedData: Partial<Mining>) => void;

  // Новый параметр startParam
  startParam: string | null;
  setStartParam: (param: string) => void;
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
  setTotalProfit: (profit) => set({ totalProfit: profit }),
  userCollection: [],
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
      userCollection: []
    }),
  setUserCollection: (collectionData) => set({ userCollection: collectionData }),
  walletAddress: null,
  setWalletAddress: (address) => set({ walletAddress: address }),

  // Данные для майнинга
  mining: {
    minedCoins: 0.0,
    bonusCoins: 0.0,
    burnedCoins: 0.0,
    lastClaim: '',
  },
  setMining: (miningData) => set({ mining: { ...miningData } }),
  updateMining: (updatedData) => set((state) => ({
    mining: { ...state.mining, ...updatedData }
  })),

  // Новый параметр startParam
  startParam: null,
  setStartParam: (param) => set({ startParam: param }),
}));

// Типизация и функции для работы с рефералами
export interface ReferralData {
  referrals: { [userId: string]: string[] };
  referredBy: { [userId: string]: string };
}

let storage: ReferralData = {
  referrals: {},
  referredBy: {}
};

export function saveReferral(userId: string, referrerId: string) {
  if (!storage.referrals[referrerId]) {
    storage.referrals[referrerId] = [];
  }
  storage.referrals[referrerId].push(userId);
  storage.referredBy[userId] = referrerId;
}

export function getReferrals(userId: string): string[] {
  return storage.referrals[userId] || [];
}

export function getReferrer(userId: string): string | null {
  return storage.referredBy[userId] || null;
}

export default useUserStore;


