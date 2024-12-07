// models/Card.ts
import mongoose, { Schema, model, models } from "mongoose";

// Определяем схему для карт
const CardSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Эквивалент @default(auto()) в Prisma
      },
  cardId: { type: Number, required: true, unique: true },
  rarity: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  miningcoins: { type: Number, required: true },
  miningperiod: { type: Number, required: true },
  miningcycle: { type: Number, required: true },
  price: { type: Number, required: true },
  edition: { type: Number, required: true },
});

// Экспортируем модель
const Card = models.Card || model("Card", CardSchema);

export default Card;