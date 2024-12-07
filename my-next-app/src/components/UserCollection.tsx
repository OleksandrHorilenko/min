import fetchUserCollection from "@/app/functions/fetchUserCollection";
import useUserStore from "@/stores/useUserStore";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {userCollection.map((card) => (
        <CardView key={card._id} card={card} />
      ))}
    </div>
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
          <p className="text-sm font-semibold text-gray-800">
            #{edition} - Serial {serialNumber}
          </p>
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
      <div>
        <p className="text-lg font-semibold text-green-500">Price: {price} TON</p>
      </div>
    </div>
  );
};

export default UserCollection;