import { CardData } from "@/components/types/CardData";
import useUserStore from "@/stores/useUserStore"; // Для доступа к информации о пользователе
import fetchUserCollection from "@/app/functions/fetchUserCollection"; // Функция для обновления коллекции
import { updateUserBalance } from '@/app/functions/updateUserBalance';
import { useState } from 'react';
import LinearProgress from '@mui/material/LinearProgress'; // Для прогресс-бара
import { TonConnectButton, useTonConnectUI, SendTransactionRequest, useTonWallet, useTonAddress } from "@tonconnect/ui-react";

interface TransactionData {
  TelegramId: string; // TelegramId пользователя
  wallet: any | null;
  amount: number;  // Сумма транзакции
  type: string; // Тип транзакции, например, "deposit"
  //timestamp: string; // Время транзакции в формате ISO
}

interface ModalProps {
  card: CardData;
  onClose: () => void;
}

const PurchaseModal = ({ card, onClose }: ModalProps) => {
  const { user, updateUser } = useUserStore(); // Получаем информацию о пользователе
  const userFriendlyAddress = useTonAddress(); // Адрес текущего пользователя
  const [tonConnectUI] = useTonConnectUI();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // Запись транзакции в базу данных
  const logTransactionInDB = async (transactionData: TransactionData) => {
    try {
      const response = await fetch("/api/userTransactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          TelegramId: transactionData.TelegramId,
          wallet: transactionData.wallet, // Передаем wallet в нужном типе
          amount: transactionData.amount,
          //type: "deposit",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to log transaction.");
      }
    } catch (err) {
      console.error("Error logging transaction:", err);
    }
  };

  // Обработчик для кнопки Buy ECO
  const handleBuyECO = async () => {
    if (user.ecobalance < card.price) {
      alert("Недостаточно средств для покупки!");
      return;
    }

    // Отключаем кнопку до завершения обработки
  setIsProcessing(true);

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

      // Обновляем коллекцию пользователя и состояние хранилища
      fetchUserCollection(user.TelegramId); // Обновляем коллекцию пользователя
      updateUser({ ecobalance: newBalance }); // Обновляем состояние хранилища

      alert("Карта успешно куплена!");
      onClose(); // Закрываем модальное окно
    } catch (error) {
      console.error("Ошибка при обработке покупки:", error);
    }
    finally {
      // Включаем кнопку обратно после завершения
      setIsProcessing(false);
    }
  };


  const handleBuyTon = async () => {
    try {
      setIsProcessing(true);
  
      // Перевод цены карты из токенов в TON
      const tonAmountToSend = card.price / 1000; // 1000 токенов = 1 TON
  
      const transaction: SendTransactionRequest = {
        validUntil: Date.now() + 5 * 60 * 1000, // Время истечения транзакции
        messages: [
          {
            address: "UQAK-eku1yCNkL5wt7g9OlBpHSnjadN10h_A19uM3SGVJIu2", // Адрес кошелька продавца
            amount: (tonAmountToSend * 1e9).toFixed(0).toString(), // Перевод в нанотоны
          },
        ],
      };
  
      const result = await tonConnectUI.sendTransaction(transaction);
  
      if (result) {
        // Успешная транзакция - добавляем карту пользователю
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
          priceInTon: tonAmountToSend, // Цена в TON
          edition: card.edition,
          cardlastclaim: new Date().toISOString(),
        };
  
        const requestData = {
          TelegramId: user.TelegramId,
          newCard: newCard,
        };
  
        const response = await fetch("/api/addCardToUserCollection", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Ошибка при добавлении карты в коллекцию:", errorData.error);
          alert("Ошибка при добавлении карты. Попробуйте снова.");
          return;
        }
  
        // Логируем транзакцию
        const transactionData: TransactionData = {
          TelegramId: user.TelegramId,
          wallet: userFriendlyAddress,
          amount: tonAmountToSend,
          type: "purchase", // Тип транзакции (покупка)
        };
        await logTransactionInDB(transactionData);
  
        alert("Карта успешно куплена за TON!");
        fetchUserCollection(user.TelegramId); // Обновляем коллекцию пользователя
      } else {
        alert("Транзакция была отменена.");
      }
    } catch (error) {
      console.error("Ошибка при обработке покупки за TON:", error);
      alert("Ошибка при обработке покупки. Попробуйте снова.");
    } finally {
      setIsProcessing(false);
    }
  };



  const handleBuyStars = () => {
    // Показываем всплывающее окно
    setShowPopup(true);

    // Через 2 секунды скрываем уведомление
    setTimeout(() => {
      setShowPopup(false);
    }, 2000);
  };
  


  // Определяем цвет в зависимости от редкости карты
  const bgColor = (() => {
    switch (card.rarity) {
      case "Common":
        return "bg-[#121212] border-[#8A2BE2]"; // Темный фон с фиолетовым обрамлением
      case "Rare":
        return "bg-[#1B0036] border-[#00FFFF]"; // Темно-фиолетовый фон с неоновым голубым
      case "Epic":
        return "bg-[#30003B] border-[#FF00FF]"; // Глубокий пурпурный фон с ярким розовым
      default:
        return "bg-[#1A1A1A] border-[#C0C0C0]"; // Серый фон с светлым металлическим контуром
    }
  })();

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-black flex justify-center items-start p-4">
      <div className="relative bg-black w-full max-w-md rounded-t-2xl p-6 shadow-2xl text-white border-t-2 border-gray-200 max-h-[80vh]">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl text-gray-400">X</button>

        {/* Визуальное представление карты */}
        <div className={`relative w-[90%] sm:w-[320px] h-[200px] ${bgColor} border-2 rounded-2xl shadow-lg p-6 mb-6 mx-auto`}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-300 font-bold">Card Name</p>
              <h2 className="text-xl font-bold text-white">{card.title}</h2>
            </div>
            <div className="bg-white/10 p-2 rounded-lg shadow-md">
              <p className="text-xs font-semibold text-gray-300">{card.rarity}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-300">
              <strong className="text-4xl text-yellow-400">{card.miningcoins}</strong>
              <span className="text-xl text-gray-300"> ECO</span>
            </p>
            <p className="text-sm text-gray-300 mt-1">{card.miningperiod} days</p>
          </div>

          <div className="my-2">
            <LinearProgress
              variant="determinate"
              value={((card.minedcoins) / card.miningcoins) * 100}
              color="primary"
              className="rounded-lg"
            />
          </div>

          <div className="flex justify-end items-center mt-1 space-x-2">
            <p className="text-xs text-gray-400">Remaining Coins</p>
            <p className="text-xs font-bold text-gray-300">{((card.remainingcoins / card.miningcoins) * 100).toFixed(2)}%</p>
          </div>
        </div>

        {/* Дополнительная информация о карте */}
        

        <div className="flex justify-between space-x-4 mt-4">
          <button onClick={handleBuyECO} disabled={isProcessing} className="w-1/3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg py-2">
          {isProcessing ? 'Processing...' : 'Buy card $THE'}
          </button>
          <button onClick={handleBuyTon} disabled={isProcessing} className="w-1/3 bg-gradient-to-r from-green-400 to-blue-600 text-white rounded-lg py-2">
            Buy TON
          </button>
         
      <button
        onClick={handleBuyStars}
        className="w-1/3 bg-gradient-to-r from-blue-400 to-yellow-600 text-white rounded-lg py-2"
      >
        Buy STARS
      </button>

      {/* Всплывающее окно */}
      {showPopup && (
        <div className="fixed bottom-4 left-1/2 w-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md border-4 border-white-300 font-bold text-center">
        Soon
      </div>
      )}
    
        </div>
      </div>
    </div>
  );
};

export default PurchaseModal;









