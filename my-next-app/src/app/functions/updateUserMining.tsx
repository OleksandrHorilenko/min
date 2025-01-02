/**
 * Функция для обновления данных пользователя.
 * @param {string} action - Действие: "increment", "decrement" или "set".
 * @param {number} amount - Количество монет для изменения.
 * @param {string} telegramId - Telegram ID пользователя.
 * @returns {Promise<{ success: boolean; message?: string; [key: string]: any }>} - Результат запроса к API.
 * 
 */

// updateUserMiningData('decrement', 20, '987654321')
 //.then(data => console.log('Updated data:', data))
 // .catch(err => console.error('Error:', err));


export async function updateUserMiningData(
    action: "increment" | "decrement" | "set",
    amount: number,
    telegramId: string
  ): Promise<{ success: boolean; message?: string; [key: string]: any }> {
    try {
      // URL эндпоинта
      const endpoint = '/api/userMining';
  
      // Тело запроса
      const requestData = {
        action,
        amount,
        telegramId,
      };
  
      // Выполнение PUT запроса через fetch
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      // Проверяем статус ответа
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user mining data');
      }
  
      // Возвращаем данные ответа
      return await response.json();
    } catch (error) {
      // Обработка ошибок
      console.error('Error updating user mining data:', error);
  
      // Приведение error к типу Error
      const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
  
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
  