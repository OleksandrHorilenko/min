'use client';

import { useEffect } from "react";

export default function GlobalHapticFeedback({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Проверяем поддержку Telegram Web App Haptic Feedback
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred("light");
      } 
      // Если Haptic Feedback недоступен, используем стандартную вибрацию
      else if (navigator.vibrate) {
        navigator.vibrate(5); // Лёгкая вибрация на 5 мс
      }
    };

    // Назначаем обработчик нажатий
    document.addEventListener("click", handleClick);

    return () => {
      // Убираем обработчик при размонтировании
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return <>{children}</>;
}
