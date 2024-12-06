import cards from './data/cards'; // Импорт данных карт

import { CardData } from '@/components/types/CardData';
import CardComponent from './miningcards/CardComponent'; // Импорт шаблона карты
//import { CardData } from './types'; // Импорт интерфейса

export default function ({ cards }: { cards: CardData[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-8 black py-12">
      {cards.map((card: CardData) => (
        <CardComponent key={card.cardId} card={card} />
      ))}
    </div>
  );
}