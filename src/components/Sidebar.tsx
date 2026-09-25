import styles from './Sidebar.module.css';

interface SidebarProps {
    chatName: string;
}

export function Sidebar({chatName}: SidebarProps) {
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>Чаты</div>
            <div className={styles.chatList}>
                <div className={`${styles.chatItem} ${styles.chatItemActive}`}>
                    <span className={styles.chatName}>{chatName}</span>
                    <span className={styles.chatHint}>Нажмите, чтобы открыть</span>
                </div>
            </div>
        </div>
    );
}
