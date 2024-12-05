import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  TelegramId: { type: String, unique: true, required: true }, // Изменили на TelegramId
  first_name: { type: String },
  last_name: { type: String },
  username: { type: String },
  language_code: { type: String },
  is_premium: { type: Boolean, default: false },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
