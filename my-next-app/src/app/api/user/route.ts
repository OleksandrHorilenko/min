//import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js';
import User from '../models/User'; // Здесь будет ваша модель Mongoose



export async function POST(req: NextRequest) {
    await connect();
  
    try {
      const body = await req.json();
  
      // Проверяем, существует ли пользователь с таким ID
      let user = await User.findOne({ id: body.id });
      if (user) {
        // Если пользователь существует, возвращаем его данные
        return NextResponse.json(user, { status: 200 }); // HTTP 200 - OK
      }
  
      // Если пользователь не существует, создаём нового
      user = new User(body);
      await user.save();
  
      return NextResponse.json(user, { status: 201 }); // HTTP 201 - Created
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error); // Логирование ошибки
      return NextResponse.json(
        { error: 'Ошибка при создании пользователя' },
        { status: 500 } // HTTP 500 - Internal Server Error
      );
    }
  }
  
  // Обработчик для GET запроса (получение списка пользователей)
  export async function GET() {
    await connect();
  
    try {
      const users = await User.find(); // Получение всех пользователей
      return NextResponse.json(users); // Возвращаем пользователей
    } catch (error) {
      return NextResponse.json({ error: 'Ошибка при получении пользователей' }, { status: 500 });
    }
  }