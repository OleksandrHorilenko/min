export interface CardData {
    cardId: number;
    serialNumber: string;
    isActive: boolean;    // Обязательное поле
    acquiredAt:  string | Date;   // Обязательное поле
    rarity: string;
    title: string;
    description: string;
    miningcoins: number;
    miningperiod: number;
    miningcycle: number;
    profitperhour: number;
    minedcoins: number;
    remainingcoins: number;  
    price: number;
    edition: number;
    cardlastclaim: string | Date;   
  }