import useUserStore from "@/stores/useUserStore";

const fetchUserCollection = async (TelegramId: string): Promise<any[]> => {
  try {
    const response = await fetch(`/api/getUserCollection?TelegramId=${TelegramId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Error fetching user collection:", await response.text());
      return []; // Возвращаем пустой массив в случае ошибки
    }

    const data = await response.json();
    console.log("Fetched collection data:", data); // Логируем ответ

    const { setUserCollection } = useUserStore.getState();
    const userCards = data[0]?.cards || []; // Берём `cards` из первого объекта
    console.log("Saving cards to Zustand:", userCards); // Проверяем данные перед сохранением
    setUserCollection(userCards); // Сохраняем в Zustand Store

    return userCards; // Возвращаем карты
  } catch (err) {
    console.error("Failed to fetch user collection:", err);
    return []; // Возвращаем пустой массив в случае ошибки
  }
};

export default fetchUserCollection;
