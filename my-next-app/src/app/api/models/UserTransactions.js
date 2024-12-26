import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    TelegramId: { type: String, required: true },
    wallet: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['deposit', 'withdrawal'] }, // Указание типа транзакции
    createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

export default Transaction;