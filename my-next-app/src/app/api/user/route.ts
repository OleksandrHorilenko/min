import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js';
import User from '../models/User';

export async function POST(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();

    // Извлекаем данные из запроса
    const { TelegramId, first_name, last_name, username, language_code, is_premium } = body;

    // Проверяем, что обязательное поле TelegramId присутствует
    if (!TelegramId) {
      return NextResponse.json(
        { error: 'TelegramId является обязательным полем' },
        { status: 400 } // HTTP 400 - Bad Request
      );
    }

    // Проверяем, существует ли пользователь
    let user = await User.findOne({ TelegramId });
    if (user) {
      return NextResponse.json(user, { status: 200 }); // Пользователь найден
    }

    // Создаем нового пользователя
    user = new User({
      TelegramId,
      first_name,
      last_name,
      username,
      language_code,
      is_premium,
      ecobalance: 0.0, // Устанавливаем значение по умолчанию
      wallets: [], // Пустой массив по умолчанию
    });
    await user.save();

    return NextResponse.json(user, { status: 201 }); // HTTP 201 - Created
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании пользователя' },
      { status: 500 } // HTTP 500 - Internal Server Error
    );
  }
}
