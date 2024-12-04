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
      
      if (!userId || !walletAddress) {
        return NextResponse.json(
          { error: 'Missing userId or walletAddress' },
          { status: 400 } // HTTP 400 - Bad Request
        );
      }
      
      // Проверяем, существует ли кошелек для данного userId
      let wallet = await UserWallet.findOne({ userId });
  
      if (wallet) {
        // Если кошелек существует, проверяем, совпадает ли walletAddress
        if (wallet.walletAddress === walletAddress) {
          return NextResponse.json(
            { error: 'Wallet already exists with the same address' },
            { status: 400 } // HTTP 400 - Bad Request
          );
        } else {
          // Если кошелек есть, но адрес отличается, создаем новый
          wallet = new UserWallet({
            userId,
            walletAddress,
          });
          await wallet.save(); // Сохраняем новый кошелек в базе данных
  
          return NextResponse.json(wallet, { status: 201 }); // HTTP 201 - Created
        }
      } else {
        // Если кошелька нет, создаем новый
        wallet = new UserWallet({
          userId,
          walletAddress,
        });
        await wallet.save(); // Сохраняем новый кошелек в базе данных
  
        return NextResponse.json(wallet, { status: 201 }); // HTTP 201 - Created
      }
    } catch (error) {
      console.error('Error saving wallet:', error);
      return NextResponse.json(
        { error: 'Failed to save wallet data' },
        { status: 500 } // HTTP 500 - Internal Server Error
      );
    }
  }
  