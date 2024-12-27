import { NextRequest, NextResponse } from 'next/server';
import connect from '@/app/api/mongodb';
import Transaction from '@/app/api/models/UserTransactions'; // Модель транзакции

export async function POST(req: NextRequest) {
    await connect();

    try {
        const { TelegramId, wallet, amount, type } = await req.json();

        if (!TelegramId || !wallet || !amount) {
            return NextResponse.json({ error: 'Missing required fields: user, wallet, or amount' }, { status: 400 });
        }

        const newTransaction = new Transaction({
            TelegramId,
            wallet,
            amount,
            type: 'deposit',
            createdAt: new Date(),
        });

        await newTransaction.save();

        return NextResponse.json({ message: 'Transaction added successfully', transaction: newTransaction }, { status: 201 });
    } catch (error) {
        console.error('Error adding transaction:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    await connect();
  
    try {
      // Получаем TelegramId из query параметра
      const TelegramId = req.nextUrl.searchParams.get('TelegramId');
  
      if (!TelegramId) {
        return NextResponse.json({ error: 'TelegramId is required' }, { status: 400 });
      }
  
      // Получаем транзакции для конкретного пользователя и сортируем по дате
      const transactions = await Transaction.find({ TelegramId })
        .sort({ createdAt: -1 })
        .limit(10); // Ограничиваем количество транзакций (например, 10)
  
      return NextResponse.json({ transactions }, { status: 200 });
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  