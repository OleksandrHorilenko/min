import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js';
import Referal from '../models/Referal';

// Генерация уникального реферального кода
function generateReferralCode() {
  return `ref-${Math.random().toString(36).slice(2, 11)}`;
}



// POST-запрос: новый пользователь приходит по реферальной ссылке
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

    // Находим запись с указанным referralCode
    const referalRecord = await Referal.findOne({ referralCode });

    if (!referalRecord) {
      return NextResponse.json(
        { error: 'Реферальный код не найден' },
        { status: 404 }
      );
    }

    // Проверяем, добавлен ли уже этот пользователь в массив рефералов
    if (referalRecord.referrals.includes(TelegramId)) {
      return NextResponse.json(
        { error: 'Пользователь уже добавлен в рефералы' },
        { status: 409 }
      );
    }

    // Добавляем TelegramId в массив рефералов
    referalRecord.referrals.push(TelegramId);

    // Сохраняем изменения
    await referalRecord.save();

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
