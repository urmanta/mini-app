interface TelegramWebApp {
    WebApp: {
        onEvent(event: string, callback: (data: any) => void): void;
        offEvent(event: string, callback: (data: any) => void): void;
        showAlert(message: string): void;
    };
}

declare global {
    interface Window {
        Telegram: TelegramWebApp;
    }
}
