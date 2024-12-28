import { useEffect, useState, useRef } from "react";
import useWebApp from "./useWebApp";

interface AccelerometerEvent {
    x: number;
    y: number;
    z: number;
}

interface GyroscopeData {
    x: number;
    y: number;
    z: number;
}

interface accumulateData {
    accX: number,
    accY: number,
    accZ: number,
    latitude: number,
    longitude: number,
    speed: number | null
}

const useStepCounter = () => {
    const [sensorsAvailable, setSensorsAvailable] = useState(false); // Доступность сенсоров
    const [locationPermission, setLocationPermission] = useState<boolean | null>(null); // Права на геолокацию
    const [currentSpeed, setCurrentSpeed] = useState<number | null>(null); // Текущая скорость
    const [accData, setAccData] = useState<accumulateData[]>([]);

    const webapp = useWebApp() || window.Telegram.WebApp;

    // Обновление скорости из LocationManager
    const updateSpeedFromLocation = () => {
        console.log('locationPermission', locationPermission);
        // if (locationPermission) return;

        webapp.LocationManager.getLocation((data) => {
            const { speed } = data; // Скорость в метрах/секунду
            setCurrentSpeed(speed);
        });
    };

    const accumulateData = () => {
        const { x: accX, y: accY, z: accZ } = webapp.Accelerometer;
        const { x: gyroX, y: gyroY, z: gyroZ } = webapp.Gyroscope; 

        webapp.LocationManager.getLocation((data) => {
            const { speed, latitude, longitude } = data;

            setAccData(prev => [...prev, { accX, accY, accZ, gyroX, gyroY, gyroZ, latitude, longitude, speed }]);
        });
    }

    // Инициализация сенсоров
    useEffect(() => {
        if (!window.Telegram || !window.Telegram.WebApp) {
            console.warn("Telegram WebApp API недоступен.");
            return;
        }

        // Проверка наличия сенсоров
        const checkSensors = () => {
            const hasAccel = Boolean(webapp.Accelerometer);
            const hasGyro = Boolean(webapp.Gyroscope);
            const hasLocation = Boolean(webapp.LocationManager);

            setSensorsAvailable(hasAccel && hasGyro && hasLocation);
            return hasAccel && hasGyro && hasLocation;
        };

        // Инициализация сенсоров
        const initSensors = () => {
            if (!checkSensors()) {
                console.warn("Some sensors are not available");
                return;
            }

            // Запуск сенсоров
            webapp.Accelerometer.start();
            webapp.Gyroscope.start();

            // Инициализация геолокации
            webapp.LocationManager.init(() => {
                const { isInited, isLocationAvailable, isAccessGranted } = webapp.LocationManager;

                const permission = isInited && isLocationAvailable && isAccessGranted;

                if (!permission) webapp.LocationManager.openSettings();

                setLocationPermission(permission);

                // Получение начальной скорости
                updateSpeedFromLocation();

                // Обновление скорости с периодичностью
                const locationInterval = setInterval(updateSpeedFromLocation, 1000); // Обновляем каждую секунду

                // Очистка интервала при размонтировании
                return () => clearInterval(locationInterval);
            });

            // Слушатели событий
            webapp.onEvent('accelerometerChanged', accumulateData);
        };

        // Ожидаем готовности WebApp и инициализируем сенсоры
        initSensors();

        // Очистка после размонтирования
        return () => {
            if (sensorsAvailable) {
                webapp.Accelerometer.stop();
                webapp.Gyroscope.stop();

                webapp.offEvent('accelerometerChanged', accumulateData);
            }
        };
    }, []);

    return {
        accData,
        sensorsAvailable,
        locationPermission,
        currentSpeed,
    };
};

export default useStepCounter;
