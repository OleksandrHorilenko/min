import { NextRequest, NextResponse } from 'next/server';
import connect from '@/app/api/mongodb';
import Usertask from '@/app/api/models/UserTasks';
import { tasks, Task } from '@/components/data/taskData';
import User from '../models/User';

export async function POST(req: NextRequest) {
    await connect();
  
    try {
      const { TelegramId, taskReward } = await req.json();
  
      if (!TelegramId || !taskReward) {
        return NextResponse.json({ error: 'Неверные параметры запроса' }, { status: 400 });
      }
  
      const user = await User.findOne({ TelegramId });
  
      if (!user) {
        return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });
      }
  
      user.ecobalance += taskReward;
  
      await user.save();
  
      return NextResponse.json({ 
        success: true, 
        ecobalance: user.ecobalance 
      });
    } catch (error) {
      console.error('Ошибка начисления награды за задачу:', error);
      return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
    }
  }