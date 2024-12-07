// models/UserCollection.ts
import mongoose, { Schema, model, models } from "mongoose";

const UserCollectionSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true, // Эквивалент автоматической генерации ID
  },
  TelegramId: { 
    type: String, // Telegram ID пользователя
    unique: true, // Уникальный идентификатор для каждого пользователя
    required: true, // Обязательное поле
  },
  cards: [  // Массив карт, принадлежащих пользователю
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
        default: Date.now, // Дата, когда пользователь приобрел карту
      },
    },
  ],
});

// Уникальность карты в коллекции пользователя
UserCollectionSchema.index({ TelegramId: 1, "cards.cardId": 1, "cards.serialNumber": 1 }, { unique: true });

// Экспорт модели
const UserCollection = models.UserCollection || model("UserCollection", UserCollectionSchema);

export default UserCollection;
