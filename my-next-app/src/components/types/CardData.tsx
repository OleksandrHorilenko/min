export interface CardData {
    cardId: number;
    rarity?: string; // Некоторые поля могут быть необязательными
    title: string;
    description: string;
    miningcoins: number;
    miningperiod: number;
    miningcycle: number;
    price: number;
    edition: number;
  }