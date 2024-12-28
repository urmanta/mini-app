import { useState, useCallback, useEffect } from 'react';
import CircularTimer from '../../components/CircularTimer';
import StrideCoins from '../../components/StrideCoins';
import StreakChart from '../../components/StreakChart';
import { startWalk, updateWalk, stopWalk } from '../../api/walkApi';
import type { walkUpdateResponse } from '../../api/types';
import useInitData from '../../hooks/useInitData';
import useStepCounter from '../../hooks/useStepCounter';
import './MovePage.css';

const MovePage = () => {
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const [coins, setCoins] = useState(120);
    const [walkId, setWalkId] = useState<number | null>(null);
    const [walkStats, setWalkStats] = useState<walkUpdateResponse | null>(null);
    const [initDataUnsafe, initData] = useInitData();
    const { id } = initDataUnsafe?.user || {};
    
    const { accumulatedData, initSensors } = useStepCounter();

    const handleStart = useCallback(async () => {
        if (id) {
            try {
                initSensors(); // Initialize sensors when starting the walk
                const response = await startWalk({ telegram_id: id });
                setWalkId(response.walk_id);
            } catch (error) {
                console.error('Failed to start walk:', error);
            }
        }
    }, [id, initSensors]);

    const handleComplete = useCallback(async () => {
        if (walkId) {
            try {
                const response = await stopWalk({ walk_id: walkId });
                setCoins(prev => prev + response.reward);
                setWalkId(null);
            } catch (error) {
                console.error('Failed to stop walk:', error);
            }
        }
    }, [walkId]);

    const handleSpeedUpdate = useCallback(async (speed: number) => {
        if (!walkId) return;

        console.log('accumulatedData', accumulatedData);

        try {
            const walkData = {
                walk_id: walkId,
                accX: accumulatedData[accumulatedData.length - 1]?.accX || 0,
                accY: accumulatedData[accumulatedData.length - 1]?.accY || 0,
                accZ: accumulatedData[accumulatedData.length - 1]?.accZ || 0,
                latitude: accumulatedData[accumulatedData.length - 1]?.latitude || 0,
                longitude: accumulatedData[accumulatedData.length - 1]?.longitude || 0,
                speed: speed
            };

            const response = await updateWalk(walkData);
            setCurrentSpeed(response.current_speed);
            setWalkStats(response);
        } catch (error) {
            console.error('Failed to update walk:', error);
        }
    }, [walkId, accumulatedData]);

    return (
        <div className="move-page">
            <StrideCoins coins={coins} />
            <div className="timer-container">
                <CircularTimer
                    duration={1500}
                    onComplete={handleComplete}
                    onStart={handleStart}
                    onSpeedUpdate={handleSpeedUpdate}
                />
            </div>
            {walkStats && (
                <div className="walk-stats">
                    <p>Steps: {walkStats.steps}</p>
                    <p>Distance: {walkStats.distance}m</p>
                    <p>Average Speed: {walkStats.average_speed} km/h</p>
                </div>
            )}
            <StreakChart />
        </div>
    );
};

export default MovePage;
