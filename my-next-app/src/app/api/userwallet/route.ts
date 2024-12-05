import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb';
import UserWallet from '../models/UserWallet';

export async function POST(req: NextRequest) {
  await connect();

  try {
    const body = await req.json();
    const { TelegramId, walletAddress } = body;

    if (!TelegramId || !walletAddress) {
      return NextResponse.json(
        { error: 'Missing TelegramId or walletAddress' },
        { status: 400 } // HTTP 400 - Bad Request
      );
    }

    // Проверяем наличие записи с данным TelegramId
    const existingWallet = await UserWallet.findOne({ TelegramId });

    if (existingWallet) {
      // Если кошелек уже существует, проверяем совпадение адреса
      if (existingWallet.walletAddress === walletAddress) {
        return NextResponse.json(
          { error: 'Wallet already exists with the same address' },
          { status: 200 }
        );
      } else {
        // Если адрес кошелька отличается, обновляем запись
        existingWallet.walletAddress = walletAddress;
        await existingWallet.save();
        return NextResponse.json(existingWallet, { status: 200 });
      }
    }

    // Если записи с данным TelegramId нет, создаем новую
    const newWallet = new UserWallet({ TelegramId, walletAddress });
    await newWallet.save();

    return NextResponse.json(newWallet, { status: 201 });
  } catch (error) {
    console.error('Error saving wallet:', error);
    return NextResponse.json(
      { error: 'Failed to save wallet data' },
      { status: 500 }
    );
  }
}
