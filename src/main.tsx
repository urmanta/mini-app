import React from 'react';
import { createRoot, Container } from 'react-dom/client';
import App from './App';
import { miniApp, viewport, mainButton, shareURL, mockTelegramEnv, parseInitData } from '@telegram-apps/sdk';

const initializeTelegramSDK = async () => {
    try {
        // Попытка инициализировать настоящее окружение Telegram
        console.log("Инициализация окружения Telegram");
        await miniApp.ready();
    } catch (error) {
        // В случае ошибки инициализируем фейковое окружение
        console.error('Ошибка при инициализации Telegram:', error);

        const initDataRaw = new URLSearchParams([
            ['user', JSON.stringify({
                id: 99281932,
                first_name: 'Andrew',
                last_name: 'Rogue',
                username: 'rogue',
                language_code: 'en',
                is_premium: true,
                allows_write_to_pm: true,
            })],
            ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
            ['auth_date', '1716922846'],
            ['start_param', 'debug'],
            ['chat_type', 'sender'],
            ['chat_instance', '8428209589180549439'],
        ]).toString();

        mockTelegramEnv({
            themeParams: {
                accentTextColor: '#6ab2f2',
                bgColor: '#17212b',
                buttonColor: '#5288c1',
                buttonTextColor: '#ffffff',
                destructiveTextColor: '#ec3942',
                headerBgColor: '#fcb69f',
                hintColor: '#708499',
                linkColor: '#6ab3f3',
                secondaryBgColor: '#232e3c',
                sectionBgColor: '#17212b',
                sectionHeaderTextColor: '#6ab3f3',
                subtitleTextColor: '#708499',
                textColor: '#f5f5f5',
            },
            initData: parseInitData(initDataRaw),
            initDataRaw,
            version: '7.2',
            platform: 'tdesktop',
        });

        console.log('Mock Telegram environment initialized');
    }
};

// Инициализация SDK
initializeTelegramSDK();

const container = document.getElementById('root') as Container;
const root = createRoot(container);

console.log('miniApp', miniApp.mount.isAvailable());

if (viewport.expand.isAvailable()) {
    viewport.expand();
}

if (miniApp.setHeaderColor.isAvailable()) {
    miniApp.setHeaderColor('#fcb69f');
}

if (miniApp.mount.isAvailable()) {
    miniApp.mount();

    mainButton.setParams({
        backgroundColor: '#aa1388',
        text: 'Поделиться очками',
        isVisible: true,
        isEnabled: true,
    });

// Установка обработчика нажатия на главную кнопку
    mainButton.onClick(() => {
        try {
            // Получение текущих очков из localStorage
            const score = localStorage.getItem('memory-game-score') || 0;
            shareURL(`Посмотрите! У меня ${score} очков в игре!`);
            console.log('Окно выбора чата открыто для отправки сообщения.');
        } catch (error) {
            console.error('Ошибка при открытии окна выбора чата:', error);
        }
    });
}

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);