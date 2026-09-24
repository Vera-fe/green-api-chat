import {useState, useEffect} from 'react';
import {sendMessage, receiveNotification, deleteNotification, type GreenApiCredentials} from './api/greenApi';

// Тип для одного сообщения в нашем чате
interface ChatMessage {
    id: string;
    text: string;
    sender: 'me' | 'them'; // кто отправил: я или собеседник
}

function App() {
    const [idInstance, setIdInstance] = useState('');
    const [apiTokenInstance, setApiTokenInstance] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');

    // Массив сообщений
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    // Функция отправки
    const handleSend = async () => {
        if (!idInstance || !apiTokenInstance || !phoneNumber || !message) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        const credentials: GreenApiCredentials = {idInstance, apiTokenInstance};

        try {
            await sendMessage(credentials, phoneNumber, message);

            // Добавляем сообщение в ленту (справа)
            setMessages((prev) => [
                ...prev,
                {id: Date.now().toString(), text: message, sender: 'me'},
            ]);

            setMessage('');
        } catch (error) {
            alert('Ошибка при отправке. Проверьте ключи и номер телефона.');
        }
    };

    // Эффект для опроса сервера (polling)
    useEffect(() => {
        // Если ключи не введены, ничего не делаем
        if (!idInstance || !apiTokenInstance) return;

        const credentials: GreenApiCredentials = {idInstance, apiTokenInstance};

        const interval = setInterval(async () => {
            const notification = await receiveNotification(credentials);

            if (notification && notification.body) {
                const body = notification.body;

                // Нас интересуют только входящие сообщения
                if (body.typeWebhook === 'incomingMessageReceived') {
                    const incomingText = body.messageData?.textMessageData?.textMessage;

                    if (incomingText) {
                        // Добавляем сообщение в ленту (слева)
                        setMessages((prev) => [
                            ...prev,
                            {id: notification.receiptId.toString(), text: incomingText, sender: 'them'},
                        ]);
                    }
                }

                // Обязательно удаляем уведомление, чтобы не получить его снова
                await deleteNotification(credentials, notification.receiptId);
            }
        }, 5000); // Опрос каждые 5 секунд

        // Очистка таймера при размонтировании
        return () => clearInterval(interval);
    }, [idInstance, apiTokenInstance]);

    return (
        <div style={{display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif', margin: 0}}>
            {/* Левая колонка */}
            <div style={{width: '300px', borderRight: '1px solid #ccc', padding: '20px', backgroundColor: '#f0f2f5'}}>
                <h2>Чаты</h2>
                <div style={{padding: '10px', backgroundColor: '#e0e0e0', borderRadius: '8px', cursor: 'pointer'}}>
                    <strong>Тестовый чат</strong>
                    <p style={{fontSize: '12px', color: '#666'}}>Нажмите, чтобы открыть</p>
                </div>
            </div>

            {/* Правая колонка */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                {/* Шапка */}
                <div style={{padding: '20px', borderBottom: '1px solid #ccc', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <h3 style={{margin: 0}}>Тестовый чат</h3>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <input type="text" placeholder="idInstance" value={idInstance} onChange={(e) => setIdInstance(e.target.value)} style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1}} />
                        <input type="text" placeholder="apiTokenInstance" value={apiTokenInstance} onChange={(e) => setApiTokenInstance(e.target.value)} style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1}} />
                    </div>
                    <input type="text" placeholder="Номер телефона получателя (например, 79991112233)" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}} />
                </div>

                {/* Лента сообщений */}
                <div style={{flex: 1, padding: '20px', backgroundColor: '#e5ddd5', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                alignSelf: msg.sender === 'me' ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.sender === 'me' ? '#dcf8c6' : '#fff',
                                padding: '10px',
                                borderRadius: '8px',
                                maxWidth: '60%',
                                boxShadow: '0 1px 1px rgba(0,0,0,0.1)'
                            }}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                {/* Поле ввода */}
                <div style={{padding: '20px', backgroundColor: '#f0f2f5', display: 'flex', gap: '10px'}}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Введите сообщение..."
                        style={{flex: 1, padding: '10px', borderRadius: '20px', border: '1px solid #ccc', outline: 'none'}}
                    />
                    <button onClick={handleSend} style={{padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer'}}>
                        Отправить
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
