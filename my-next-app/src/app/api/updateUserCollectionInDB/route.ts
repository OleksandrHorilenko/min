import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js'; // Подключение к базе данных
import UserCollection from '../models/UserCollection'; // Импорт модели коллекции карт

/**
 * Обработчик для обновления коллекции карт пользователя.
 */
export async function POST(req: NextRequest) {
  try {
    // Подключаемся к базе данных
    await connect();

    // Получаем данные из запроса
    const body = await req.json();
    console.log('Полученные данные:', body); // Логируем данные для отладки

    const { TelegramId, cards } = body;

    // Проверяем обязательные поля
    if (!TelegramId || !cards || cards.length === 0) {
      return NextResponse.json(
        { error: 'Необходимые данные отсутствуют' },
        { status: 400 }
      );
    }

    // Находим пользователя в базе
    const user = await UserCollection.findOne({ TelegramId });

    // Если пользователь не найден
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Обновляем коллекцию карт пользователя
    user.cards = cards; // Обновляем массив карт

    // Сохраняем изменения в базе
    await user.save();

    return NextResponse.json({ message: 'Коллекция обновлена успешно' }, { status: 200 });

  } catch (error) {
    //console.error('Ошибка в обработчике обновления коллекции карт:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    );
  }
}
