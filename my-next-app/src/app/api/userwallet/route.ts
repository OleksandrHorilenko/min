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
  
      // Убедитесь, что userId является числом
      const userIdNumber = parseInt(userId, 10); 
  
      if (!userIdNumber || !walletAddress) {
        return NextResponse.json(
          { error: 'Missing userId or walletAddress' },
          { status: 400 }
        );
      }
  
      // Проверяем, существует ли пользователь с таким ID
      let user = await User.findOne({ id: userIdNumber }); // Ищем пользователя по id (число)
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 } // HTTP 404 - Not Found
        );
      }
  
      // Проверяем, существует ли уже кошелек для этого пользователя
      let wallet
      // = await UserWallet.findOne({ userId: userIdNumber });
     // if (wallet) {
     //   return NextResponse.json(
      //    { error: 'Wallet already exists for this user' },
      //    { status: 400 } // HTTP 400 - Bad Request
     //   );
    //  }
  
      // Создаем новый кошелек
      wallet = new UserWallet({
        userId: userIdNumber,
        walletAddress,
      });
  
      await wallet.save(); // Сохраняем кошелек в базе данных
  
      return NextResponse.json(wallet, { status: 201 }); // HTTP 201 - Created
    } catch (error) {
      console.error('Error saving wallet:', error); // Логирование ошибки
      return NextResponse.json(
        { error: 'Failed to save wallet data' },
        { status: 500 } // HTTP 500 - Internal Server Error
      );
    }
  }
  