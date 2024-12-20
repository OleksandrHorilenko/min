

import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js';
import User from '../models/User';
import UserCollection from '../models/UserCollection';
import UserMining from '../models/UserMining';
import Referal from '../models/Referal'; // Модель для referals
import UserTasks from '../models/UserTasks'; // Модель для UserTasks
import { tasks } from '@/components/data/taskData'; // Исходный список заданий

// Функция для генерации уникального реферального кода
function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); // Пример: 'A1B2C3'
}

export async function POST(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();
    const { TelegramId, first_name, last_name, username, language_code, is_premium } = body;

    if (!TelegramId) {
      return NextResponse.json(
        { error: 'TelegramId является обязательным полем' },
        { status: 400 }
      );
    }

    let user = await User.findOne({ TelegramId });
    if (user) {
      return NextResponse.json(user, { status: 200 });
    }

    // Создаем нового пользователя
    user = new User({
      TelegramId,
      first_name,
      last_name,
      username,
      language_code,
      is_premium,
      ecobalance: 100000.0,
      wallets: [],
    });
    await user.save();

    // Создаем коллекцию пользователя
    const userCollection = new UserCollection({
      TelegramId,
      cards: [],
    });
    await userCollection.save();

    // Создаем начальную запись в usermining
    const userMining = new UserMining({
      TelegramId,
      minedCoins: 0,
      bonusCoins: 0,
      burnedCoins: 0,
    });
    await userMining.save();

    // Создаем запись в коллекции referals
    const referralCode = generateReferralCode();
    const referal = new Referal({
      TelegramId,
      referralCode,
      referrals: [], // Пустой массив для приглашённых
    });
    await referal.save();


     // Создаем запись в UserTasks
     const userTasks = new UserTasks({
      TelegramId,
      tasks: tasks.map((task) => ({
        taskId: task.taskId,
        tasktype: task.tasktype,
        type: task.type,
        title: task.title,
        description: task.description,
        link: task.link,
        reward: task.reward,
        status: 'available',
        icon: '',
        progress: 0,
        rewardPaid: false,
      })),
      lastUpdated: new Date(),
    });
    await userTasks.save();

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
    return NextResponse.json(
      { error: 'Ошибка при создании пользователя' },
      { status: 500 }
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
