import { NextRequest, NextResponse } from 'next/server';
import UserMining from '../models/UserMining'; // Путь к модели

// Обработчик для GET запроса
export async function GET(req: NextRequest) {
  // Получаем telegramId из query-параметров URL
  const telegramId = req.nextUrl.searchParams.get('telegramId'); 

  if (!telegramId) {
    return NextResponse.json({ message: 'TelegramId is required' }, { status: 400 });
  }

  try {
    // Получаем данные для пользователя по telegramId
    const userMiningData = await UserMining.findOne({ TelegramId: telegramId });

    if (userMiningData) {
      return NextResponse.json(userMiningData); // Отправляем найденные данные
    } else {
      return NextResponse.json({ message: 'User mining data not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching user mining data', error }, { status: 500 });
  }
}


// Обработчик для POST запроса
export async function POST(req: NextRequest) {
  const { minedCoins, bonusCoins, burnedCoins, telegramId } = await req.json(); // Получаем данные из тела запроса

  try {
    // Проверяем, если запись существует - обновляем её, иначе создаём новую
    let userMiningData = await UserMining.findOne({ TelegramId: telegramId });

    if (userMiningData) {
      // Обновляем существующую запись
      userMiningData.minedCoins = minedCoins || userMiningData.minedCoins;
      userMiningData.bonusCoins = bonusCoins || userMiningData.bonusCoins;
      userMiningData.burnedCoins = burnedCoins || userMiningData.burnedCoins;
      userMiningData = await userMiningData.save(); // Сохраняем обновленные данные
    } else {
      // Создаем новую запись
      userMiningData = new UserMining({
        TelegramId: telegramId,
        minedCoins,
        bonusCoins,
        burnedCoins
      });
      await userMiningData.save(); // Сохраняем новую запись
    }

    return NextResponse.json(userMiningData); // Отправляем обновленные или созданные данные
  } catch (error) {
    return NextResponse.json({ message: 'Error updating or creating user mining data', error }, { status: 500 }); // Ошибка при записи
  }
}

// Обработчик для PUT запроса
export async function PUT(req: NextRequest) {
    const { action, amount, telegramId } = await req.json(); // Получаем данные из тела запроса
  
    try {
      // Проверяем, существует ли запись пользователя
      let userMiningData = await UserMining.findOne({ TelegramId: telegramId });
  
      if (userMiningData) {
        // В зависимости от действия обновляем данные
        switch (action) {
          case 'increment':
            userMiningData.minedCoins += amount; // Увеличиваем намайненные монеты
            userMiningData.lastClaim = new Date(); // Обновляем время последнего Claim
            break;
          case 'decrement':
            userMiningData.minedCoins -= amount; // Уменьшаем намайненные монеты
            break;
          case 'set':
            userMiningData.minedCoins = amount; // Устанавливаем новое значение
            break;
          default:
            return NextResponse.json({ message: 'Invalid action' }, { status: 400 }); // Некорректное действие
        }
  
        // Сохраняем обновленные данные
        userMiningData = await userMiningData.save();
        return NextResponse.json(userMiningData); // Отправляем обновленные данные
      } else {
        return NextResponse.json({ message: 'User mining data not found' }, { status: 404 }); // Данные не найдены
      }
    } catch (error) {
      return NextResponse.json({ message: 'Error updating user mining data', error }, { status: 500 }); // Ошибка при обновлении
    }
  }
  