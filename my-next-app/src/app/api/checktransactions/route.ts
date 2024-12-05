const fetchTransactionStatus = async (address: string, txid: string) => {
    const apiUrl = `https://toncenter.com/api/v2/getAddressInformation`;
  
    try {
      const response = await fetch(`${apiUrl}?address=${address}&includeTransactions=true`);
  
      if (!response.ok) {
        throw new Error(`TON API error: ${response.statusText}`);
      }
  
      const data = await response.json();
      if (!data.ok) {
        throw new Error(`TON API returned error: ${data.error}`);
      }
  
      // Ищем транзакцию с указанным txid
      const transaction = data.result.transactions.find(
        (tx: any) => tx.lastTransactionId.hash === txid
      );
  
      return transaction ? { success: true, transaction } : { success: false };
    } catch (error) {
      // Явное приведение типа error к Error
      if (error instanceof Error) {
        console.error('Ошибка проверки транзакции:', error.message);
        return { success: false, error: error.message };
      }
  
      // Обработка неизвестных ошибок
      console.error('Неизвестная ошибка проверки транзакции:', error);
      return { success: false, error: 'Unknown error occurred' };
    }
  };
  