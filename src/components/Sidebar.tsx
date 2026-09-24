import styles from './Sidebar.module.css';

interface SidebarProps {
    chatName: string;
}

export function Sidebar({chatName}: SidebarProps) {
    return (
        <div className={styles.sidebar}>
            <h2>Чаты</h2>
            <div className={styles.chatItem}>
                <strong>{chatName}</strong>
                <p className={styles.chatHint}>Нажмите, чтобы открыть</p>
            </div>
        </div>
    );
}
