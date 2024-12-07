export interface CardData {
    cardId: number;         // ID карты
  serialNumber: number;   // Уникальный номер карты
  isActive: boolean;      // Активна или нет
  acquiredAt: Date;       // Дата приобретения карты
  rarity: string;         // Редкость карты
  title: string;          // Название карты
  description: string;    // Описание карты
  miningcoins: number;    // Количество добываемых монет
  miningperiod: number;   // Период добычи
  miningcycle: number;    // Цикл добычи
  price: number;          // Цена карты
  edition: number;        // Тираж карты
  }