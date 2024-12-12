import { useState } from "react";
import { CardData } from "@/components/types/CardData";
import useUserStore from "@/stores/useUserStore"; 
import PurchaseModal from "@/components/PurchaseModal"; // Импортируем компонент модального окна

export default function CardComponent({ card }: { card: CardData }) {
  const { title, description, miningcoins, miningperiod, price, rarity, cardId } = card;
  const { user } = useUserStore();

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);

  const bgColor = (() => {
    switch (rarity) {
      case "Common":
        return "bg-gray-800 border-gray-600";
      case "Rare":
        return "bg-blue-900 border-blue-500";
      case "Epic":
        return "bg-yellow-900 border-yellow-500";
      default:
        return "bg-gray-700 border-gray-500";
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
      className={`relative w-[320px] h-[200px] ${bgColor} border-2 rounded-2xl shadow-lg p-6 flex flex-col justify-between mb-6`}
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)',
      }}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-300 font-bold"></p>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
        <div className="bg-white/10 p-2 rounded-lg shadow-md">
          <p className="text-xs font-semibold text-gray-300">{rarity}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-gray-300">
          <strong className="text-4xl text-yellow-400">{miningcoins}</strong>
          <span className="text-xl text-gray-300"> ECO</span>
        </p>
        <p className="text-sm text-gray-300 mt-1">{miningperiod} days</p>
      </div>

      <div className="flex flex-col items-start space-y-2 mt-4">
        <p className="text-sm font-medium text-gray-300">
          Price: <span className="text-lg text-orange-500">{price} ECO</span>
        </p>
        <div className="w-full mt-4">
          <Button label="BUY NOW" color="bg-orange-600" onClick={handleBuyCard} />
        </div>
      </div>

      {isModalOpen && selectedCard && <PurchaseModal card={selectedCard} onClose={handleCloseModal} />}
    </div>
  );
}

function Button({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-5 py-2 text-white rounded-lg text-lg font-semibold shadow-md hover:opacity-90 transition-all ${color}`}
    >
      {label}
    </button>
  );
}
