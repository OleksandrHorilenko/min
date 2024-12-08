import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js'; // Утилита для подключения к базе данных
import SoldCard from "../models/SoldCards.js"; // Модель проданных карт

export async function POST(req: NextRequest) {
  await connect(); // Подключение к базе данных

  try {
    const body = await req.json();
    const { cardId, serialNumber, owner, soldAt } = body;

    // Проверяем обязательные параметры
    if (!cardId || !owner) {
      return NextResponse.json(
        { error: "Поля cardId и owner обязательны." },
        { status: 400 } // HTTP 400 - Bad Request
      );
    }

    // Создаем новую запись о проданной карте
    let soldCard = new SoldCard ({
      cardId,
      serialNumber,
      owner,
      soldAt: soldAt || new Date(), // Используем текущую дату, если не указана
    });

    return NextResponse.json(
      { message: "Карта успешно добавлена в список проданных.", soldCard },
      { status: 201 } // HTTP 201 - Created
    );
  } catch (error) {
    console.error("Ошибка при добавлении карты в коллекцию проданных:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера." },
      { status: 500 } // HTTP 500 - Internal Server Error
    );
  }
}

export async function GET(req: NextRequest) {
    await connect(); // Подключение к базе данных
  
    try {
      // Получаем все проданные карты из коллекции
      const soldCards = await SoldCard.find();
  
      return NextResponse.json(
        { message: "Проданные карты успешно получены.", soldCards },
        { status: 200 } // HTTP 200 - OK
      );
    } catch (error) {
      console.error("Ошибка при получении проданных карт:", error);
      return NextResponse.json(
        { error: "Внутренняя ошибка сервера." },
        { status: 500 } // HTTP 500 - Internal Server Error
      );
    }
  }