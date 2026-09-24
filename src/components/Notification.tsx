import {useState, useEffect} from 'react';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export function Notification({message, type, onClose}: NotificationProps) {
    const [isVisible, setIsVisible] = useState(false);

    // Появление и автоматическое скрытие через 3 секунды
    useEffect(() => {
        const showTimer = setTimeout(() => setIsVisible(true), 10);
        const hideTimer = setTimeout(() => setIsVisible(false), 2000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    // Когда анимация завершается (и мы скрываемся), вызываем onClose
    const handleTransitionEnd = () => {
        if (!isVisible) {
            onClose();
        }
    };

    return (
        <div
            onTransitionEnd={handleTransitionEnd}
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                padding: '15px 25px',
                borderRadius: '8px',
                backgroundColor: type === 'success' ? '#4caf50' : '#f44336',
                color: '#fff',
                boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                zIndex: 1000,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
            }}
        >
            <span>{message}</span>
            <button
                onClick={() => setIsVisible(false)}
                style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: 'bold',
                }}
            >
                ✕
            </button>
        </div>
    );
}
