import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb'; // Подключаемся к MongoDB
import UserWallet from '../models/UserWallet'; // Импортируем модель Wallet
import User from '../models/User'; // Импортируем модель User

// Подключение к базе данных
export async function POST(req: NextRequest) {
    await connect(); // Подключаемся к базе данных
    
    try {
      const body = await req.json(); // Получаем данные из тела запроса
      const { userId, walletAddress } = body; // Деструктурируем данные
      const userIdNumber = parseInt(userId, 10);
  
      if (!userIdNumber || !walletAddress) {
        return NextResponse.json(
          { error: 'Missing userId or walletAddress' },
          { status: 400 } // HTTP 400 - Bad Request
        );
      }
  
      // Проверяем наличие записи с данным userId
      const existingWallet = await UserWallet.findOne({ userIdNumber });
  
      if (existingWallet) {
        // Если кошелек уже существует, проверяем совпадение адреса
        if (existingWallet.walletAddress === walletAddress) {
          return NextResponse.json(
            { error: 'Wallet already exists with the same address' },
            { status: 200 } // HTTP 200 - OK
          );
        } else {
          // Если адрес кошелька отличается, обновляем запись
          existingWallet.walletAddress = walletAddress;
          await existingWallet.save();
          return NextResponse.json(existingWallet, { status: 200 }); // HTTP 200 - OK
        }
      }
  
      // Если записи с данным userId нет, создаем новую
      const newWallet = new UserWallet({ userIdNumber, walletAddress });
      await newWallet.save(); // Сохраняем кошелек в базе данных
  
      return NextResponse.json(newWallet, { status: 201 }); // HTTP 201 - Created
    } catch (error) {
      console.error('Error saving wallet:', error);
      return NextResponse.json(
        { error: 'Failed to save wallet data' },
        { status: 500 } // HTTP 500 - Internal Server Error
      );
    }
  }