import mongoose from 'mongoose';

const referalSchema = new mongoose.Schema({
  TelegramId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  referralCode: { 
    type: String, 
    required: true, 
    unique: true 
  },
  referrals: [{ 
    type: String, 
  }],
});

const Referal = mongoose.models.Referal || mongoose.model('Referal', referalSchema);

export default Referal;
