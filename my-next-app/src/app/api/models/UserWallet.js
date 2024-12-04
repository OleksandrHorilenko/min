import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,  // Используем число для userId
      unique: true,
      required: true,
    },
    walletAddress: {
      type: String,
      required: true,
    },
  }
);

const UserWallet = mongoose.models.UserWallet || mongoose.model('UserWallet', walletSchema);

export default UserWallet;


