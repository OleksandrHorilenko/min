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
  
      // Проверяем, сколько карт в коллекции пользователя
      const userCollectionResponse = await fetch(`/api/getUserCollection?TelegramId=${user.TelegramId}`);

      if (!userCollectionResponse.ok) {
        const errorData = await userCollectionResponse.json();
        console.error("Ошибка при получении коллекции пользователя:", errorData.error);
        return;
      }
  
      const userCollection = await userCollectionResponse.json();
      
      
  
      // Создаем данные для добавления новой карты в коллекцию
const newCard = {
  cardId: card.cardId,
  serialNumber: card.serialNumber,
  isActive: card.isActive,
  acquiredAt: new Date().toISOString(),
  rarity: card.rarity,
  title: card.title,
  description: card.description,
  miningcoins: card.miningcoins,
  miningperiod: card.miningperiod,
  miningcycle: card.miningcycle,
  profitperhour: card.profitperhour,
  minedcoins: card.minedcoins,
  remainingcoins: card.remainingcoins,
  price: card.price,
  edition: card.edition,
  cardlastclaim: new Date().toISOString(),
};

// Создаем данные для запроса, включая TelegramId и новую карту
const requestData = {
  TelegramId: user.TelegramId,
  newCard: newCard, // Новая карта, которую нужно добавить
};

// Отправляем запрос на добавление карты в коллекцию пользователя
const response = await fetch("/api/addCardToUserCollection", {
  method: "POST",
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(requestData),
});

if (!response.ok) {
  const errorData = await response.json();
  console.error("Ошибка при добавлении карты в коллекцию:", errorData.error);
  return;
}

// Если все прошло успешно, можно выполнить дальнейшие действия
console.log('Новая карта добавлена в коллекцию!');
  
    // Отправляем запрос для добавления карты в коллекцию проданных карт
     // const soldCardResponse = await fetch("/api/soldCards", {
     //   method: "POST",
     //   headers: { "Content-Type": "application/json" },
     //   body: JSON.stringify(soldCardUpdate),
    //  });
  
    //  if (!soldCardResponse.ok) {
    //    const errorData = await soldCardResponse.json();
    //    console.error("Ошибка при добавлении карты в коллекцию проданных карт:", errorData.error);
   //     return;
   //   }
  //
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
    <div
    className="fixed inset-x-0 bottom-0 z-50 bg-black flex justify-center   items-start p-4"
    
  >
    <div className="relative bg-black w-full max-w-md rounded-t-2xl p-6 shadow-2xl text-white border-t-2 border-gray-200 max-h-[80vh]">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-xl text-gray-400"
      >
        X
      </button>
      <h2 className="text-xl font-bold mb-4">{card.title}</h2>
      <p className="text-sm font-semibold">Price:</p>
      <p className="text-lg font-bold mb-4">{card.price} ECO</p>
      <p className="text-sm font-semibold">Mining Coins:</p>
      <p className="text-lg font-bold mb-4">{card.miningcoins} ECO</p>
      <p className="text-sm font-semibold">Mining Period:</p>
      <p className="text-lg font-bold mb-4">{card.miningperiod} days</p>
      <p className="text-sm font-semibold">Description:</p>
      <p className="text-md mb-6">{card.description}</p>
      <div className="flex justify-between space-x-4">
        <button
          onClick={() => handleBuyECO ()}
          className="w-1/3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg py-2"
        >
          Buy ECO
        </button>
        <button
          onClick={() => console.log("Buy TON")}
          className="w-1/3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg py-2"
        >
          Buy TON
        </button>
        <button
          onClick={() => console.log("Buy STARS")}
          className="w-1/3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg py-2"
        >
          Buy STARS
        </button>
      </div>
    </div>
  </div>
  

  

  );
};

export default PurchaseModal;









