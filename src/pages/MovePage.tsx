import { useState, useCallback } from 'react';
import CircularTimer from '../components/CircularTimer';
import './MovePage.css';

const MovePage = () => {
    // In a real app, this would come from your backend
    const [energy] = useState(100);
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
                    duration={600} // 10 minutes in seconds
                    energy={energy}
                    onComplete={handleComplete}
                    onSpeedUpdate={handleSpeedUpdate}
                />
            </div>
        </div>
    );
};

export default MovePage;
