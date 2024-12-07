import fetchUserCollection from "@/app/functions/fetchUserCollection";
import useUserStore from "@/stores/useUserStore";
import { useEffect } from "react";

const UserCollection = () => {
  const userCollection = useUserStore((state) => state.userCollection);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (user.TelegramId) {
      fetchUserCollection(user.TelegramId); // Вызываем только если TelegramId не null
    } else {
      console.warn("TelegramId is null. Collection fetch skipped.");
    }
  }, [user.TelegramId]);

  return (
    <div>
      {userCollection.map((card) => (
        <div key={card._id}>
          <p>Card ID: {card.cardId}</p>
          <p>Serial Number: {card.serialNumber}</p>
          <p>Is Active: {card.isActive ? "Yes" : "No"}</p>
        </div>
      ))}
    </div>
  );
};

export default UserCollection;