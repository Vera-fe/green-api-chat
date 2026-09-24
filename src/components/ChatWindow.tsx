import {useRef, useEffect} from 'react';
import type {ChatMessage, GreenApiCredentials} from '../types';
import styles from './ChatWindow.module.css';

interface ChatWindowProps {
    chatName: string;
    messages: ChatMessage[];
    credentials: GreenApiCredentials;
    setCredentials: (creds: GreenApiCredentials) => void;
    phoneNumber: string;
    setPhoneNumber: (phone: string) => void;
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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    return (
        <div className={styles.chatWindow}>
            <div className={styles.header}>
                <h3>{chatName}</h3>
                <div className={styles.inputRow}>
                    <input
                        type="text"
                        placeholder="idInstance"
                        value={credentials.idInstance}
                        onChange={(e) => setCredentials({...credentials, idInstance: e.target.value})}
                        className={styles.inputField}
                    />
                    <input
                        type="text"
                        placeholder="apiTokenInstance"
                        value={credentials.apiTokenInstance}
                        onChange={(e) => setCredentials({...credentials, apiTokenInstance: e.target.value})}
                        className={styles.inputField}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Номер телефона получателя (например, 79991112233)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={styles.phoneInput}
                />
            </div>

            <div className={styles.messagesArea}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`${styles.message} ${msg.sender === 'me' ? styles.messageMe : styles.messageThem}`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.inputArea}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onSend();
                        }
                    }}
                    placeholder="Введите сообщение..."
                    className={styles.messageInput}
                />
                <button onClick={onSend} className={styles.sendButton}>
                    Отправить
                </button>
            </div>
        </div>
    );
}
