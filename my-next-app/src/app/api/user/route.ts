//import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb.js';
import User from '../models/User'; // Здесь будет ваша модель Mongoose



// Обработчик для POST запроса (создание пользователя)
export async function POST(req: NextRequest) {
    await connect();
  
    try {
      const body = await req.json(); // Чтение данных из запроса
      const user = new User(body);
      await user.save();
      return NextResponse.json(user, { status: 201 }); // Возвращаем успешный ответ
    } catch (error) {
      return NextResponse.json({ error: 'Ошибка при создании пользователя' }, { status: 500 });
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