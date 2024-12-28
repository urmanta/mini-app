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
    const [coins, setCoins] = useState(120);

    return (
        <div className="move-page">
            <StrideCoins coins={coins} />
            <div className="timer-container">
                <CircularTimer
                    duration={1500}
                />
            </div>
            <StreakChart />
        </div>
    );
};

export default MovePage;
