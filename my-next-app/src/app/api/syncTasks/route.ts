import { NextRequest, NextResponse } from 'next/server';
import { tasks } from '@/components/data/taskData'; // Импорт списка задач
import connect from '@/app/api/mongodb'; // Подключение к MongoDB
import User from '@/app/api/models/User'; // Модель пользователя

export async function POST(req: NextRequest) {
  try {
    await connect();

    const { TelegramId } = await req.json();

    if (!TelegramId) {
      return NextResponse.json({ error: 'TelegramId is required' }, { status: 400 });
    }

    const user = await User.findOne({ TelegramId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Собрать taskId из файла
    const fileTaskIds = tasks.map((task) => task.taskId);

    // Собрать taskId из базы
    const dbTaskIds = user.tasks.map((task) => task.taskId);

    // Найти новые задания
    const newTasks = tasks.filter((task) => !dbTaskIds.includes(task.taskId));

    // Найти задания для удаления
    const tasksToRemove = user.tasks.filter((task) => !fileTaskIds.includes(task.taskId));

    // Добавить новые задания
    if (newTasks.length > 0) {
      user.tasks.push(...newTasks);
    }

    // Удалить отсутствующие задания
    if (tasksToRemove.length > 0) {
      user.tasks = user.tasks.filter((task) => fileTaskIds.includes(task.taskId));
    }

    // Обновить пользователя
    user.lastUpdated = new Date();
    await user.save();

    return NextResponse.json({
      message: 'Tasks synchronized',
      added: newTasks.length,
      removed: tasksToRemove.length,
    });
  } catch (error) {
    console.error('Error syncing tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
