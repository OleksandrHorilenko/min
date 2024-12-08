import cards from '../../components/data/cards';  // Импортируем массив карт
import fetch from 'node-fetch';  // Для отправки HTTP-запросов

// Функция для отправки карты в базу данных
const importCard = async (card) => {
  try {
    // Отправка POST-запроса с данными карты
    const response = await fetch('/api/cards', {
      method: 'POST',  // Используем метод POST для добавления данных
      headers: {
        'Content-Type': 'application/json',  // Указываем, что отправляем данные в формате JSON
      },
      body: JSON.stringify(card),  // Преобразуем объект карты в строку JSON
    });

    // Получаем ответ от сервера
    const result = await response.json();

    // Логируем успех или ошибку в консоль
    if (response.ok) {
      console.log(`Карта с ID ${card.cardId} успешно добавлена/обновлена.`);
    } else {
      console.error(`Ошибка при добавлении карты с ID ${card.cardId}: ${result.error || 'Неизвестная ошибка'}`);
    }
  } catch (error) {
    // Логируем ошибку в случае неудачного запроса
    console.error(`Ошибка при отправке карты с ID ${card.cardId}:`, error);
  }
};

// Функция для синхронизации всех карт
const syncCards = async () => {
  for (const card of cards) {
    await importCard(card);  // Для каждой карты вызываем функцию добавления
  }
};

// Запускаем синхронизацию карт
syncCards();
