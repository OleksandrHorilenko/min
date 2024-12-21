import { NextRequest, NextResponse } from 'next/server';
import connect from '@/app/api/mongodb';
import Usertask from '@/app/api/models/UserTasks';
import { tasks, Task } from '@/components/data/taskData';

export async function POST(req: NextRequest) {
    await connect();

    try {
        const { TelegramId } = await req.json();

        if (!TelegramId) {
            return NextResponse.json({ error: 'TelegramId is required' }, { status: 400 });
        }

        const user = await Usertask.findOne({ TelegramId });

        if (!user || !Array.isArray(user.tasks)) {
            return NextResponse.json({ error: 'User not found or invalid task data' }, { status: 404 });
        }

        const existingTaskIds = new Set(user.tasks.map((task: Task) => String(task.taskId).trim()));
        const fileTaskIds = new Set(tasks.map((task: Task) => String(task.taskId).trim()));

        // Найти новые задачи
        const newTasks = tasks.filter((task: Task) => !existingTaskIds.has(String(task.taskId).trim()));

        // Удалить задания, которых нет в файле
        user.tasks = user.tasks.filter((task: Task) => fileTaskIds.has(String(task.taskId).trim()));

        // Добавить только уникальные новые задачи
        if (newTasks.length > 0) {
            const uniqueNewTasks = Array.from(
                new Map(newTasks.map((task: Task) => [String(task.taskId).trim(), task])).values()
            );

            user.tasks.push(...uniqueNewTasks);
        }

        // Удалить возможные дубли внутри user.tasks
        user.tasks = Array.from(
            new Map(user.tasks.map((task: Task) => [String(task.taskId).trim(), task])).values()
        );

        // Обновить информацию о времени последнего обновления
        user.lastUpdated = new Date();

        await user.save();

        return NextResponse.json({
            message: 'Tasks synchronized',
            added: newTasks.length,
            removed: fileTaskIds.size - user.tasks.length,
        }, { status: 200 });

    } catch (error) {
        console.error('Error syncing tasks:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
