import { useState, useCallback } from 'react';
import CircularTimer from '../components/CircularTimer';
import StrideCoins from '../components/StrideCoins/StrideCoins';
import './MovePage.css';

const MovePage = () => {
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const [coins, setCoins] = useState(120); // This would be fetched from backend

    const handleComplete = useCallback(() => {
        // Handle workout completion
        console.log('Workout completed!');
    }, []);

    const handleSpeedUpdate = useCallback((speed: number) => {
        setCurrentSpeed(speed);
    }, []);

    return (
        <div className="move-page">
            <StrideCoins coins={coins} />
            <h1>Stride</h1>
            <div className="timer-container">
                <CircularTimer
                    duration={1200}
                    onComplete={handleComplete}
                    onSpeedUpdate={handleSpeedUpdate}
                />
            </div>
        </div>
    );
};

export default MovePage;
