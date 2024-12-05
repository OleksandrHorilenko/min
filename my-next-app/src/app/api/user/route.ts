import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js';
import User from '../models/User'; // Модель User с полем telegramId

export async function POST(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();

    // Проверяем, есть ли telegramId в запросе
    if (!body.TelegramId) {
      return NextResponse.json(
        { error: 'Поле telegramId отсутствует в запросе' },
        { status: 400 } // HTTP 400 - Bad Request
      );
    }

    const telegramId = String(body.telegramId); // Преобразуем в строку для безопасности

    // Проверяем, существует ли пользователь с таким telegramId
    let user = await User.findOne({ telegramId });
    if (user) {
      // Если пользователь существует, возвращаем его данные
      return NextResponse.json(user, { status: 200 }); // HTTP 200 - OK
    }

    // Извлечение только нужных полей из body
    const { TelegramId, firstName, lastName, username, languageCode, isPremium } = body;

    // Если пользователь не существует, создаём нового
    user = new User({
      TelegramId, // ID пользователя из Telegram
      firstName,  // Имя
      lastName,   // Фамилия (опционально)
      username,   // Имя пользователя
      languageCode, // Код языка
      isPremium,  // Статус Premium
    });

    await user.save();

    return NextResponse.json(user, { status: 201 }); // HTTP 201 - Created
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error); // Логирование ошибки
    return NextResponse.json(
      { error: 'Ошибка при создании пользователя' },
      { status: 500 } // HTTP 500 - Internal Server Error
    );
  }
}