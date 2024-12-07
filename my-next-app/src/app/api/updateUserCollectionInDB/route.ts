import { NextRequest, NextResponse } from 'next/server';
import { addCardToUserCollection } from '@/utils/database';

/**
 * Обработчик для добавления карты в коллекцию пользователя.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { TelegramId, cardId, serialNumber, acquiredAt } = body;

    // Проверяем, что обязательные поля переданы
    if (!TelegramId || !cardId || !serialNumber || !acquiredAt) {
      return NextResponse.json(
        { error: 'Необходимые данные отсутствуют' },
        { status: 400 } // HTTP 400 - Bad Request
      );
    }

    // Добавляем карту в коллекцию
    const updatedCollection = await addCardToUserCollection(TelegramId, {
      cardId,
      serialNumber,
      acquiredAt,
    });

    if (!updatedCollection) {
      return NextResponse.json(
        { error: 'Не удалось обновить коллекцию пользователя' },
        { status: 500 } // HTTP 500 - Internal Server Error
      );
    }

    return NextResponse.json(updatedCollection, { status: 200 }); // HTTP 200 - OK
  } catch (error) {
    console.error('Ошибка в обработчике добавления карты:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 } // HTTP 500 - Internal Server Error
    );
  }
}
