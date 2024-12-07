import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js';
import User from '../models/User';
import UserCollection from '../models/UserCollection';

// Получаем коллекцию пользователя
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
  
      // Получаем коллекцию пользователя
      const userCollection = await UserCollection.find({ TelegramId });
  
      // Если коллекция не найдена, возвращаем ошибку 404
      if (!userCollection || userCollection.length === 0) {
        return NextResponse.json(
          { error: 'Коллекция пользователя не найдена' },
          { status: 404 } // HTTP 404 - Not Found
        );
      }
  
      // Возвращаем коллекцию без дополнительных преобразований
      return NextResponse.json(userCollection.map(item => item.toObject()), { status: 200 }); // HTTP 200 - OK
    } catch (error) {
      console.error('Ошибка при получении коллекции пользователя:', error);
      return NextResponse.json(
        { error: 'Ошибка при получении коллекции пользователя' },
        { status: 500 } // HTTP 500 - Internal Server Error
      );
    }
  }