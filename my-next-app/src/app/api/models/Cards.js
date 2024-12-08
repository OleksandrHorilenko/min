// models/Card.ts
import mongoose, { Schema, model, models } from "mongoose";

// Определяем схему для карт
const CardSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  cardId: { type: Number, required: true, unique: true },
  rarity: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  miningcoins: { type: Number, required: true },
  miningperiod: { type: Number, required: true },
  miningcycle: { type: Number, required: true },
  price: { type: Number, required: true },
  edition: { type: Number, required: true }, // Общее количество тиража
  sold: { type: Number, default: 0 }, // Количество проданных карт
  available: { type: Boolean, default: true }, // Признак доступности для продажи
  soldCopies: [
    {
      serialNumber: { type: Number, required: true },
      soldAt: { type: Date, default: Date.now }, // Время продажи
    },
  ], // Хранение информации о проданных копиях
});

// Экспортируем модель
const Card = models.Card || model("Card", CardSchema);

export default Card;
