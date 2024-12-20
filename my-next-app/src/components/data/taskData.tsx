import { ReactElement } from 'react';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import StarIcon from '@mui/icons-material/Star';

export type Task = {
    taskId: number; // Идентификатор задания
    tasktype: string; // Тип задания
    type: string; // Группировка по вкладкам
    title: string; // Заголовок задания
    description: string; // Описание задания
    link: string; // Ссылка на задание
    reward: number; // Награда
    status: string; // Статус задания
    icon: string; // Иконка задания
    progress?: number; // Прогресс выполнения задания
    rewardPaid: boolean; // Статус выплаты награды
};


export const tasks: Task[] = [
    {
        taskId: 1, // Изменили с 'id' на 'taskId'
        tasktype: 'telegram',
        type: 'partners',
        title: 'Подпишитесь на канал',
        description: 'Подпишитесь на официальный Telegram-канал проекта.',
        link: 'https://t.me/',
        reward: 50,
        status: 'available',
        icon: 'TelegramIcon',
        progress: 0, // Добавили поле progress
        rewardPaid: false, // Добавили поле rewardPaid
    },
    {
        taskId: 2,
        tasktype: 'twitter',
        type: 'partners',
        title: 'Ретвитните пост',
        description: 'Поделитесь твитом о проекте в своем Twitter.',
        link: 'https://twitter.com/',
        reward: 100,
        status: 'available',
        icon: 'TelegramIcon',
        progress: 0,
        rewardPaid: false,
    },
    {
        taskId: 3,
        tasktype: 'quiz',
        type: 'in-game',
        title: 'Пройдите React Quiz',
        description: 'Пройдите тест по React и узнайте свой уровень знаний.',
        link: 'https://quiz.example.com/',
        reward: 150,
        status: 'available',
        icon: 'TelegramIcon',
        progress: 0,
        rewardPaid: false,
    },
    {
        taskId: 4,
        tasktype: 'special',
        type: 'special',
        title: 'Участвуйте в мероприятии',
        description: 'Примите участие в специальном мероприятии проекта.',
        link: 'https://event.example.com/',
        reward: 200,
        status: 'available',
        icon:'TelegramIcon',
        progress: 0,
        rewardPaid: false,
    },
    {
        taskId: 5,
        tasktype: 'other',
        type: 'in-game',
        title: 'Напишите отзыв',
        description: 'Оставьте отзыв о нашем приложении.',
        link: 'https://feedback.example.com/',
        reward: 75,
        status: 'available',
        icon: 'TelegramIcon',
        progress: 0,
        rewardPaid: false,
    },
];