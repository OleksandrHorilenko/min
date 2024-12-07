import mongoose, { Schema, model, models } from "mongoose";

const UserCollectionSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true, // Автоматическая генерация ID
  },
  TelegramId: {
    type: String, // Telegram ID пользователя
    unique: true, // Уникальный идентификатор для каждого пользователя
    required: true, // Обязательное поле
  },
  cards: [
    {
      cardId: {
        type: Number, // ID карты
        required: true,
      },
      serialNumber: {
        type: Number, // Уникальный номер карты в рамках тиража
        required: true,
      },
      isActive: {
        type: Boolean,
        default: false, // Карта неактивна по умолчанию
      },
      acquiredAt: {
        type: Date,
        default: Date.now, // Дата приобретения карты
      },
      rarity: {
        type: String, // Редкость карты
        required: true,
      },
      title: {
        type: String, // Название карты
        required: true,
      },
      description: {
        type: String, // Описание карты
        required: true,
      },
      miningcoins: {
        type: Number, // Количество добываемых монет
        required: true,
      },
      miningperiod: {
        type: Number, // Период добычи
        required: true,
      },
      miningcycle: {
        type: Number, // Цикл добычи
        required: true,
      },
      price: {
        type: Number, // Цена карты
        required: true,
      },
      edition: {
        type: Number, // Тираж карты
        required: true,
      },
    },
  ],
});

// Уникальность карты в коллекции пользователя
UserCollectionSchema.index(
  { TelegramId: 1, "cards.cardId": 1, "cards.serialNumber": 1 },
  { unique: true }
);

// Экспорт модели
const UserCollection =
  models.UserCollection || model("UserCollection", UserCollectionSchema);

export default UserCollection;