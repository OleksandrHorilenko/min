import { CardData } from "@/components/types/CardData";
import useUserStore from "@/stores/useUserStore"; // Подключаем хранилище пользователя
import fetchUserCollection from "@/app/functions/fetchUserCollection"; // Функция для обновления коллекции

export default function CardComponent({ card }: { card: CardData }) {
  const { title, description, miningcoins, miningperiod, price, rarity, cardId } = card;
  const { user } = useUserStore();

  // Устанавливаем цвет фона в зависимости от редкости
  const bgColor = (() => {
    switch (rarity) {
      case "Common":
        return "bg-gray-100";
      case "Rare":
        return "bg-blue-300";
      case "Epic":
        return "bg-yellow-300";
      default:
        return "bg-gray-200"; // Цвет по умолчанию
    }
  })();

  // Обработчик покупки карты
  const handleBuyCard = async (currency: string) => {
    const TelegramId = user.TelegramId;
    const acquiredAt = new Date().toISOString();
    const serialNumber = card.cardId;

    try {
      const response = await fetch("/api/updateUserCollectionInDB", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          TelegramId,
          cardId: card.cardId,
          serialNumber,
          acquiredAt,
          rarity: card.rarity,
          title: card.title,
          description: card.description,
          miningcoins: card.miningcoins,
          miningperiod: card.miningperiod,
          price: card.price,
          edition: card.edition,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Карта куплена за ${currency}:`, data);

        // Добавляем паузу перед обновлением коллекции
        setTimeout(() => {
          fetchUserCollection(TelegramId);
        }, 2000); // Пауза 2 секунды
      } else {
        const errorData = await response.json();
        console.error("Ошибка при покупке карты:", errorData.error);
      }
    } catch (error) {
      console.error("Сетевая ошибка при покупке карты:", error);
    }
  };

  return (
    <div
      className={`relative w-[320px] h-[200px] ${bgColor} rounded-2xl shadow-lg p-4 flex flex-col justify-between`}
    >
      {/* Верхняя часть */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600 font-medium">{rarity} Mining Card</p>
          <h2 className="text-md font-bold text-gray-800">{title}</h2>
        </div>
        <div className="bg-gray-100 p-2 rounded-lg shadow-md">
          <span className="text-xs font-bold text-gray-700">Edition</span>
          <p className="text-xs font-semibold text-gray-800">#{card.edition}</p>
        </div>
      </div>

      {/* Центральная часть */}
      <div className="text-center space-y-2">
        <p className="text-gray-700">
          <strong className="text-lg text-green-600">{miningcoins} ECO</strong> over{" "}
          <span className="font-medium">{miningperiod} days</span>
        </p>
      </div>

      {/* Нижняя часть */}
      <div className="flex flex-col items-center space-y-2">
        <p className="text-sm font-medium text-gray-800">
          Price: <span className="text-lg text-green-600">{price} ECO</span>
        </p>
        <div className="flex space-x-1">
          <Button label="ECO" color="bg-green-500" onClick={() => handleBuyCard("ECO")} />
          <Button label="TON" color="bg-blue-500" onClick={() => handleBuyCard("TON")} />
          <Button label="STARS" color="bg-yellow-500" onClick={() => handleBuyCard("STARS")} />
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
      className={`px-3 py-1 text-white rounded-full text-xs font-medium shadow-md hover:opacity-90 transition-all ${color}`}
    >
      {label}
    </button>
  );
}

