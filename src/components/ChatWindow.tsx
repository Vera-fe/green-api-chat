import {useRef, useEffect} from 'react';
import {type ChatMessage, type GreenApiCredentials} from '../types';

interface ChatWindowProps {
    chatName: string;
    messages: ChatMessage[];
    // Пропсы для ключей
    credentials: GreenApiCredentials;
    setCredentials: (creds: GreenApiCredentials) => void;
    // Пропсы для номера телефона
    phoneNumber: string;
    setPhoneNumber: (phone: string) => void;
    // Пропсы для поля ввода
    message: string;
    setMessage: (msg: string) => void;
    onSend: () => void;
}

export function ChatWindow({
    chatName,
    messages,
    credentials,
    setCredentials,
    phoneNumber,
    setPhoneNumber,
    message,
    setMessage,
    onSend,
}: ChatWindowProps) {
    // Ссылка на конец ленты сообщений для авто-прокрутки
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Автоматическая прокрутка вниз при новом сообщении
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    return (
        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            {/* Шапка с ключами */}
            <div style={{padding: '20px', borderBottom: '1px solid #ccc', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <h3 style={{margin: 0}}>{chatName}</h3>
                <div style={{display: 'flex', gap: '10px'}}>
                    <input
                        type="text"
                        placeholder="idInstance"
                        value={credentials.idInstance}
                        onChange={(e) => setCredentials({...credentials, idInstance: e.target.value})}
                        style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1}}
                    />
                    <input
                        type="text"
                        placeholder="apiTokenInstance"
                        value={credentials.apiTokenInstance}
                        onChange={(e) => setCredentials({...credentials, apiTokenInstance: e.target.value})}
                        style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc', flex: 1}}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Номер телефона получателя (например, 79991112233)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}
                />
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
                            boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
                {/* Пустой div для прокрутки */}
                <div ref={messagesEndRef} />
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
                <button
                    onClick={onSend}
                    style={{padding: '10px 20px', borderRadius: '20px', border: 'none', backgroundColor: '#007bff', color: '#fff', cursor: 'pointer'}}
                >
                    Отправить
                </button>
            </div>
        </div>
    );
}
