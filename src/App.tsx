import {useState, useEffect} from 'react';
import {sendMessage, receiveNotification, deleteNotification} from './api/greenApi';
import type {ChatMessage, GreenApiCredentials} from './types';
import {Sidebar} from './components/Sidebar';
import {ChatWindow} from './components/ChatWindow';
import {Notification} from './components/Notification';

function App() {
    // 1. Состояние для ключей (инициализируется из localStorage)
    const [credentials, setCredentials] = useState<GreenApiCredentials>(() => {
        const saved = localStorage.getItem('green-api-credentials');
        return saved ? JSON.parse(saved) : {idInstance: '', apiTokenInstance: ''};
    });

    // 2. Состояние для номера телефона (тоже из localStorage)
    const [phoneNumber, setPhoneNumber] = useState(() => {
        return localStorage.getItem('green-api-phone') || '';
    });

    // 3. Состояние для текста сообщения
    const [message, setMessage] = useState('');

    // 4. Состояние для массива сообщений
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    // 5. НОВОЕ: Состояние для всплывающего уведомления
    const [notification, setNotification] = useState<{message: string; type: 'success' | 'error'} | null>(null);

    // Эффект: сохраняем ключи в localStorage при каждом изменении
    useEffect(() => {
        localStorage.setItem('green-api-credentials', JSON.stringify(credentials));
    }, [credentials]);

    // Эффект: сохраняем номер телефона в localStorage
    useEffect(() => {
        localStorage.setItem('green-api-phone', phoneNumber);
    }, [phoneNumber]);

    // Функция отправки сообщения
    const handleSend = async () => {
        if (!credentials.idInstance || !credentials.apiTokenInstance || !phoneNumber || !message) {
            showNotification('Пожалуйста, заполните все поля!', 'error');
            return;
        }

        try {
            await sendMessage(credentials, phoneNumber, message);
            setMessages((prev) => [...prev, {id: Date.now().toString(), text: message, sender: 'me'}]);
            setMessage('');
            showNotification('Сообщение отправлено!', 'success');
        } catch (error) {
            showNotification('Ошибка при отправке. Проверьте ключи.', 'error');
        }
    };

    // Эффект: опрос сервера на новые сообщения (polling)
    useEffect(() => {
        if (!credentials.idInstance || !credentials.apiTokenInstance) return;

        const interval = setInterval(async () => {
            const notification = await receiveNotification(credentials);

            if (notification && notification.body) {
                const body = notification.body;

                // ВАЖНО: Нас интересуют ТОЛЬКО входящие сообщения.
                // Иначе мы будем дублировать свои же отправленные сообщения.
                if (body.typeWebhook === 'incomingMessageReceived') {
                    const incomingText = body.messageData?.textMessageData?.textMessage;

                    if (incomingText) {
                        setMessages((prev) => [
                            ...prev,
                            {id: notification.receiptId.toString(), text: incomingText, sender: 'them'},
                        ]);
                    }
                }

                // Удаляем уведомление в любом случае, чтобы не зацикливаться
                await deleteNotification(credentials, notification.receiptId);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [credentials]);

    // Функция для показа уведомления с авто-закрытием
    const showNotification = (message: string, type: 'success' | 'error') => {
        setNotification({message, type});
        setTimeout(() => setNotification(null), 3000); // 3000 мс = 3 секунды
    };

    return (
        <div style={{display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', margin: 0}}>
            <Sidebar chatName="Тестовый чат" />
            <ChatWindow
                chatName="Тестовый чат"
                messages={messages}
                credentials={credentials}
                setCredentials={setCredentials}
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                message={message}
                setMessage={setMessage}
                onSend={handleSend}
            />
            {/* НОВОЕ: Рендер уведомления, если оно есть */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
}

export default App;
