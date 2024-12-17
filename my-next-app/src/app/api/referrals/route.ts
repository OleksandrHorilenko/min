import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js';
import Referal from '../models/Referal';

// Генерация уникального реферального кода
function generateReferralCode() {
  return `ref-${Math.random().toString(36).substr(2, 9)}`;
}

// POST-запрос: новый пользователь приходит по реферальной ссылке
export async function POST(request: NextRequest) {
  await connect(); // Подключаемся к базе данных

  const { telegramId, referralCode } = await request.json();

  if (!telegramId) {
    return NextResponse.json({ error: 'Missing TelegramId' }, { status: 400 });
  }

  try {
    // Проверяем, существует ли уже запись для данного TelegramId
    let user = await Referal.findOne({ TelegramId: telegramId });
    if (user) {
      return NextResponse.json({ message: 'User already exists' });
    }

    // Генерируем новый реферальный код для нового пользователя
    const newReferralCode = generateReferralCode();

    // Создаем запись для нового пользователя
    const newUser = new Referal({
      TelegramId: telegramId,
      referralCode: newReferralCode,
      referrals: [],
    });

    await newUser.save();

    // Если указан реферальный код, ищем владельца и добавляем нового пользователя в его referrals
    if (referralCode) {
      const referrer = await Referal.findOne({ referralCode });
      if (referrer) {
        referrer.referrals.push(telegramId);
        await referrer.save();
      } else {
        console.warn(`Referral code ${referralCode} not found`);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      referralCode: newReferralCode,
    });
  } catch (error) {
    console.error('Error handling referral:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET-запрос: получить рефералов пользователя по его TelegramId
export async function GET(request: NextRequest) {
  await connect(); // Подключаемся к базе данных

  // Получаем TelegramId из query-параметра
  const telegramId = request.nextUrl.searchParams.get('telegramId');

  if (!telegramId) {
    return NextResponse.json(
      { error: 'TelegramId является обязательным параметром' },
      { status: 400 } // HTTP 400 - Bad Request
    );
  }

  try {
    // Ищем запись в коллекции referals по TelegramId
    const referalData = await Referal.findOne({ TelegramId: telegramId });

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