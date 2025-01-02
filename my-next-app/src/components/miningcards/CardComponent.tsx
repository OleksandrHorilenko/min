import { useState } from "react";
import { CardData } from "@/components/types/CardData";
import useUserStore from "@/stores/useUserStore"; 
import PurchaseModal from "@/components/PurchaseModal"; // Импортируем компонент модального окна
import { LinearProgress } from '@mui/material';

export default function CardComponent({ card }: { card: CardData }) {
  const { title, description, miningcoins, miningperiod, price, rarity, cardId } = card;
  const { user } = useUserStore();

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const bgColor = (() => {
    switch (card.rarity) {
      case "Common":
        return "bg-[#121212] border-[#8A2BE2]";
      case "Rare":
        return "bg-[#1B0036] border-[#00FFFF]";
      case "Epic":
        return "bg-[#30003B] border-[#FF00FF]";
      default:
        return "bg-[#1A1A1A] border-[#C0C0C0]";
    }
  })();

  const handleBuyCard = () => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div
      key={cardId}
      className={`relative w-[300px] h-[200px] ${bgColor} border-2 rounded-2xl shadow-lg p-3 flex flex-col justify-between mb-4`}
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)',
      }}
    >
      {/* Верхняя часть карточки */}
      <div className="flex justify-between items-center mb-1">
        <div>
          <p className="text-[10px] text-gray-400 font-bold">Card Name</p>
          <h2 className="text-sm font-bold text-white truncate">{card.title}</h2>
        </div>
        <div className="bg-white/10 p-[2px] rounded-md shadow-md">
          <p className="text-[10px] font-medium text-gray-300">{card.rarity}</p>
        </div>
      </div>

      {/* Основная информация */}
      <div>
        <p className="text-gray-300 text-xs">
          <strong className="text-xl text-yellow-400">{card.miningcoins}</strong>
          <span className="text-sm text-gray-300"> THE</span>
        </p>
        <p className="text-[10px] text-gray-400 mt-1">{card.miningperiod} days</p>
      </div>

      {/* Прогресс добычи */}
      <div className="my-1">
        <LinearProgress
          variant="determinate"
          value={((card.minedcoins + card.miningcoins) / card.miningcoins) * 100}
          color="primary"
          className="rounded-lg"
        />
      </div>

      <div className="flex justify-between items-center mt-1 space-x-2 whitespace-nowrap">
        <p className="text-[10px] text-gray-400">Remaining Coins:</p>
        <p className="text-[10px] font-bold text-gray-300">{Math.round(card.miningcoins - card.minedcoins)}  ({(((card.miningcoins - card.minedcoins) / card.miningcoins) * 100).toFixed(2)}%)</p>
      </div>

      {/* Новый блок внутри карточки */}
      <div className="flex justify-between items-center bg-[#1e1e1e] rounded-md p-1 mt-2">
        <div className="flex items-center space-x-1">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              card.isActive ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <p className="text-[10px] font-medium text-gray-300">
            {card.isActive ? "Available" : "Inactive"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-400">Profit per Hour:</p>
          <p className="text-sm font-bold text-yellow-400">
            {card.profitperhour.toFixed(2)} THE
          </p>
        </div>
      </div>

      <div className="mt-4">
        <Button label="BUY NOW" color="bg-orange-600" onClick={handleBuyCard} />
      </div>

      {isModalOpen && selectedCard && <PurchaseModal card={selectedCard} onClose={handleCloseModal} />}
    </div>
  );
}

function Button({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <button
    onClick={onClick}
    className="w-full px-4 py-2 text-white rounded-xl text-sm font-semibold shadow-md hover:bg-orange-700 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:opacity-90 transition-all"
  >
    {label}
  </button>
  );
}
