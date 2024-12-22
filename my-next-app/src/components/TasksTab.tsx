import { useEffect, useState } from "react";
import { tasks, Task } from '@/components/data/taskData';
import useUserStore from "@/stores/useUserStore";
//import { SendTransactionRequest, useTonConnectUI } from '@tonconnect/ui-react';
import {SendTransactionRequest, TonConnectButton, useTonConnectUI, useTonWallet, useTonAddress } from '@tonconnect/ui-react';





export async function syncUserTasks(TelegramId: string) {
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

export async function updateTask(TelegramId: string, taskId: string, status: string, progress?: number) {
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
    const [isLoading, setIsLoading] = useState(true);  // Лоадер для загрузки задач
    const user = useUserStore((state) => state.user);
    const { userTasks, setUserTasks } = useUserStore();
    const [tonConnectUI] = useTonConnectUI();
    const TelegramId = user?.TelegramId;
    const tonwallet = useTonWallet(); // Использование хука для TON Connect
   const userFriendlyAddress = useTonAddress();
   const rawAddress = useTonAddress(false);
   const setWalletAddress = useUserStore((state) => state.setWalletAddress);

    useEffect(() => {
        if (!TelegramId) {
            return;  // Пока нет пользователя, не загружаем задачи
        }
        setIsLoading(true);  // Включаем лоадер при начале загрузки задач
        fetchUserTasks(TelegramId).then((data) => {
            setUserTasks(data.tasks || []);  // Устанавливаем задачи в состояние
            setIsLoading(false);  // Выключаем лоадер после загрузки задач
        }).catch((error) => {
            console.error("Error fetching tasks:", error);
            setIsLoading(false);  // Выключаем лоадер в случае ошибки
        });
    }, [TelegramId, setUserTasks]);

    useEffect(() => {
        if (TelegramId) {
            syncUserTasks(TelegramId);  // Синхронизация задач с сервером
        }
    }, [TelegramId]);

    const handleStartTask = async (taskId: string, link: string, taskType: string) => {
        try {
            if (taskType === 'special' && taskId === '6') {
                // Логика для задачи с taskId === '6' (отправка транзакции)
                const transaction: SendTransactionRequest = {
                    validUntil: Date.now() + 5 * 60 * 1000, // 5 минут
                    messages: [
                        {
                            address: "UQAK-eku1yCNkL5wt7g9OlBpHSnjadN10h_A19uM3SGVJIu2", // адрес
                            amount: "20000000", // сумма в nanotons
                        },
                    ],
                };
    
                try {
                    await tonConnectUI.sendTransaction(transaction);
                    console.log("Transaction sent successfully");
    
                    // Обновляем статус задачи после успешной транзакции
                    await updateTask(TelegramId, taskId, 'in-progress');
                    const updatedTasks = await fetchUserTasks(TelegramId);
                    setUserTasks(updatedTasks.tasks || []);
                } catch (transactionError) {
                    console.error("Failed to send transaction:", transactionError);
                    alert("Ошибка при отправке транзакции. Попробуйте ещё раз.");
                }
            }
    
            if (taskType === 'special' && taskId === '5') {
                // Логика для задачи с taskId === '5'
                if (userFriendlyAddress && user?.TelegramId) {
                    await updateTask(TelegramId, taskId, 'in-progress');
                    const updatedTasks = await fetchUserTasks(TelegramId);
                    setUserTasks(updatedTasks.tasks || []);
                } else {
                    alert('Ошибка: Отсутствуют необходимые данные (userFriendlyAddress или TelegramId).');
                }
            }
    
            // Общая логика для всех остальных задач
            if (taskType !== 'special') {
                await updateTask(TelegramId, taskId, 'in-progress');
                const updatedTasks = await fetchUserTasks(TelegramId);
                setUserTasks(updatedTasks.tasks || []);
                if (window.Telegram?.WebApp) {
                    window.Telegram.WebApp.openLink(link);
                } else {
                    window.open(link, '_blank');
                }
            }
        } catch (error) {
            console.error("Ошибка обработки задачи:", error);
            alert("Произошла ошибка при обработке задачи. Попробуйте ещё раз.");
        }
    };

    const handleCompleteTask = async (taskId: string) => {
        try {
            await updateTask(TelegramId, taskId, 'completed');
            const updatedTasks = await fetchUserTasks(TelegramId);
            setUserTasks(updatedTasks.tasks || []);
            
            const completedTask = updatedTasks.tasks?.find((task: Task) => task.taskId === taskId);
            if (completedTask && completedTask.reward) {
                const response = await fetch('/api/taskReward', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ TelegramId, taskReward: completedTask.reward }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update user balance');
                }

                const data = await response.json();
                const updatedUser = { ...user, ecobalance: data.ecobalance };
                useUserStore.setState({ user: updatedUser });
                localStorage.setItem('userData', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error("Failed to complete task:", error);
        }
    };

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
                                    <div className="text-yellow-400 mt-1">Reward: {task.reward} THE</div>
                                </div>
                                {task.status === 'available' && (
                                    <button
                                        onClick={() => handleStartTask(task.taskId, task.link, task.type)}
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



