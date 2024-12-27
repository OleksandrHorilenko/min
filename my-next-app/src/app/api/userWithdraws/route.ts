import { NextRequest, NextResponse } from 'next/server';
import connect from '@/app/api/mongodb'; // Подключение к базе данных
import Transaction from '@/app/api/models/UserTransactions'; // Модель транзакции
//import { sendTelegramNotification } from '@/app/api/utils/telegram'; // Утилита для отправки уведомлений в Telegram

// Обработчик POST-запроса для создания заявки на вывод
export async function POST(req: NextRequest) {
  await connect(); // Подключаемся к базе данных

  try {
    // Получаем данные из запроса
    const { TelegramId, wallet, amount } = await req.json();

    // Проверка наличия всех обязательных полей
    if (!TelegramId || !wallet || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: TelegramId, wallet, or amount' },
        { status: 400 }
      );
    }

    // Проверка корректности суммы для вывода
    if (amount < 5000 || amount > 100000) {
      return NextResponse.json(
        { error: 'Amount must be between 5000 and 100000' },
        { status: 400 }
      );
    }

    // Создаем запись о заявке на вывод в базе данных
    const newTransaction = new Transaction({
      TelegramId,
      wallet,
      amount,
      type: 'withdrawal', // Указываем тип транзакции (вывод)
      createdAt: new Date(),
    });

    // Сохраняем заявку в базе данных
    await newTransaction.save();

    // Отправляем уведомление в Telegram
    //await sendTelegramNotification(TelegramId, amount);

    // Возвращаем успешный ответ
    return NextResponse.json(
      { message: 'Withdrawal request submitted successfully', transaction: newTransaction },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding withdrawal request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Обработчик GET-запроса для получения всех заявок на вывод
export async function GET() {
  await connect(); // Подключаемся к базе данных

  try {
    // Получаем все транзакции, отсортированные по дате
    const transactions = await Transaction.find({ type: 'withdrawal' }).sort({ createdAt: -1 });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error('Error fetching withdrawal requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
