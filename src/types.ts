// Ключи для доступа к GREEN-API
export interface GreenApiCredentials {
    idInstance: string;
    apiTokenInstance: string;
}

// Одно сообщение в чате
export interface ChatMessage {
    id: string;
    text: string;
    sender: 'me' | 'them';
}
