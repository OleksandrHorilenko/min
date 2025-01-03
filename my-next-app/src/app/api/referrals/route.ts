import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js';
import Referal from '../models/Referal';
import User from '../models/User';

// Генерация уникального реферального кода
//function generateReferralCode() {
 // return `ref-${Math.random().toString(36).slice(2, 11)}`;
//}



export async function POST(req: NextRequest) {
  await connect(); // Подключаемся к базе данных

  try {
    const { TelegramId, referralCode } = await req.json();

    if (!TelegramId || !referralCode) {
      return NextResponse.json(
        { error: 'TelegramId и referralCode обязательны' },
        { status: 400 }
      );
    }

    // Проверяем, существует ли уже пользователь с таким TelegramId
    const existingUser = await User.findOne({ TelegramId });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    // Проверяем, был ли пользователь добавлен в рефералы
    const referalWithUser = await Referal.findOne({ referrals: TelegramId });
    if (referalWithUser) {
      return NextResponse.json(
        { error: 'Пользователь уже добавлен в рефералы' },
        { status: 409 }
      );
    }

    // Находим запись с указанным referralCode
    const referalRecord = await Referal.findOne({ referralCode });
    if (!referalRecord) {
      return NextResponse.json(
        { error: 'Реферальный код не найден' },
        { status: 404 }
      );
    }

    // Добавляем TelegramId в массив рефералов в коллекции referals
    referalRecord.referrals.push(TelegramId);
    await referalRecord.save();

    // Находим пользователя, которому принадлежит referralCode, в коллекции users
    const referalOwner = await User.findOne({ refCode: referralCode });
    if (!referalOwner) {
      return NextResponse.json(
        { error: 'Пользователь с указанным реферальным кодом не найден' },
        { status: 404 }
      );
    }

    // Убедиться, что поле referals существует и является массивом
    if (!Array.isArray(referalOwner.referals)) {
      referalOwner.referals = [];
    }

    // Добавляем TelegramId в массив referals в коллекции users
    referalOwner.referals.push(TelegramId);
    await referalOwner.save();

    return NextResponse.json({
      success: true,
      message: 'Реферал успешно добавлен',
    });
  } catch (error) {
    console.error('Ошибка при добавлении реферала:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}






// GET-запрос: получить рефералов пользователя по его TelegramId
export async function GET(req: NextRequest) {
  await connect(); // Подключаемся к базе данных

  // Получаем TelegramId из query-параметра
  const searchParams = req.nextUrl.searchParams;
  const TelegramId = searchParams.get('TelegramId'); // Извлекаем TelegramId

  if (!TelegramId) {
    return NextResponse.json(
      { error: 'TelegramId является обязательным параметром' },
      { status: 400 } // HTTP 400 - Bad Request
    );
  }

  try {
    // Ищем запись в коллекции referals по TelegramId
    const referalData = await Referal.findOne({ TelegramId: TelegramId });

    if (!referalData) {
      return NextResponse.json(
        { error: 'Реферальная запись не найдена' },
        { status: 404 } // HTTP 404 - Not Found
      );
    }

    // Возвращаем реферальный код и список рефералов
    return NextResponse.json({
      referralCode: referalData.referralCode,
      referrals: referalData.referrals, // Список приглашённых пользователей
    });
  } catch (error) {
    console.error('Ошибка при получении рефералов:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 } // HTTP 500 - Internal Server Error
    );
  }
}
