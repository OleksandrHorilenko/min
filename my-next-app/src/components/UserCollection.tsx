import fetchUserCollection from "@/app/functions/fetchUserCollection";
import useUserStore from "@/stores/useUserStore";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useEffect } from "react";

const UserCollection = () => {
  const userCollection = useUserStore((state) => state.userCollection);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user.TelegramId) {
      fetchUserCollection(user.TelegramId); // Вызываем только если TelegramId не null
    } else {
      console.warn("TelegramId is null. Collection fetch skipped.");
    }
  }, [user.TelegramId]);

  return (
    <div className="flex flex-wrap justify-center gap-6 py-8">
      {userCollection.map((card) => (
        <CardView key={card._id} card={card} />
      ))}
    </div>
  );
};

const TimerComponent = ({ duration }: { duration: number }) => {
  return (
    <CountdownCircleTimer
      isPlaying
      duration={duration}
      colors={["#00FF00", "#FFAA00", "#FF0000"]}
      colorsTime={[duration, duration / 2, 0]}
      trailColor="#d3d3d3"
      size={50}
      strokeWidth={6}
    >
      {({ remainingTime }) => (
        <div className="text-xs font-bold text-gray-800">{remainingTime}s</div>
      )}
    </CountdownCircleTimer>
  );
};

const CardView = ({ card }: { card: any }) => {
  const {
    rarity = "Unknown",
    title = "Unknown Title",
    description = "No description available",
    miningcoins = 0,
    miningperiod = 0,
    miningcycle = 0,
    price = 0,
    edition = 0,
    serialNumber,
  } = card;

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

  // Обработчик начала майнинга
  const handleStartMining = () => {
    console.log("Start mining for card:", card);
    // Логика для начала майнинга
  };

  // Обработчик получения награды
  const handleClaimRewards = () => {
    console.log("Claim rewards for card:", card);
    // Логика для получения наград
  };

  return (
    <div
      className={`relative w-[300px] h-[200px] ${bgColor} rounded-2xl shadow-lg p-4 flex flex-col justify-between`}
    >
      {/* Таймер */}
      <div className="absolute top-2 right-2">
        <TimerComponent duration={miningcycle * 3600} />
      </div>

      {/* Верхняя часть */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600 font-medium">{rarity} Mining Card</p>
          <h2 className="text-md font-bold text-gray-800">{title}</h2>
        </div>
        <div className="bg-gray-200 p-2 rounded-md shadow-md">
          <span className="text-xs font-bold text-gray-600">Edition</span>
          <p className="text-xs font-semibold text-gray-800">
            #{edition} - Serial {serialNumber}
          </p>
        </div>
      </div>

      {/* Центральная часть */}
      <div className="text-center space-y-1">
        <p className="text-gray-700 text-sm">
          <strong className="text-green-600">{miningcoins} ECO</strong> over{" "}
          <span className="font-medium">{miningperiod} days</span>
        </p>
        <p className="text-gray-600 text-xs">Cycle: {miningcycle} hours</p>
      </div>

      {/* Нижняя часть с кнопками */}
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={handleStartMining}
          className="px-3 py-1 text-white text-xs font-medium bg-green-500 rounded-md shadow-sm hover:bg-green-600"
        >
          Start Mining
        </button>
        <button
          onClick={handleClaimRewards}
          className="px-3 py-1 text-white text-xs font-medium bg-blue-500 rounded-md shadow-sm hover:bg-blue-600"
        >
          Claim
        </button>
      </div>
    </div>
  );
};

export default UserCollection;
