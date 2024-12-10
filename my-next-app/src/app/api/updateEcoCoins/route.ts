import { NextRequest, NextResponse } from 'next/server';
import connect from '@/app/api/mongodb'; // Подключение к MongoDB
import User from '@/app/api/models/User'; // Модель пользователя

export async function POST(req: NextRequest) {
  await connect();

  try {
    const { TelegramId, totalProfit } = await req.json();

    if (!TelegramId || !totalProfit) {
      return NextResponse.json({ error: 'Неверные параметры запроса' }, { status: 400 });
    }

    const user = await User.findOne({ TelegramId });

    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
    }

    const now = Date.now();
    const lastUpdated = user.lastUpdated || now;
    const timeElapsed = (now - lastUpdated) / 3600 / 1000; // время в часах
    const earnedCoins = timeElapsed * totalProfit;

    user.ecobalance += earnedCoins;
    user.lastUpdated = now;

    await user.save();

    return NextResponse.json({ success: true, ecobalance: user.ecobalance });
  } catch (error) {
    console.error('Ошибка обновления монет:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}
