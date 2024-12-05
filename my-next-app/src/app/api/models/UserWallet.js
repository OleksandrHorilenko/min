import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true, // Эквивалент @default(auto()) в Prisma
  },
  TelegramId: {
    type: String, // Тип остаётся строкой
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
});

const UserWallet = mongoose.models.UserWallet || mongoose.model('UserWallet', walletSchema);

export default UserWallet;


