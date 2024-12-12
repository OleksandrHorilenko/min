

export type IconProps = {
    size?: number;
    className?: string;
}

export type TabType = 'home' | 'wallet' | 'leaderboard' | 'friends' | 'earn';



export interface UserCard {
    _id: string;
    cardId: number; // ID карты
    rarity: string;
    title: string;
    description: string;
    miningcoins: number;
    miningperiod: number;
    miningcycle: number;
    price: number;
    edition: number;
    serialNumber: number; // Серийный номер карты
    isActive: boolean; // Статус активности карты
    acquiredAt: string; // Дата приобретения карты
  }