import { CardData } from '@/components/types/CardData';
import useUserStore from '@/stores/useUserStore'; // Подключаем хранилище пользователя


export default function CardComponent({ card }: { card: CardData }) {
  const { title, description, miningcoins, miningperiod, miningcycle, price, rarity, cardId } = card;
  // Получаем данные пользователя из Zustand
  const { user } = useUserStore();
  

  // Устанавливаем цвет фона в зависимости от редкости
  const bgColor = (() => {
    switch (rarity) {
      case 'Common':
        return 'bg-gray-100';
      case 'Rare':
        return 'bg-blue-300';
      case 'Epic':
        return 'bg-yellow-300';
      default:
        return 'bg-gray-200'; // Цвет по умолчанию
    }
  })();

  // Обработчик покупки карты
  const handleBuyCard = async (currency: string) => {
    const TelegramId = user.TelegramId; // Здесь должен быть реальный TelegramId пользователя
    const acquiredAt = new Date().toISOString(); // Время покупки
    const serialNumber = card.cardId; // Генерация серийного номера

    try {
      const response = await fetch('/api/updateUserCollectionInDB', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
         TelegramId,
          cardId,
          serialNumber,
         acquiredAt,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Карта куплена за ${currency}:`, data);
        // Здесь можно обновить UI, если требуется
      } else {
        const errorData = await response.json();
        console.error('Ошибка при покупке карты:', errorData.error);
      }
    } catch (error) {
      console.error('Сетевая ошибка при покупке карты:', error);
    }
  };

  return (
    <div
      className={`relative w-[360px] h-[220px] ${bgColor} rounded-3xl shadow-2xl p-6 flex flex-col justify-between`}
    >
      {/* Верхняя часть */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600 font-medium">{rarity} Mining Card</p>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
        <div className="bg-gray-100 p-2 rounded-lg shadow-md">
          <span className="text-xs font-bold text-gray-700">Edition</span>
          <p className="text-sm font-semibold text-gray-800">#{card.edition}</p>
        </div>
      </div>

      {/* Центральная часть */}
      <div className="text-center space-y-2">
        <p className="text-gray-700">
          <strong className="text-lg text-green-600">{miningcoins} ECO</strong> over{" "}
          <span className="font-medium">{miningperiod} days</span>
        </p>
        <p className="text-gray-600 text-sm">Cycle: {miningcycle} hours</p>
      </div>

      {/* Нижняя часть */}
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold text-green-500">Price: {price} TON</p>
        <div className="flex space-x-2">
          <Button label="Buy ECO" color="bg-green-500" onClick={() => handleBuyCard('ECO')} />
          <Button label="Buy TON" color="bg-blue-500" onClick={() => handleBuyCard('TON')} />
          <Button label="Buy STARS" color="bg-yellow-500" onClick={() => handleBuyCard('STARS')} />
        </div>
      </div>
    </div>
  );
}

function Button({
  label,
  color,
  onClick,
}: {
  label: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 text-white rounded-full text-sm font-medium shadow-md hover:opacity-90 transition-all ${color}`}
    >
      {label}
    </button>
  );
}
