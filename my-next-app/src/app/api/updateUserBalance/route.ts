import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js';
import User from '../models/User';

export async function PUT(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();

    // Извлекаем данные из запроса
    const { TelegramId, ecobalance } = body;

    // Проверяем, что обязательные поля присутствуют
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

    // Проверяем, существует ли пользователь
    let user = await User.findOne({ TelegramId });
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Увеличиваем ecobalance пользователя
    user = await User.findOneAndUpdate(
      { TelegramId },
      { $inc: { ecobalance } }, // Увеличиваем поле ecobalance
      { new: true } // Возвращаем обновленный документ
    );

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обновлении ecobalance пользователя:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении пользователя' },
      { status: 500 }
    );
  }
}