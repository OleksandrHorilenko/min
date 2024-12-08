import { CardData } from "@/components/types/CardData";
import useUserStore from "@/stores/useUserStore"; // Для доступа к информации о пользователе
import fetchUserCollection from "@/app/functions/fetchUserCollection"; // Функция для обновления коллекции
import { updateUserBalance } from '@/app/functions/updateUserBalance';

interface ModalProps {
  card: CardData;
  onClose: () => void;
}

const PurchaseModal = ({ card, onClose }: ModalProps) => {
  const { user, updateUser } = useUserStore(); // Получаем информацию о пользователе

  // Обработчик для кнопки Buy ECO
  const handleBuyECO = async () => {
    if (user.ecobalance < card.price) {
      alert("Недостаточно средств для покупки!");
      return;
    }
  
    try {
      const newBalance = user.ecobalance - Number(card.price);
  
      // Отправляем запрос для обновления баланса пользователя
      const result = await updateUserBalance(user.TelegramId, Number(card.price), "decrement");
      if (!result) {
        alert("Ошибка при обновлении баланса пользователя.");
        return;
      }
  
      // Создаем данные для обновления коллекции пользователя
      const userCollectionUpdate = {
        TelegramId: user.TelegramId,
        cardId: card.cardId,
        rarity: card.rarity,
        title: card.title,
        description: card.description,
        miningcoins: card.miningcoins,
        miningperiod: card.miningperiod,
        price: card.price,
        edition: card.edition,
        acquiredAt: new Date().toISOString(),
      };
  
      const soldCardUpdate = {
        owner: user.TelegramId,
        cardId: card.cardId,
        price: card.price,
        soldAt: new Date().toISOString(),
      };
  
      // Обновляем коллекцию пользователя
      const response = await fetch("/api/updateUserCollectionInDB", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCollectionUpdate),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка при добавлении карты в коллекцию:", errorData.error);
        return;
      }
  
      // Отправляем запрос для добавления карты в коллекцию проданных карт
      const soldCardResponse = await fetch("/api/soldCards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(soldCardUpdate),
      });
  
      if (!soldCardResponse.ok) {
        const errorData = await soldCardResponse.json();
        console.error("Ошибка при добавлении карты в коллекцию проданных карт:", errorData.error);
        return;
      }
  
      // Обновляем коллекцию пользователя и состояние хранилища
      fetchUserCollection(user.TelegramId); // Обновляем коллекцию пользователя
      updateUser({ ecobalance: newBalance }); // Обновляем состояние хранилища
  
      alert("Карта успешно куплена!");
      onClose(); // Закрываем модальное окно
    } catch (error) {
      console.error("Ошибка при обработке покупки:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-end p-4">
      <div className="bg-black w-full max-w-full rounded-t-2xl p-6 shadow-lg border-2 border-gray-300 transform transition-all duration-300 translate-y-0 text-white flex relative">
        {/* Кнопка закрытия в правом верхнем углу */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-lg font-semibold text-gray-400 hover:text-white"
        >
          X
        </button>

        {/* Содержимое карты (градиентный фон на всю ширину) */}
        <div className="flex flex-grow bg-gradient-to-r from-gray-700 to-gray-900 p-6 rounded-lg shadow-lg space-x-6">
          {/* Данные карты */}
          <div className="flex flex-col w-2/3 space-y-4">
            <h2 className="text-xl font-bold">{card.title}</h2>
            <div>
              <p className="text-sm font-semibold">Price:</p>
              <p className="text-lg font-bold">{card.price} ECO</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Mining Coins:</p>
              <p className="text-lg font-bold">{card.miningcoins} ECO</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Mining Period:</p>
              <p className="text-lg font-bold">{card.miningperiod} days</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Description:</p>
              <p className="text-md">{card.description}</p>
            </div>
          </div>

          {/* Кнопки справа с одинаковой шириной */}
          <div className="flex flex-col justify-between items-center w-1/3 space-y-3">
            <button
              onClick={handleBuyECO}
              className="px-6 py-3 w-full bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all"
            >
              Buy ECO
            </button>
            <button className="px-6 py-3 w-full bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all">
              Buy TON
            </button>
            <button className="px-6 py-3 w-full bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600 transition-all">
              Buy STARS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;









