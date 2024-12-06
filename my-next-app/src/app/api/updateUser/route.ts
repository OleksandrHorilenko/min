import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js';
import User from '../models/User';

export async function PUT(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();

    const { TelegramId, first_name, last_name, username, language_code, is_premium, ecobalance, wallets } = body;

    if (!TelegramId) {
      return NextResponse.json(
        { error: 'TelegramId является обязательным полем' },
        { status: 400 }
      );
    }

    let user = await User.findOne({ TelegramId });
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Создаем тип для updateData, который будет содержать все возможные поля для обновления
    const updateData: { 
      first_name?: string, 
      last_name?: string, 
      username?: string, 
      language_code?: string, 
      is_premium?: boolean, 
      ecobalance?: number, 
      wallets?: string[] 
    } = {};

    // Добавляем в объект updateData только те поля, которые присутствуют в запросе
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (username !== undefined) updateData.username = username;
    if (language_code !== undefined) updateData.language_code = language_code;
    if (is_premium !== undefined) updateData.is_premium = is_premium;
    if (ecobalance !== undefined) updateData.ecobalance = ecobalance;
    if (wallets !== undefined) updateData.wallets = wallets;

    // Обновляем данные пользователя
    user = await User.findOneAndUpdate({ TelegramId }, updateData, { new: true });

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    return NextResponse.json(
      { error: 'Ошибка при обновлении пользователя' },
      { status: 500 }
    );
  }
}
