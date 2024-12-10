// Функция для получения серверного времени
async function getServerTime() {
    const response = await fetch('/api/serverTime');
    const data = await response.json();
    return new Date(data.serverTime); // Возвращаем время сервера как объект Date
  }