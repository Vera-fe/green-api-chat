import {useState, useEffect} from 'react';
import styles from './Notification.module.css';

interface NotificationProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export function Notification({message, type, onClose}: NotificationProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const showTimer = setTimeout(() => setIsVisible(true), 10);
        const hideTimer = setTimeout(() => setIsVisible(false), 2000);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    useEffect(() => {
        if (!isVisible) {
            const closeTimer = setTimeout(onClose, 300);
            return () => clearTimeout(closeTimer);
        }
    }, [isVisible, onClose]);

    return (
        <div
            className={`${styles.notification} ${type === 'success' ? styles.success : styles.error}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            }}
        >
            <span>{message}</span>
            <button onClick={() => setIsVisible(false)} className={styles.closeButton}>
                ✕
            </button>
        </div>
    );
}
