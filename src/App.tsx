import {useState, useEffect} from 'react';
import {sendMessage, receiveNotification, deleteNotification} from './api/greenApi';
import {type ChatMessage, type GreenApiCredentials} from './types';
import {Sidebar} from './components/Sidebar';
import {ChatWindow} from './components/ChatWindow';

function App() {
    const [credentials, setCredentials] = useState<GreenApiCredentials>({
        idInstance: '',
        apiTokenInstance: '',
    });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const handleSend = async () => {
        if (!credentials.idInstance || !credentials.apiTokenInstance || !phoneNumber || !message) {
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        try {
            await sendMessage(credentials, phoneNumber, message);
            setMessages((prev) => [...prev, {id: Date.now().toString(), text: message, sender: 'me'}]);
            setMessage('');
        } catch (error) {
            alert('Ошибка при отправке. Проверьте ключи и номер телефона.');
        }
    };

    useEffect(() => {
        if (!credentials.idInstance || !credentials.apiTokenInstance) return;

        const interval = setInterval(async () => {
            const notification = await receiveNotification(credentials);

            if (notification && notification.body) {
                const body = notification.body;
                const incomingText = body.messageData?.textMessageData?.textMessage;

                if (incomingText) {
                    setMessages((prev) => [
                        ...prev,
                        {id: notification.receiptId.toString(), text: incomingText, sender: 'them'},
                    ]);
                }

                await deleteNotification(credentials, notification.receiptId);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [credentials]);

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
        </div>
    );
}

export default App;
