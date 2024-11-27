import { useEffect, useState, useRef } from "react";

// Constants for step detection
const ACCEL_THRESHOLD = 1.2; // Acceleration threshold for step detection
const GYRO_THRESHOLD = 0.8; // Gyroscope threshold for movement detection
const SPEED_THRESHOLD = 0.5; // Speed threshold in meters/second
const LOW_PASS_ALPHA = 0.8; // Low-pass filter coefficient

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

declare global {
    interface Window {
        Telegram: {
            WebApp: {
                Accelerometer: {
                    start: (params: unknown, callback: () => void) => void;
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
                };
                onEvent: (eventType: string, callback: () => void) => void;
                offEvent: (eventType: string, callback: () => void) => void;
                ready: () => void;
                platform: string;
            };
        };
    }
}

const useStepCounter = () => {
    const [stepCount, setStepCount] = useState(0);
    const [isMoving, setIsMoving] = useState(false);
    const [sensorsAvailable, setSensorsAvailable] = useState(false);
    const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

    const lastStepTime = useRef(Date.now());
    const prevAccelMagnitude = useRef(0);
    const isRotating = useRef(false);
    const currentSpeed = useRef(0);

    const webapp = window.Telegram.WebApp;

    // Low-pass filter to reduce noise
    const lowPassFilter = (value: number, prevValue: number, alpha: number = LOW_PASS_ALPHA) => {
        return alpha * prevValue + (1 - alpha) * value;
    };

    const handleAccelerometer = function(this: AccelerometerEvent) {
        const { x, y, z } = webapp.Accelerometer;
        
        // Calculate acceleration magnitude
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const filteredMagnitude = lowPassFilter(magnitude, prevAccelMagnitude.current);

        // console.log('this >>>> ', this);
        // console.log('magnitude >>>> ', magnitude);
        // console.log('filteredMagnitude >>>> ', filteredMagnitude);

        const now = Date.now();
        const timeDiff = now - lastStepTime.current;

        // Detect step based on acceleration and rotation
        // Note: We don't require speed check if location permission is denied
        if (Math.abs(filteredMagnitude - prevAccelMagnitude.current) > ACCEL_THRESHOLD && 
            timeDiff > 250 && // Minimum 250ms between steps
            isRotating.current) {
            console.log('steps', stepCount);
            setStepCount(prev => prev + 1);
            lastStepTime.current = now;
            setIsMoving(true);
        } else if (timeDiff > 1000) {
            setIsMoving(false);
        }

        prevAccelMagnitude.current = filteredMagnitude;
    };

    const handleGyroscope = function(this: GyroscopeData) {
        const { x, y, z } = webapp.Gyroscope;
        
        // Detect rotation based on beta (forward/backward tilt) and gamma (left/right tilt)
        const rotationMagnitude = Math.sqrt(x * x + y * y + z * z);

        // console.log('rotationMagnitude >>>> ', rotationMagnitude);
        isRotating.current = rotationMagnitude > GYRO_THRESHOLD;
    };

    const handleLocation = function(this: LocationData) {
        // console.log('this.speed >>>> ', this.speed);
        if (this.speed !== null) {
            currentSpeed.current = this.speed;
            setIsMoving(this.speed > SPEED_THRESHOLD);
        }
    };

    const requestLocationPermission = function (this: LocationData) {
        console.log('this.isLocationAvailable >>>>>> ', this.isLocationAvailable);
        console.log('this.isAccessGranted >>>>>> ', this.isAccessGranted);
        setLocationPermission(this.isLocationAvailable && this.isAccessGranted);
    };

    useEffect(() => {
        if (!window.Telegram || !window.Telegram.WebApp) {
            console.warn("Telegram WebApp API недоступен.");
            return;
        }
        
        // Check if sensors are available
        const checkSensors = () => {
            const hasAccel = Boolean(webapp.Accelerometer);
            const hasGyro = Boolean(webapp.Gyroscope);
            const hasLocation = Boolean(webapp.LocationManager);

            setSensorsAvailable(hasAccel && hasGyro && hasLocation);
            return hasAccel && hasGyro && hasLocation;
        };

        // Initialize sensors
        const initSensors = () => {
            if (!checkSensors()) {
                console.warn('Some sensors are not available');
                return;
            }

            // Start motion sensors
            webapp.Accelerometer.start({}, () => {console.log('Accelerometer started')});
            webapp.Gyroscope.start();

            // Add motion event listeners
            webapp.onEvent('accelerometerChanged', handleAccelerometer);
            webapp.onEvent('gyroscopeChanged', handleGyroscope);

            webapp.LocationManager.init(() => {
                console.log('LocationManager inited');
                webapp.LocationManager.getLocation((data) => {
                    console.log('data >>>> ', data)
                })
            });
            webapp.onEvent('locationRequested', handleLocation);
        };

        // Wait for WebApp to be ready
        // webapp.ready();
        initSensors();

        // Cleanup
        return () => {
            if (sensorsAvailable) {
                webapp.Accelerometer.stop();
                webapp.Gyroscope.stop();
                
                webapp.offEvent('accelerometerChanged', handleAccelerometer);
                webapp.offEvent('gyroscopeChanged', handleGyroscope);
            }
        };
    }, []);

    return {
        stepCount,
        isMoving,
        sensorsAvailable,
        locationPermission
    };
};

export default useStepCounter;
