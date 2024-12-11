import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js';
import User from '../models/User';
import UserCollection from '../models/UserCollection';
import UserMining from '../models/UserMining'; // Модель для usermining

export async function POST(req: NextRequest) {
  await connect(); // Подключаемся к базе данных

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
      ecobalance: 100000.0, // Устанавливаем значение по умолчанию
      wallets: [], // Пустой массив по умолчанию
    });
    await user.save();

    // Создаем коллекцию пользователя
    const userCollection = new UserCollection({
      TelegramId,
      cards: [], // Пустой массив карт
    });
    await userCollection.save();

    // Создаем начальную запись в usermining для нового пользователя
    const userMining = new UserMining({
      TelegramId,
      minedCoins: 0, // Начальное количество намайненных монет
      bonusCoins: 0, // Начальное количество бонусных монет
      burnedCoins: 0, // Начальное количество сожженных монет
      
    });
    await userMining.save(); // Сохраняем запись в коллекцию usermining

    return NextResponse.json(user, { status: 201 }); // HTTP 201 - Created
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании пользователя' },
      { status: 500 } // HTTP 500 - Internal Server Error
    );
  }
}


// Получаем данные пользователя
export async function GET(req: NextRequest) {
  await connect();

  try {
    // Получаем параметры query из URL
    const searchParams = req.nextUrl.searchParams;
    const TelegramId = searchParams.get('TelegramId'); // Извлекаем TelegramId

    // Проверяем, что TelegramId присутствует в запросе
    if (!TelegramId) {
      return NextResponse.json(
        { error: 'TelegramId является обязательным параметром' },
        { status: 400 } // HTTP 400 - Bad Request
      );
    }

    // Ищем пользователя в базе данных по TelegramId
    const user = await User.findOne({ TelegramId });

    // Если пользователь не найден, возвращаем ошибку 404
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 } // HTTP 404 - Not Found
      );
    }

    // Возвращаем данные пользователя без лишней вложенности
    return NextResponse.json(user.toObject(), { status: 200 }); // Преобразуем в обычный объект без вложенности
  } catch (error) {
    console.error('Ошибка при получении данных пользователя:', error);
    return NextResponse.json(
      { error: 'Ошибка при получении данных пользователя' },
      { status: 500 } // HTTP 500 - Internal Server Error
    );
  }
}
