import { NextRequest, NextResponse } from 'next/server';
import connect from '../mongodb';
import UserTasks from '../models/UserTasks';
import { Task } from '@/stores/useUserStore';

export async function GET(req: NextRequest) {
    await connect();

    try {
        const { searchParams } = req.nextUrl;
        const TelegramId = searchParams.get('TelegramId');
        
        if (!TelegramId) {
            return NextResponse.json({ error: 'TelegramId is required' }, { status: 400 });
        }

        const userTasks = await UserTasks.findOne({ TelegramId });
        
        if (!userTasks) {
            return NextResponse.json({ error: 'User tasks not found' }, { status: 404 });
        }

        return NextResponse.json(userTasks, { status: 200 });
    } catch (error) {
        console.error('Error fetching user tasks:', error);
        return NextResponse.json({ error: 'Error fetching user tasks' }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    await connect();

    try {
        const { TelegramId, taskId, status, progress } = await req.json();

        if (!TelegramId || taskId === undefined || !status) {
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        const userTasks = await UserTasks.findOne({ TelegramId });

        if (!userTasks) {
            return NextResponse.json({ error: 'User tasks not found' }, { status: 404 });
        }

        const task = userTasks.tasks.find((t: Task) => t.taskId === taskId);

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        task.status = status;
        if (progress !== undefined) task.progress = progress;

        userTasks.lastUpdated = new Date();
        await userTasks.save();

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json({ error: 'Error updating task' }, { status: 500 });
    }
}