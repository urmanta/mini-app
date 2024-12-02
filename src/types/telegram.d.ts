interface LocationData {
    isInited: boolean;
    isLocationAvailable: boolean;
    isAccessRequested: boolean;
    isAccessGranted: boolean;
    latitude: number;
    longitude: number;
    speed: number | null;
    direction: number | null;
}

interface Window {
    Telegram: {
        WebApp: {
            Accelerometer: {
                start: () => void;
                stop: () => void;
                x: number;
                y: number;
                z: number;
            };
            Gyroscope: {
                start: () => void;
                stop: () => void;
                x: number;
                y: number;
                z: number;
            };
            LocationManager: {
                init: (callback: () => void) => void;
                getLocation: (callback: (data: LocationData) => void) => void;
                openSettings: () => void;
                isLocationAvailable: boolean;
                isAccessRequested: boolean;
                isAccessGranted: boolean;
                isInited: boolean;
            };
            onEvent: (eventType: string, callback: () => void) => void;
            offEvent: (eventType: string, callback: () => void) => void;
            ready: () => void;
            expand: () => void;
            platform: string;
        };
    };
}