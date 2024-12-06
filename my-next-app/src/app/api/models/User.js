import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true, // Эквивалент @default(auto()) в Prisma
  },
  TelegramId: { type: String, unique: true, required: true }, // Изменили на TelegramId
  first_name: { type: String },
  last_name: { type: String },
  username: { type: String },
  language_code: { type: String },
  is_premium: { type: Boolean, default: false },
  ecobalance: { type: Number, default: 0.0 }, // Число с запятой, по умолчанию 0.0
  wallets: { type: [String], default: [] }, // Массив строковых адресов кошельков
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
