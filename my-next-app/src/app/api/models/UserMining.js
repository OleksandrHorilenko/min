import mongoose from 'mongoose';

const userMiningSchema = new mongoose.Schema(
  {
    TelegramId: { 
      type: String, 
      unique: true, 
      required: true 
    },
    minedCoins: { 
      type: Number, 
      default: 0 // Начальное значение для намайненных монет
    },
    bonusCoins: { 
      type: Number, 
      default: 0 // Начальное значение для бонусных монет
    },
    burnedCoins: { 
      type: Number, 
      default: 0 // Начальное значение для сожженных монет
    },
    lastClaim: { 
      type: Date, 
      default: null // Начальное значение для времени последнего Claim
    }
  },
  {
    timestamps: true // Автоматически добавляет createdAt и updatedAt
  }
);

const UserMining = mongoose.models.UserMining || mongoose.model('UserMining', userMiningSchema);
export default UserMining;

