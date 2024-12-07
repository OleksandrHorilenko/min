const cards = [
    {
      cardId: 1,
      rarity: "Common",  // Уникальный ID карты
      title: "First miners",
      description: "First common mining card",
      miningcoins: 1000,
      miningperiod: 100,
      miningcycle: 8, 
      price: 700,
      edition: 88888,
      serialNumber: "N/A",
      isActive: true,
      acquiredAt: new Date().toISOString(),

    },
    {
      cardId: 2,
      rarity: "Rare",
      title: "First rare",
      description: "First rare mining card",
      miningcoins: 10000,
      miningperiod: 100,
      miningcycle: 24, 
      price: 5000,
      edition: 8888,
      serialNumber: "N/A",
      isActive: true,
      acquiredAt: new Date().toISOString(),
    },
    {
      cardId: 3,
      title: "First epic miners",
      rarity: "Epic",
      description: "First epic mining card",
      miningcoins: 100000,
      miningperiod: 90,
      miningcycle: 72, 
      price: 50000,
      edition: 888,
      serialNumber: "N/A",
      isActive: true,
      acquiredAt: new Date().toISOString(),
    },
  ];
  
  export default cards;