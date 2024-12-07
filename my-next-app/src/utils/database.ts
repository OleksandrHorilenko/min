import connect from '@/app/api/mongodb';
import UserCollection from '@/app/api/models/UserCollection';

/**
 * Добавляет карту в коллекцию пользователя.
 * @param {string} TelegramId - Идентификатор пользователя.
 * @param {object} cardData - Данные карты (например, cardId, serialNumber, acquiredAt).
 * @returns {Promise<object | null>} - Обновленная коллекция или null в случае ошибки.
 */
export async function addCardToUserCollection(TelegramId: string, cardData: any): Promise<object | null> {
  try {
    await connect();

    // Находим коллекцию пользователя
    const userCollection = await UserCollection.findOne({ TelegramId });
    if (!userCollection) {
      throw new Error(`Коллекция для пользователя с TelegramId ${TelegramId} не найдена.`);
    }

    // Добавляем новую карту
    userCollection.cards.push(cardData);

    // Сохраняем изменения
    await userCollection.save();

    return userCollection;
  } catch (error) {
    console.error('Ошибка при добавлении карты в коллекцию:', error);
    return null;
  }
}
