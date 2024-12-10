


export async function GET() {
    const serverTime = new Date().toISOString(); // Получаем текущее время сервера в ISO формате
    return new Response(JSON.stringify({ serverTime }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }