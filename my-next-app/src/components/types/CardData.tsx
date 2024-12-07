export interface CardData {
    cardId: number;
    rarity: string;
    title: string;
    description: string;
    miningcoins: number;
    miningperiod: number;
    miningcycle: number;
    price: number;
    edition: number;
    serialNumber: string; // Обязательное поле
    isActive: boolean;    // Обязательное поле
    acquiredAt: string;   // Обязательное поле
  }