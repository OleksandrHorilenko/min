import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js';
import UserCollection from '../models/UserCollection';

export async function POST(req: NextRequest) {
    await connect(); // Подключаемся к базе данных
  
    try {
      const body = await req.json();
  
      // Извлекаем данные из запроса
      const { TelegramId, newCard } = body;
  
      // Проверяем, что обязательное поле TelegramId присутствует
      if (!TelegramId || !newCard) {
        return NextResponse.json(
          { error: 'TelegramId и новая карта являются обязательными полями' },
          { status: 400 }
        );
      }
  
      // Находим коллекцию пользователя по TelegramId
      const userCollection = await UserCollection.findOne({ TelegramId });
  
      // Если коллекция не найдена, возвращаем ошибку
      if (!userCollection) {
        return NextResponse.json(
          { error: 'Коллекция пользователя не найдена' },
          { status: 404 }
        );
      }
  
      // Добавляем новую карту в коллекцию
      userCollection.cards.push(newCard); // Добавляем карту в массив
  
      // Сохраняем обновленную коллекцию
      await userCollection.save();
  
      return NextResponse.json({ message: 'Новая карта добавлена в коллекцию' }, { status: 200 });
    } catch (error) {
      console.error('Ошибка при добавлении карты в коллекцию:', error);
      return NextResponse.json(
        { error: 'Ошибка при добавлении карты в коллекцию' },
        { status: 500 }
      );
    }
  }