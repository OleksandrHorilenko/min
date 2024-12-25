import { NextRequest, NextResponse } from 'next/server';
import connect from '@/app/api/mongodb';
import Transaction from '@/app/api/models/UserTransactions'; // Модель транзакции

export async function POST(req: NextRequest) {
    await connect();

    try {
        const { TelegramId, wallet, amount } = await req.json();

        if (!TelegramId || !wallet || !amount) {
            return NextResponse.json({ error: 'Missing required fields: user, wallet, or amount' }, { status: 400 });
        }

        const newTransaction = new Transaction({
            TelegramId,
            wallet,
            amount,
            createdAt: new Date(),
        });

        await newTransaction.save();

        return NextResponse.json({ message: 'Transaction added successfully', transaction: newTransaction }, { status: 201 });
    } catch (error) {
        console.error('Error adding transaction:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    await connect();

    try {
        const transactions = await Transaction.find().sort({ createdAt: -1 });

        return NextResponse.json(transactions, { status: 200 });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
