import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js';
import User from '../models/User';

export async function PUT(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();

    // Извлекаем данные из запроса
    const { TelegramId, ecobalance, action } = body;

    // Проверяем обязательные поля
    if (!TelegramId) {
      return NextResponse.json(
        { error: 'TelegramId является обязательным полем' },
        { status: 400 }
      );
    }

    if (ecobalance === undefined || typeof ecobalance !== 'number') {
      return NextResponse.json(
        { error: 'ecobalance должен быть числом' },
        { status: 400 }
      );
    }

    if (!['increment', 'decrement', 'set'].includes(action)) {
      return NextResponse.json(
        { error: 'action должен быть одним из: increment, decrement, set' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли пользователь
    const user = await User.findOne({ TelegramId });
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    let updatedUser;
    if (action === 'increment') {
      // Увеличение баланса
      updatedUser = await User.findOneAndUpdate(
        { TelegramId },
        { $inc: { ecobalance } },
        { new: true }
      );
    } else if (action === 'decrement') {
      // Уменьшение баланса
      updatedUser = await User.findOneAndUpdate(
        { TelegramId },
        { $inc: { ecobalance: -ecobalance } },
        { new: true }
      );
    } else if (action === 'set') {
      // Установка нового значения баланса
      updatedUser = await User.findOneAndUpdate(
        { TelegramId },
        { $set: { ecobalance } },
        { new: true }
      );
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обновлении ecobalance пользователя:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении пользователя' },
      { status: 500 }
    );
  }
}
