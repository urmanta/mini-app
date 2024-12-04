import { useState, useCallback } from 'react';
import CircularTimer from '../components/CircularTimer';
import './MovePage.css';

const MovePage = () => {
    const [currentSpeed, setCurrentSpeed] = useState(0);
    
    const handleComplete = useCallback(() => {
        // Handle workout completion
        console.log('Workout completed!');
    }, []);
    
    const handleSpeedUpdate = useCallback((speed: number) => {
        setCurrentSpeed(speed);
    }, []);

    return (
        <div className="move-page">
            <h1>Stride</h1>
            <div className="timer-container">
                <CircularTimer
                    duration={6000}
                    onComplete={handleComplete}
                    onSpeedUpdate={handleSpeedUpdate}
                />
            </div>
        </div>
    );
};

export default MovePage;
