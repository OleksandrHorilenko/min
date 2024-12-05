import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
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


