import mongoose, { Schema, model, models } from "mongoose";

const SoldCardSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true, // Эквивалент автоматической генерации ID
  },
  cardId: { 
    type: Number, // ID карты из тиража (числовой)
    required: true 
  },
  serialNumber: { 
    type: Number, 
    required: true 
  }, // Номер карты в рамках тиража
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", // Ссылка на владельца карты
    required: true 
  }, 
  soldAt: { 
    type: Date, 
    default: Date.now 
  }, // Дата продажи
});

// Устанавливаем уникальность для сочетания `cardId` и `serialNumber`
SoldCardSchema.index({ cardId: 1, serialNumber: 1 }, { unique: true });

// Экспортируем модель
const SoldCard = models.SoldCard || model("SoldCard", SoldCardSchema);

export default SoldCard;