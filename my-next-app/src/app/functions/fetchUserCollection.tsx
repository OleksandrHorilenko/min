import useUserStore from "@/stores/useUserStore";

const fetchUserCollection = async (TelegramId: string) => {
    try {
      const response = await fetch(`/api/getUserCollection?TelegramId=${TelegramId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        console.error("Error fetching user collection:", await response.text());
        return;
      }
  
      const data = await response.json();
      console.log("Fetched collection data:", data); // Логируем ответ
  
      const { setUserCollection } = useUserStore.getState();
      const userCards = data[0]?.cards || []; // Берём `cards` из первого объекта
      console.log("Saving cards to Zustand:", userCards); // Проверяем данные перед сохранением
      setUserCollection(userCards); // Сохраняем в Zustand Store
    } catch (err) {
      console.error("Failed to fetch user collection:", err);
    }
  };

export default fetchUserCollection;