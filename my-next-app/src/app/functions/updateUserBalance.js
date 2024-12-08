export const updateUserBalance = async (TelegramId, ecobalance, action) => {
    try {
      const balanceUpdateResponse = await fetch("/api/updateUserBalance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          TelegramId,
          ecobalance,
          action, // Тип действия: increment, decrement или set
        }),
      });
  
      if (!balanceUpdateResponse.ok) {
        const errorData = await balanceUpdateResponse.json();
        console.error("Ошибка при обновлении баланса:", errorData.error);
        return null;
      }
  
      const updatedUser = await balanceUpdateResponse.json();
      console.log("Баланс успешно обновлён:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Ошибка при запросе обновления баланса:", error);
      return null;
    }
  };