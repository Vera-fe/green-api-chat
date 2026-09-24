// Базовый URL для всех запросов к GREEN-API
const API_URL = 'https://api.green-api.com';

// Интерфейс для ключей, которые вводит пользователь
export interface GreenApiCredentials {
    idInstance: string;
    apiTokenInstance: string;
}

// Функция отправки сообщения
export async function sendMessage(
    credentials: GreenApiCredentials,
    phoneNumber: string,
    message: string
) {
    const {idInstance, apiTokenInstance} = credentials;

    // Формируем URL по документации GREEN-API
    // Важно: для Telegram используем формат 79991112233@c.us
    const url = `${API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

    const body = {
        chatId: `${phoneNumber}@c.us`,
        message: message,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('Сообщение отправлено, ответ сервера:', data);
        return data;
    } catch (error) {
        console.error('Ошибка при отправке сообщения:', error);
        throw error;
    }
}

// Функция получения одного нового уведомления
export async function receiveNotification(credentials: GreenApiCredentials) {
  const { idInstance, apiTokenInstance } = credentials;
  const url = `${API_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    return data; // Если данных нет, вернется null
  } catch (error) {
    console.error('Ошибка при получении уведомления:', error);
    return null;
  }
}

// Функция удаления уведомления (обязательно после обработки)
export async function deleteNotification(credentials: GreenApiCredentials, receiptId: number) {
  const { idInstance, apiTokenInstance } = credentials;
  const url = `${API_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`;

  try {
    await fetch(url, { method: 'DELETE' });
  } catch (error) {
    console.error('Ошибка при удалении уведомления:', error);
  }
}
