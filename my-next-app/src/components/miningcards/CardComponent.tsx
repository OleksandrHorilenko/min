import { CardData } from '@/components/types/CardData';




export default function CardComponent({ card }: { card: CardData }) {
  const { title, description, miningcoins, miningperiod, miningcycle, price, rarity } = card;

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
          <Button label="Buy ECO" color="bg-green-500" />
          <Button label="Buy TON" color="bg-blue-500" />
          <Button label="Buy STARS" color="bg-yellow-500" />
        </div>
      </div>
    </div>
  );
}

function Button({ label, color }: { label: string; color: string }) {
  return (
    <button
      className={`px-4 py-1 text-white rounded-full text-sm font-medium shadow-md hover:opacity-90 transition-all ${color}`}
    >
      {label}
    </button>
  );
}