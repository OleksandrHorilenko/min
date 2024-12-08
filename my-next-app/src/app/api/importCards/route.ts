import { NextRequest, NextResponse } from "next/server";
import connect from "@/app/api/mongodb";
import Card from "@/app/api/models/Cards";

export async function GET(req: NextRequest) {
  await connect();

  try {
    // Получаем карты из базы данных
    const cards = await Card.find(); // Если нужно, можно добавить фильтры, например: { isActive: true }

    // Возвращаем список карт
    return NextResponse.json(cards, { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении карт:", error);
    return NextResponse.json(
      { error: "Ошибка при получении карт" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();

    const {
      cardId,
      rarity,
      title,
      description,
      miningcoins,
      miningperiod,
      miningcycle,
      price,
      edition,
      isActive,
    } = body;

    // Проверяем обязательные поля
    if (!cardId || !title || !edition) {
      return NextResponse.json(
        { error: "cardId, title и edition являются обязательными полями" },
        { status: 400 }
      );
    }

    // Проверяем, существует ли карта
    let card = await Card.findOne({ cardId });
    if (card) {
      // Если карта уже существует, обновляем её данные
      card.rarity = rarity;
      card.title = title;
      card.description = description;
      card.miningcoins = miningcoins;
      card.miningperiod = miningperiod;
      card.miningcycle = miningcycle;
      card.price = price;
      card.edition = edition;
      card.isActive = isActive;

      await card.save();
      return NextResponse.json(
        { message: "Карта обновлена", card },
        { status: 200 }
      );
    }

    // Создаем новую карту
    card = new Card({
      cardId,
      rarity,
      title,
      description,
      miningcoins,
      miningperiod,
      miningcycle,
      price,
      edition,
      isActive,
    });
    await card.save();

    return NextResponse.json({ message: "Карта добавлена", card }, { status: 201 });
  } catch (error) {
    console.error("Ошибка при добавлении карты:", error);
    return NextResponse.json(
      { error: "Ошибка при добавлении карты" },
      { status: 500 }
    );
  }
}
