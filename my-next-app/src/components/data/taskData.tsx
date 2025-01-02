

export type Task = {
    taskId: string; // Идентификатор задания
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
        taskId: '1', // Изменили с 'id' на 'taskId'
        tasktype: 'telegram',
        type: 'in-game',
        title: 'Subscribe channel',
        description: 'Subscribe our channel',
        link: 'https://t.me/themine_app',
        reward: 50,
        status: 'available',
        icon: 'TelegramIcon',
        progress: 0, // Добавили поле progress
        rewardPaid: false, // Добавили поле rewardPaid
    },
    {
        taskId: '2',
        tasktype: 'twitter',
        type: 'in-game',
        title: 'Follow X',
        description: 'Follow X',
        link: 'https://twitter.com/',
        reward: 50,
        status: 'available',
        icon: 'TelegramIcon',
        progress: 0,
        rewardPaid: false,
    },
  //  {
  //      taskId: '3',
  //      tasktype: 'quiz',
   //     type: 'in-game',
  //      title: 'Follow us in Instagram',
   //     description: 'Follow us in Instagram.',
    //    link: 'https://www.instagram.com/',
   //     reward: 50,
  //      status: 'available',
   //     icon: 'TelegramIcon',
   //     progress: 0,
   //     rewardPaid: false,
  //  },

  //  {
   //     taskId: '4',
   //     tasktype: 'quiz',
   //     type: 'in-game',
   //     title: 'Subscribe on Youtube',
   //     description: 'Subscribe our Youtube',
   //     link: 'https://www.youtube.com/',
   //     reward: 50,
   //     status: 'available',
   //     icon: 'TelegramIcon',
   //     progress: 0,
   //     rewardPaid: false,
  //  },
   
    {
        taskId: '5',
        tasktype: 'special',
        type: 'special',
        title: 'Connect wallet',
        description: 'Connect wallet.',
        link: '/wallet',
        reward: 100,
        status: 'available',
        icon: 'TelegramIcon',
        progress: 0,
        rewardPaid: false,
    },

    
    {
        taskId: '6',
        tasktype: 'special',
        type: 'special',
        title: 'Make small transaction',
        description: 'Make small transaction.',
        link: '/wallet',
        reward: 150,
        status: 'available',
        icon: 'TelegramIcon',
        progress: 0,
        rewardPaid: false,
    },
    {
        taskId: '7', // Изменили с 'id' на 'taskId'
        tasktype: 'telegram',
        type: 'in-game',
        title: 'Subscribe our TG group',
        description: 'Subscribe our TG group',
        link: 'https://t.me/+8OgpRqfFu5UyMjQ6',
        reward: 50,
        status: 'available',
        icon: 'TelegramIcon',
        progress: 0, // Добавили поле progress
        rewardPaid: false, // Добавили поле rewardPaid
    },
];