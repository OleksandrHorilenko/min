import { useEffect, useState } from "react";
import { tasks } from "@/components/data/taskData";
import useUserStore from "@/stores/useUserStore";



async function syncUserTasks(TelegramId: string) {
    try {
        const response = await fetch('/api/syncTasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ TelegramId }),
        });

        if (!response.ok) {
            throw new Error('Failed to synchronize tasks');
        }

        const data = await response.json();
        console.log('Tasks synchronized:', data);
    } catch (error) {
        console.error('Error synchronizing tasks:', error);
    }
}



export async function fetchUserTasks(TelegramId: string) {
    const response = await fetch(`/api/userTasks?TelegramId=${TelegramId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch user tasks");
    }
    return await response.json();
}

export async function updateTask(TelegramId: string, taskId: number, status: string, progress?: number) {
    const response = await fetch(`/api/userTasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ TelegramId, taskId, status, progress }),
    });
    if (!response.ok) {
        throw new Error("Failed to update task");
    }
}

const TasksTab = () => {
    const [activeTab, setActiveTab] = useState<'in-game' | 'partners' | 'special'>('in-game');
    const [isLoading, setIsLoading] = useState(false);
    const user = useUserStore((state) => state.user);
    const { userTasks, setUserTasks } = useUserStore();

    const TelegramId = user.TelegramId;


    useEffect(() => {
        const loadAndSyncTasks = async () => {
            if (!TelegramId) return;
    
            try {
                // Синхронизация новых задач
                await syncUserTasks(TelegramId);
    
                // Загрузка задач после синхронизации
                const tasks = await fetchUserTasks(TelegramId);
                setUserTasks(tasks.tasks || []);
            } catch (error) {
                console.error('Error loading and syncing tasks:', error);
            }
        };
    
        loadAndSyncTasks();
    }, [TelegramId]);

    useEffect(() => {
        const loadTasks = async () => {
            if (!TelegramId) return;
            setIsLoading(true);
            try {
                const response = await fetchUserTasks(TelegramId);
                setUserTasks(response.tasks || []);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTasks();
    }, [TelegramId]);

    const handleStartTask = async (taskId: number, link: string) => {
        try {
            // Локальное обновление
      //      setUserTasks((prevTasks) =>
      //          prevTasks.map((task) =>
     //               task.taskId === taskId ? { ...task, status: 'in-progress' } : task
     //           )
     //       );

            // Обновление статуса на сервере
            await updateTask(TelegramId, taskId, 'in-progress');

            // Обновление задач с сервера
            const updatedTasks = await fetchUserTasks(TelegramId);
            setUserTasks(updatedTasks.tasks || []);

            // Переход по ссылке
        window.open(link, '_blank'); // Открыть в новой вкладке
        } catch (error) {
            console.error("Failed to start task:", error);
        }
    };

    const handleCompleteTask = async (taskId: number) => {
        try {
       //     setUserTasks((prevTasks) =>
         //       prevTasks.map((task) =>
        //            task.taskId === taskId ? { ...task, status: 'completed' } : task
        //        )
        //    );

            await updateTask(TelegramId, taskId, 'completed');
            const updatedTasks = await fetchUserTasks(TelegramId);
            setUserTasks(updatedTasks.tasks || []);
        } catch (error) {
            console.error("Failed to complete task:", error);
        }
    };

    // Фильтруем задания
    const filteredTasks = Array.isArray(userTasks)
        ? userTasks.filter((task) => task.type === activeTab)
        : [];

    return (
        <div className="tasks-tab px-4">
            <div className="header pt-8">
                <h1 className="text-3xl font-bold mb-2">TASKS</h1>
                <p className="text-xl">GET REWARDS END EARN $THE</p>
            </div>

            <div className="tabs flex gap-0 mt-6">
                {['in-game', 'partners', 'special'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as 'in-game' | 'partners' | 'special')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition duration-300 ${
                            activeTab === tab ? 'bg-white text-black' : 'bg-[#151515] text-white'
                        }`}
                    >
                        {tab.replace('-', ' ').toUpperCase()}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="loading-spinner mt-6">Loading...</div>
            ) : (
                <div className="tasks-list mt-4 mb-20 bg-[#151516] rounded-xl">
                    {filteredTasks.map((task) => (
                        <div key={task.taskId} className="task-item flex items-center">
                            <div className="icon w-[72px] flex justify-center">
                                {task.icon}
                            </div>
                            <div className="details flex items-center justify-between w-full py-4 pr-4 border-t border-[#222622]">
                                <div>
                                    <div className="text-[17px] font-bold">{task.title}</div>
                                    <div className="text-gray-400 text-[14px]">{task.description}</div>
                                    <a
                                        href={task.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 text-sm underline"
                                    >
                                        {task.link}
                                    </a>
                                    <div className="text-yellow-400 mt-1">Reward: {task.reward} ECO</div>
                                </div>
                                {task.status === 'available' && (
                                    <button
                                        onClick={() => handleStartTask(task.taskId, task.link)}
                                        className="h-8 bg-white text-black px-4 rounded-full text-sm font-medium"
                                    >
                                        Start
                                    </button>
                                )}
                                {task.status === 'in-progress' && (
                                    <button
                                        onClick={() => handleCompleteTask(task.taskId)}
                                        className="h-8 bg-green-500 text-white px-4 rounded-full text-sm font-medium"
                                    >
                                        Complete
                                    </button>
                                )}
                                {task.status === 'checking' && <span className="text-yellow-400">Checking...</span>}
                                {task.status === 'completed' && <span className="text-green-400">Completed!</span>}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TasksTab;


